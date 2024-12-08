// Import necessary React hooks and dependencies
import React, { useEffect, useState } from "react";
import NavLinks from "../components/navLinks";
import useAspirantesStore from "../store/useAspirantesStore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components for bar chart functionality
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  // Destructure state and methods from custom hook for managing aspirantes (candidates/applicants)
  const { aspirantes, loading, error, fetchAspirantes } = useAspirantesStore();

  // State to track totals for sales, purchases, and pending items
  const [totals, setTotals] = useState({
    venta: { precio: 0, peso: 0 },
    compra: { precio: 0, peso: 0 },
    pendientes: 0,
  });

  // State for filtering and managing data display
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Initial data fetch when component mounts
  useEffect(() => {
    fetchAspirantes(); // Load initial data
  }, [fetchAspirantes]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilter();
  }, [aspirantes, filterType, selectedWeek, selectedMonth]);

  // Recalculate totals when filtered data changes
  useEffect(() => {
    calculateTotals();
  }, [filteredData]);

  // Filter data based on selected filter type (all, week, or month)
  const applyFilter = () => {
    if (filterType === "all") {
      setFilteredData(aspirantes);
    } else {
      // Filter aspirantes based on week or month selection
      const filtered = aspirantes.filter((aspirante) => {
        const aspiranteDate = new Date(aspirante.date_create);
        if (filterType === "week" && selectedWeek) {
          // Week-based filtering logic
          const [weekYear, weekNumber] = selectedWeek.split("-W");
          const aspiranteWeek = getISOWeekNumber(aspiranteDate);
          return (
            aspiranteWeek.year === parseInt(weekYear) &&
            aspiranteWeek.week === parseInt(weekNumber)
          );
        } else if (filterType === "month" && selectedMonth) {
          // Month-based filtering logic
          const [monthYear, monthNumber] = selectedMonth.split("-");
          return (
            aspiranteDate.getFullYear() === parseInt(monthYear) &&
            aspiranteDate.getMonth() + 1 === parseInt(monthNumber)
          );
        }
        return false;
      });
      setFilteredData(filtered);
    }
  };

  // Calculate total sales, purchases, and pending items
  const calculateTotals = () => {
    const initialTotals = {
      venta: { precio: 0, peso: 0 },
      compra: { precio: 0, peso: 0 },
      pendientes: 0,
    };

    // Aggregate totals from filtered data
    filteredData.forEach((aspirante) => {
      const { estado, precio, peso, estado_monetario } = aspirante;
      if (estado === "venta" || estado === "compra") {
        initialTotals[estado].precio += precio;
        initialTotals[estado].peso += peso;
      }
      if (estado_monetario === "pendiente") {
        initialTotals.pendientes += 1;
      }
    });

    setTotals(initialTotals);
  };

  // Helper function to calculate ISO week number
  const getISOWeekNumber = (date) => {
    const tempDate = new Date(date);
    tempDate.setUTCDate(
      tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7)
    );
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
    return { year: tempDate.getUTCFullYear(), week: weekNumber };
  };

  // Define product types for stock chart
  const productTypes = [
    "Seco",
    "Caturra",
    "Variedad Colombia",
    "F6",
    "Borboun Rosado",
    "Geishar",
    "Tabi",
    "Variedad Castillo",
  ];

  // Calculate stock data for each product type
  const stockData = productTypes.map((type) => {
    return (
      filteredData
        .filter((aspirante) => aspirante.tipo_cafe === type)
        .reduce((sum, aspirante) => sum + aspirante.peso, 0) 
    );
  });

  // Prepare data for bar chart
  const chartData = {
    labels: productTypes,
    datasets: [
      {
        label: "Peso en Kilogramos",
        data: stockData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Handle loading and error states
  if (loading)
    return <div className="text-center text-lg mt-10">Cargando datos...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Error al cargar datos: {error}
      </div>
    );

  // Render dashboard layout
  return (
    <div className="aside-dashboard flex">
      {/* Navigation Links */}
      <div>
        <NavLinks className="flex" />
      </div>

      <div className="main-dashboard">
        {/* Filter Selection */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por:
        </label>
        <select
          className="border border-gray-300 rounded-lg p-2"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Mostrar Todo</option>
          <option value="week">Por Semana</option>
          <option value="month">Por Mes</option>
        </select>

        {/* Week Filter Input */}
        {filterType === "week" && (
          <input
            type="week"
            className="border border-gray-300 rounded-lg p-2 mt-2"
            onChange={(e) => setSelectedWeek(e.target.value)}
          />
        )}

        {/* Month Filter Input */}
        {filterType === "month" && (
          <input
            type="month"
            className="border border-gray-300 rounded-lg p-2 mt-2"
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        )}

        {/* Totals Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {/* Sales Totals Card */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Totales de Ventas
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Precio Total:</strong> ${totals.venta.precio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Peso Total:</strong> {totals.venta.peso} g
            </p>
          </div>

          {/* Purchases Totals Card */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Totales de Compras
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Precio Total:</strong> ${totals.compra.precio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Peso Total:</strong> {totals.compra.peso} g
            </p>
          </div>

          {/* Pending Items Card */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Estado Monetario: Pendientes
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Total Pendientes:</strong> {totals.pendientes}
            </p>
          </div>
        </div>

        {/* Stock Chart */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 p-4">
          Gráfica de Stock de Productos (Peso en g)
        </h2>
        <div className="w-1/2 h-96">
          <Bar
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;