import React, { useEffect, useState } from "react";
import NavLinks from "../components/navLinks";
import useAspirantesStore from "../store/useAspirantesStore";

function Dashboard() {
  const { aspirantes, loading, error, fetchAspirantes } = useAspirantesStore();
  const [totals, setTotals] = useState({
    venta: { precio: 0, peso: 0 },
    compra: { precio: 0, peso: 0 },
  });

  useEffect(() => {
    fetchAspirantes(); // Carga inicial de datos
  }, [fetchAspirantes]);

  useEffect(() => {
    calculateTotals();
  }, [aspirantes]);

  const calculateTotals = () => {
    const initialTotals = {
      venta: { precio: 0, peso: 0 },
      compra: { precio: 0, peso: 0 },
    };

    aspirantes.forEach((aspirante) => {
      const { estado, precio, peso } = aspirante;
      if (estado === "venta" || estado === "compra") {
        initialTotals[estado].precio += precio;
        initialTotals[estado].peso += peso;
      }
    });

    setTotals(initialTotals);
  };

  if (loading) return <div className="text-center text-lg mt-10">Cargando datos...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error al cargar datos: {error}</div>;

  return (
    <div className="aside-dashboard bg-gray-100 min-h-screen p-5">
      <div>
        <NavLinks />
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
    </div>
  );
}

export default Dashboard;
