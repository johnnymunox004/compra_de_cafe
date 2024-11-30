import React, { useEffect, useState } from "react";
import NavLinks from '../components/navLinks';
import useAspirantesStore from "../store/useAspirantesStore";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const {
    fetchAspirantes,
    aspirantes,
    loading,
    error,
  } = useAspirantesStore();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  const [totalCompra, setTotalCompra] = useState(0);
  const [totalVenta, setTotalVenta] = useState(0);
  const [totalCafe, setTotalCafe] = useState(0);
  const [numeroCompras, setNumeroCompras] = useState(0);
  const [numeroVentas, setNumeroVentas] = useState(0);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekOfMonth, setSelectedWeekOfMonth] = useState(1);
  const [isCurrentWeek, setIsCurrentWeek] = useState(true);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Peso de café (kg)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  useEffect(() => {
    fetchAspirantes();
  }, [fetchAspirantes]);

  const getCurrentWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { start: startOfWeek, end: endOfWeek };
  };

  const getSpecificWeekRange = (year, month, weekOfMonth) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = new Date(firstDayOfMonth);
    firstDayOfWeek.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    const startDate = new Date(firstDayOfWeek);
    startDate.setDate(startDate.getDate() + ((weekOfMonth - 1) * 7));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return { start: startDate, end: endDate };
  };

  const filterAspirantesByDateRange = (aspirantesArray, start, end) => {
    return aspirantesArray.filter(aspirante => {
      const aspiranteDate = new Date(aspirante.date_create);
      return aspiranteDate >= start && aspiranteDate <= end;
    });
  };

  useEffect(() => {
    if (aspirantes.length > 0) {
      let filtered;
      if (isCurrentWeek) {
        const { start, end } = getCurrentWeekRange();
        filtered = filterAspirantesByDateRange(aspirantes, start, end);
      } else {
        const { start, end } = getSpecificWeekRange(selectedYear, selectedMonth, selectedWeekOfMonth);
        filtered = filterAspirantesByDateRange(aspirantes, start, end);
      }

      const processedAspirantes = filtered.map(aspirante => ({
        id: aspirante._id,
        precio: parseFloat(aspirante.precio) || 0,
        estado: aspirante.estado,
        tipo_cafe: aspirante.tipo_cafe,
        peso: parseFloat(aspirante.peso) || 0,
      }));

      const totalCompra = processedAspirantes
        .filter(a => a.estado === "compra")
        .reduce((acc, a) => acc + a.precio, 0);

      const totalVenta = processedAspirantes
        .filter(a => a.estado === "venta")
        .reduce((acc, a) => acc + a.precio, 0);

      const totalCafe = processedAspirantes
        .filter(a => a.estado === "compra")
        .reduce((acc, a) => acc + a.peso, 0) - 
        processedAspirantes
        .filter(a => a.estado === "venta")
        .reduce((acc, a) => acc + a.peso, 0);

      const numeroCompras = processedAspirantes.filter(a => a.estado === "compra").length;
      const numeroVentas = processedAspirantes.filter(a => a.estado === "venta").length;

      setTotalCompra(totalCompra);
      setTotalVenta(totalVenta);
      setTotalCafe(totalCafe);
      setNumeroCompras(numeroCompras);
      setNumeroVentas(numeroVentas);

      const coffeeTypes = ['seco', 'Caturra', 'Variedad Colombia', 'F6', 'Borboun Rosado', 'Geishar', 'Tabi', 'Variedad Castillo'];
      const weights = coffeeTypes.map(type =>
        processedAspirantes
          .filter(a => a.tipo_cafe === type)
          .reduce((acc, a) => acc + a.peso, 0)
      );

      setChartData({
        labels: coffeeTypes,
        datasets: [{
          label: 'Peso de café (kg)',
          data: weights,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      });
    } else {
      setTotalCompra(0);
      setTotalVenta(0);
      setTotalCafe(0);
      setNumeroCompras(0);
      setNumeroVentas(0);
      setChartData({ labels: [], datasets: [] });
    }
  }, [aspirantes, selectedYear, selectedMonth, selectedWeekOfMonth, isCurrentWeek]);

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weeks = [1, 2, 3, 4, 5];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="aside-dashboard">
      <NavLinks />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="filters">
          <label>
            Año:
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
          <label>
            Mes:
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {months.map((month, index) => <option key={index} value={index}>{month}</option>)}
            </select>
          </label>
          <label>
            Semana:
            <select value={selectedWeekOfMonth} onChange={(e) => setSelectedWeekOfMonth(parseInt(e.target.value))}>
              {weeks.map(week => <option key={week} value={week}>{week}</option>)}
            </select>
          </label>
          <button onClick={() => setIsCurrentWeek(true)}>Esta semana</button>
        </div>
        <div className="stats">
          <p>Total Compras: {formatCurrency(totalCompra)}</p>
          <p>Total Ventas: {formatCurrency(totalVenta)}</p>
          <p>Peso Neto Café: {totalCafe} kg</p>
          <p>Número de Compras: {numeroCompras}</p>
          <p>Número de Ventas: {numeroVentas}</p>
        </div>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;
