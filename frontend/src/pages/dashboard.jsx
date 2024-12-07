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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const { aspirantes, loading, error, fetchAspirantes } = useAspirantesStore();
  const [totals, setTotals] = useState({
    venta: { precio: 0, peso: 0 },
    compra: { precio: 0, peso: 0 },
    pendientes: 0,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchAspirantes(); // Carga inicial de datos
  }, [fetchAspirantes]);

  useEffect(() => {
    applyFilter();
  }, [aspirantes, filterType, selectedWeek, selectedMonth]);

  useEffect(() => {
    calculateTotals();
  }, [filteredData]);

  const applyFilter = () => {
    if (filterType === "all") {
      setFilteredData(aspirantes);
    } else {
      const filtered = aspirantes.filter((aspirante) => {
        const aspiranteDate = new Date(aspirante.date_create);
        if (filterType === "week" && selectedWeek) {
          const [weekYear, weekNumber] = selectedWeek.split("-W");
          const aspiranteWeek = getISOWeekNumber(aspiranteDate);
          return (
            aspiranteWeek.year === parseInt(weekYear) &&
            aspiranteWeek.week === parseInt(weekNumber)
          );
        } else if (filterType === "month" && selectedMonth) {
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

  const calculateTotals = () => {
    const initialTotals = {
      venta: { precio: 0, peso: 0 },
      compra: { precio: 0, peso: 0 },
      pendientes: 0,
    };

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

  const getISOWeekNumber = (date) => {
    const tempDate = new Date(date);
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
    return { year: tempDate.getUTCFullYear(), week: weekNumber };
  };

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

  const stockData = productTypes.map((type) => {
    return (
      filteredData
        .filter((aspirante) => aspirante.tipo_cafe === type)
        .reduce((sum, aspirante) => sum + aspirante.peso, 0) / 1000 // Convertir a kg
    );
  });

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

  if (loading)
    return <div className="text-center text-lg mt-10">Cargando datos...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Error al cargar datos: {error}
      </div>
    );

  return (
    <div className="aside-dashboard flex">
      <div>
        <NavLinks className="flex" />
      </div>

      <div className="main-dashboard">
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

        {filterType === "week" && (
          <input
            type="week"
            className="border border-gray-300 rounded-lg p-2 mt-2"
            onChange={(e) => setSelectedWeek(e.target.value)}
          />
        )}

        {filterType === "month" && (
          <input
            type="month"
            className="border border-gray-300 rounded-lg p-2 mt-2"
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
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

          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Estado Monetario: Pendientes
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Total Pendientes:</strong> {totals.pendientes}
            </p>
          </div>
        </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Gráfica de Stock de Productos (Peso en Kg)
          </h2>
          <div className="w-1/2 h-1/3">
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
