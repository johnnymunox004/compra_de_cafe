import React, { useEffect } from "react";
import NavLinks from "../components/navLinks";
import useAspirantesStore from "../store/useAspirantesStore";

function Dashboard() {
  const { aspirantes, loading, error, fetchAspirantes } = useAspirantesStore();

  useEffect(() => {
    fetchAspirantes(); // Llamamos a la función para obtener los datos al cargar el componente
  }, [fetchAspirantes]);

  if (loading) return <div className="text-center text-lg mt-10">Cargando datos...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error al cargar datos: {error}</div>;

  return (
    <div className="aside-dashboard bg-gray-100 min-h-screen p-5">
      <div>
        <NavLinks />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {aspirantes.map((aspirante) => (
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
