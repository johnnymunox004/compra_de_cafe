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

  const [filteredAspirantes, setFilteredAspirantes] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);
  const [totalVenta, setTotalVenta] = useState(0);
  const [totalCafe, setTotalCafe] = useState(0);
  const [numeroCompras, setNumeroCompras] = useState(0);
  const [numeroVentas, setNumeroVentas] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(null);

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

  // Función para obtener el rango de fechas de una semana específica
  const getWeekRange = (weekOffset = 0) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (weekOffset * 7)));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { start: startOfWeek, end: endOfWeek };
  };

  // Función para filtrar aspirantes por semana
  const filterAspirantesByWeek = (aspirantesArray, weekOffset = 0) => {
    const { start, end } = getWeekRange(weekOffset);
    return aspirantesArray.filter(aspirante => {
      const aspiranteDate = new Date(aspirante.fecha); // Assuming there's a 'fecha' field
      return aspiranteDate >= start && aspiranteDate <= end;
    });
  };

  useEffect(() => {
    if (aspirantes.length > 0) {
      // Filtrar aspirantes por semana si se ha seleccionado
      const filtered = selectedWeek !== null 
        ? filterAspirantesByWeek(aspirantes, selectedWeek)
        : aspirantes;

      const processedAspirantes = filtered.map(aspirante => ({
        id: aspirante.id,
        precio: parseFloat(aspirante.precio),
        estado: aspirante.estado,
        tipo_cafe: aspirante.tipo_cafe,
        peso: parseFloat(aspirante.peso),
      }));

      // Actualizar totales
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
  }, [aspirantes, selectedWeek]);

  // Función para obtener el texto descriptivo de la semana
  const getWeekLabel = (weekOffset) => {
    const { start, end } = getWeekRange(weekOffset);
    return `Semana del ${start.toLocaleDateString()} al ${end.toLocaleDateString()}`;
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="aside-dashboard">
      <div>
        <NavLinks />
      </div>

      <div className="main-dashboard">
        <h1 className="font-bold text-3xl">Almacen</h1>

        {/* Botones de selección de semana */}
        <div className="week-selector mb-4">
          <button 
            className={`mr-2 px-4 py-2 rounded ${selectedWeek === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedWeek(null)}
          >
            Todas las semanas
          </button>
          {[-1, 0, 1].map((weekOffset) => (
            <button
              key={weekOffset}
              className={`mr-2 px-4 py-2 rounded ${selectedWeek === weekOffset ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedWeek(weekOffset)}
            >
              {weekOffset < 0 ? 'Semana anterior' : weekOffset === 0 ? 'Semana actual' : 'Próxima semana'}
            </button>
          ))}
        </div>

        {/* Mostrar la semana seleccionada */}
        {selectedWeek !== null && (
          <div className="week-label mb-4">
            <p className="text-lg font-semibold">{getWeekLabel(selectedWeek)}</p>
          </div>
        )}

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