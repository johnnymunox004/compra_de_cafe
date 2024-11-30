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
  
  // Estados para selector de semana
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekOfMonth, setSelectedWeekOfMonth] = useState(1);
  const [isCurrentWeek, setIsCurrentWeek] = useState(true);

  // Estado para la gráfica
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

  // Función para obtener el rango de la semana actual
  const getCurrentWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { start: startOfWeek, end: endOfWeek };
  };

  // Función para obtener el rango de fechas de una semana específica de un mes
  const getSpecificWeekRange = (year, month, weekOfMonth) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = new Date(firstDayOfMonth);
    
    // Ajustar al primer día de la primera semana
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (firstDayOfMonth.getDay() === 0 ? 0 : 7 - firstDayOfMonth.getDay()));
    
    // Calcular el inicio de la semana específica
    const startDate = new Date(firstDayOfWeek);
    startDate.setDate(startDate.getDate() + ((weekOfMonth - 1) * 7));
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    return { start: startDate, end: endDate };
  };

  // Función para filtrar aspirantes por rango de fechas
  const filterAspirantesByDateRange = (aspirantesArray, start, end) => {
    return aspirantesArray.filter(aspirante => {
      const aspiranteDate = new Date(aspirante.date_create);
      return aspiranteDate >= start && aspiranteDate <= end;
    });
  };

  useEffect(() => {
    if (aspirantes.length > 0) {
      // Determinar el rango de fechas para filtrar
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
        precio: parseFloat(aspirante.precio),
        estado: aspirante.estado,
        tipo_cafe: aspirante.tipo_cafe,
        peso: parseFloat(aspirante.peso),
      }));

      // Calcular totales
      const totalCompra = processedAspirantes
        .filter(aspirante => aspirante.estado === "compra")
        .reduce((acc, aspirante) => acc + (aspirante.precio || 0), 0);

      const totalVenta = processedAspirantes
        .filter(aspirante => aspirante.estado === "venta")
        .reduce((acc, aspirante) => acc + (aspirante.precio || 0), 0);

      const totalCafe = processedAspirantes
        .filter(aspirante => aspirante.estado === "compra")
        .reduce((acc, aspirante) => acc + (aspirante.peso || 0), 0) -
        processedAspirantes
        .filter(aspirante => aspirante.estado === "venta")
        .reduce((acc, aspirante) => acc + (aspirante.peso || 0), 0);

      const numeroCompras = processedAspirantes.filter(aspirante => aspirante.estado === "compra").length;
      const numeroVentas = processedAspirantes.filter(aspirante => aspirante.estado === "venta").length;

      setTotalCompra(totalCompra);
      setTotalVenta(totalVenta);
      setTotalCafe(totalCafe);
      setNumeroCompras(numeroCompras);
      setNumeroVentas(numeroVentas);

      // Calcular datos para la gráfica
      const coffeeTypes = ['seco','Caturra', 'Variedad Colombia', 'F6', 'Borboun Rosado', 'Geishar', 'Tabi', 'Variedad Castillo'];
      const weights = coffeeTypes.map(type => {
        return processedAspirantes
          .filter(aspirante => aspirante.tipo_cafe === type)
          .reduce((acc, aspirante) => acc + (aspirante.peso || 0), 0);
      });

      setChartData({
        labels: coffeeTypes,
        datasets: [{
          label: 'Peso de café (kg)',
          data: weights,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      });
    } else {
      // Resetear todos los estados si no hay aspirantes
      setTotalCompra(0);
      setTotalVenta(0);
      setTotalCafe(0);
      setNumeroCompras(0);
      setNumeroVentas(0);
      setChartData({ labels: [], datasets: [] });
    }
  }, [aspirantes, selectedYear, selectedMonth, selectedWeekOfMonth, isCurrentWeek]);

  // Generar años desde 2020 hasta el actual
  const years = Array.from(
    { length: new Date().getFullYear() - 2020 + 1 }, 
    (_, i) => 2020 + i
  );

  // Meses en español
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Generar semanas (1-5)
  const weeks = [1, 2, 3, 4, 5];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="aside-dashboard">
      <div>
        <NavLinks />
      </div>

      <div className="main-dashboard">
        <h1 className="font-bold text-3xl">Almacen</h1>

        {/* Botón de semana actual */}
        <div className="week-selector mb-4 flex space-x-2">
          <button 
            onClick={() => setIsCurrentWeek(true)}
            className={`px-4 py-2 rounded ${isCurrentWeek ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Semana Actual
          </button>
          <button 
            onClick={() => setIsCurrentWeek(false)}
            className={`px-4 py-2 rounded ${!isCurrentWeek ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Semana Específica
          </button>
        </div>

        {/* Selectores para semana específica (solo visibles cuando no está en semana actual) */}
        {!isCurrentWeek && (
          <div className="week-specific-selector mb-4 flex space-x-2">
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="p-2 border rounded"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="p-2 border rounded"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>

            <select 
              value={selectedWeekOfMonth} 
              onChange={(e) => setSelectedWeekOfMonth(parseInt(e.target.value))}
              className="p-2 border rounded"
            >
              {weeks.map(week => (
                <option key={week} value={week}>Semana {week}</option>
              ))}
            </select>
          </div>
        )}

        {/* Mostrar rango de fechas */}
        <div className="week-label mb-4">
          <p className="text-lg font-semibold">
            {isCurrentWeek 
              ? 'Semana Actual' 
              : `Semana ${selectedWeekOfMonth} de ${months[selectedMonth]} ${selectedYear}`
            }
          </p>
        </div>

        {/* Resto del código de Dashboard igual que antes */}
        <div className="targeta">
          <div className="card">
            <h2 className="card-title">Total Comprado</h2>
            <p className="card-content">{formatCurrency(totalCompra)}</p>
          </div>

          <div className="card">
            <h2 className="card-title">Total Vendido</h2>
            <p className="card-content">{formatCurrency(totalVenta)}</p>
          </div>

          <div className="card">
            <h2 className="card-title">Café Disponible</h2>
            <p className="card-content">{totalCafe} kg</p>
          </div>

          <div className="card">
            <h2 className="card-title">Número de Compras</h2>
            <p className="card-content">{numeroCompras}</p>
            <h2 className="card-title">Número de Ventas</h2>
            <p className="card-content">{numeroVentas}</p>
          </div>
        </div>

        {/* Gráfica de barras */}
        <div className="barras">
          <h2 className="bar-chart-title">Peso de Café por Tipo</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;