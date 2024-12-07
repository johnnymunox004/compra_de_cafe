import React, { useEffect, useState } from "react";
import NavLinks from "../components/navLinks";
import useAspirantesStore from "../store/useAspirantesStore";

function Dashboard() {
  const { aspirantes, loading, error, fetchAspirantes } = useAspirantesStore();
  const [filteredAspirantes, setFilteredAspirantes] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");

  useEffect(() => {
    fetchAspirantes(); // Carga inicial de datos
  }, [fetchAspirantes]);

  useEffect(() => {
    filterAspirantes(); // Filtra aspirantes cada vez que cambia el filtro
  }, [filterType, selectedMonth, selectedWeek, aspirantes]);

  const filterAspirantes = () => {
    if (filterType === "all") {
      setFilteredAspirantes(aspirantes);
      return;
    }

    let filtered = aspirantes;

    if (filterType === "week" && selectedWeek) {
      const [start, end] = getWeekRange(selectedWeek);
      filtered = aspirantes.filter(
        (aspirante) =>
          new Date(aspirante.date_create) >= start &&
          new Date(aspirante.date_create) <= end
      );
    }

    if (filterType === "month" && selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      filtered = aspirantes.filter((aspirante) => {
        const date = new Date(aspirante.date_create);
        return date.getFullYear() === parseInt(year) && date.getMonth() === parseInt(month) - 1;
      });
    }

    setFilteredAspirantes(filtered);
  };

  const getWeekRange = (weekString) => {
    const [year, week] = weekString.split("-W");
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (parseInt(week) - 1) * 7;
    const startOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return [startOfWeek, endOfWeek];
  };

  if (loading) return <div className="text-center text-lg mt-10">Cargando datos...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error al cargar datos: {error}</div>;

  return (
    <div className=" bg-gray-100 min-h-screen p-5 flex">
      <div>
        <NavLinks className="flex" />
      </div>

      <div className="my-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <select
          className="border border-gray-300 rounded-lg p-2"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Mostrar Todo</option>
          <option value="week">Seleccionar Semana</option>
          <option value="month">Seleccionar Mes</option>
        </select>

        {filterType === "week" && (
          <input
            type="week"
            className="border border-gray-300 rounded-lg p-2"
            onChange={(e) => setSelectedWeek(e.target.value)}
          />
        )}

        {filterType === "month" && (
          <input
            type="month"
            className="border border-gray-300 rounded-lg p-2"
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {filteredAspirantes.map((aspirante) => (
          <div
            key={aspirante.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {aspirante.nombre}
            </h2>
            <p className="text-sm text-gray-600">
              <strong>Identificación:</strong> {aspirante.identificacion}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Tipo de Café:</strong> {aspirante.tipo_cafe}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Peso:</strong> {aspirante.peso} g
            </p>
            <p className="text-sm text-gray-600">
              <strong>Precio:</strong> ${aspirante.precio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Estado:</strong> {aspirante.estado}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Estado Monetario:</strong> {aspirante.estado_monetario}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Teléfono:</strong> {aspirante.telefono}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fecha:</strong> {new Date(aspirante.date_create).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
