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

  useEffect(() => {
    if (aspirantes.length > 0) {
      const filtered = aspirantes.map(aspirante => ({
        id: aspirante.id,
        precio: parseFloat(aspirante.precio),
        estado: aspirante.estado,
        tipo_cafe: aspirante.tipo_cafe,
        peso: parseFloat(aspirante.peso),
      }));

      setFilteredAspirantes(filtered);

      // Actualizar totales
      const totalCompra = filtered
        .filter(aspirante => aspirante.estado === "compra")
        .reduce((acc, aspirante) => acc + (aspirante.precio || 0), 0);

      const totalVenta = filtered
        .filter(aspirante => aspirante.estado === "venta")
        .reduce((acc, aspirante) => acc + (aspirante.precio || 0), 0);

      const totalCafe = filtered
        .filter(aspirante => aspirante.estado === "compra")
        .reduce((acc, aspirante) => acc + (aspirante.peso || 0), 0) -
        filtered
        .filter(aspirante => aspirante.estado === "venta")
        .reduce((acc, aspirante) => acc + (aspirante.peso || 0), 0);

      const numeroCompras = filtered.filter(aspirante => aspirante.estado === "compra").length;
      const numeroVentas = filtered.filter(aspirante => aspirante.estado === "venta").length;

      setTotalCompra(totalCompra);
      setTotalVenta(totalVenta);
      setTotalCafe(totalCafe);
      setNumeroCompras(numeroCompras);
      setNumeroVentas(numeroVentas);

      // Calcular datos para la gráfica
      const coffeeTypes = ['Caturra', 'Variedad Colombia', 'F6', 'Borboun Rosado', 'Geishar', 'Tabi', 'Variedad Castillo'];
      const weights = coffeeTypes.map(type => {
        return filtered
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
      setTotalCompra(0);
      setTotalVenta(0);
      setTotalCafe(0);
      setNumeroCompras(0);
      setNumeroVentas(0);
      setChartData({ labels: [], datasets: [] }); // Resetear gráfica
    }
  }, [aspirantes]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="aside-dashboard">
      <div>
        <NavLinks />
      </div>

      <div className="main-dashboard">
        <h1 className=" font-bold text-3xl ">almacen </h1>

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
