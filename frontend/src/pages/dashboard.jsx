import React, { useEffect, useState } from "react";
import NavLinks from "../components/navLinks";
import useAspirantesStore from "../store/useAspirantesStore";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const { aspirantes, loading, error, fetchAspirantes } = useAspirantesStore();
  const [totals, setTotals] = useState({
    venta: { precio: 0, peso: 0 },
    compra: { precio: 0, peso: 0 },
  });
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchAspirantes(); // Carga inicial de datos
  }, [fetchAspirantes]);

  useEffect(() => {
    applyFilter();
  }, [aspirantes, filterType]);

  useEffect(() => {
    calculateTotals();
  }, [filteredData]);

  const applyFilter = () => {
    if (filterType === "all") {
      setFilteredData(aspirantes);
    } else {
      const now = new Date();
      const filtered = aspirantes.filter((aspirante) => {
        const aspiranteDate = new Date(aspirante.date_create);
        if (filterType === "week") {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return aspiranteDate >= oneWeekAgo;
        } else if (filterType === "month") {
          return aspiranteDate.getMonth() === now.getMonth();
        }
        return true;
      });
      setFilteredData(filtered);
    }
  };

  const calculateTotals = () => {
    const initialTotals = {
      venta: { precio: 0, peso: 0 },
      compra: { precio: 0, peso: 0 },
    };

    filteredData.forEach((aspirante) => {
      const { estado, precio, peso } = aspirante;
      if (estado === "venta" || estado === "compra") {
        initialTotals[estado].precio += precio;
        initialTotals[estado].peso += peso;
      }
    });

    setTotals(initialTotals);
  };

  // Datos para la gráfica de stock
  const productTypes = ["Seco", "Caturra", "Variedad Colombia", "F6", "Borboun Rosado", "Geishar", "Tabi", "Variedad Castillo"];
  const stockData = productTypes.map((type) => {
    return filteredData.filter((aspirante) => aspirante.tipo_cafe === type).length;
  });

  const chartData = {
    labels: productTypes,
    datasets: [
      {
        label: "Cantidad de Productos",
        data: stockData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="text-center text-lg mt-10">Cargando datos...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error al cargar datos: {error}</div>;

  return (
    <div className="aside-dashboard flex">
      <div>
        <NavLinks className="flex" />
      </div>
      
      <div className=" main-dashboard">  

      
      <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por:</label>
        <select
          className="border border-gray-300 rounded-lg p-2"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Mostrar Todo</option>
          <option value="week">Última Semana</option>
          <option value="month">Último Mes</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-5">
        {/* Card para Ventas */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Totales de Ventas</h2>
          <p className="text-sm text-gray-600">
            <strong>Precio Total:</strong> ${totals.venta.precio}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Peso Total:</strong> {totals.venta.peso} g
          </p>
        </div>

        {/* Card para Compras */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Totales de Compras</h2>
          <p className="text-sm text-gray-600">
            <strong>Precio Total:</strong> ${totals.compra.precio}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Peso Total:</strong> {totals.compra.peso} g
          </p>
        </div>
      </div>

      <div className="mt-10 bg-white shadow-md rounded-lg p-6 border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráfica de Stock de Productos</h2>
  <div className="w-full max-w-sm">
    <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>
</div>
      
    </div>
  );
}

export default Dashboard;
