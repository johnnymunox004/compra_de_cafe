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

  // Estados para resumen semanal
  const [weeklySummary, setWeeklySummary] = useState({
    totalCompra: 0,
    totalVenta: 0,
    totalGramos: 0,
    totalPrecioTotal: 0, // New field for total precio_total
    tiposCafe: {},
    estadosMonetarios: {} // New field to track estado_monetario
  });

  // ... [rest of the existing state and utility functions remain the same]

  // Modificar la función de procesamiento de aspirantes
  useEffect(() => {
    if (aspirantes.length > 0) {
      // Filtrar aspirantes de la semana seleccionada
      const filteredAspirantes = filterAspirantesByWeek(
        aspirantes, 
        selectedYear, 
        selectedMonth, 
        selectedWeekOfMonth
      );

      // Calcular resumen semanal
      const summary = {
        totalCompra: 0,
        totalVenta: 0,
        totalGramos: 0,
        totalPrecioTotal: 0,
        tiposCafe: {},
        estadosMonetarios: {}
      };

      // Tipos de café predefinidos
      const coffeeTypes = [
        'seco', 'Caturra', 'Variedad Colombia', 'F6', 
        'Borboun Rosado', 'Geishar', 'Tabi', 'Variedad Castillo'
      ];

      // Inicializar tipos de café en 0
      coffeeTypes.forEach(type => {
        summary.tiposCafe[type] = 0;
      });

      // Procesar cada aspirante filtrado
      filteredAspirantes.forEach(aspirante => {
        const peso = parseFloat(aspirante.peso) || 0;
        const precio = parseFloat(aspirante.precio) || 0;
        const precioTotal = parseFloat(aspirante.precio_total) || 0;

        if (aspirante.estado === 'compra') {
          summary.totalCompra += precio;
          summary.totalGramos += peso;
          summary.totalPrecioTotal += precioTotal;
          
          // Acumular gramos por tipo de café
          if (summary.tiposCafe.hasOwnProperty(aspirante.tipo_cafe)) {
            summary.tiposCafe[aspirante.tipo_cafe] += peso;
          }
        } else if (aspirante.estado === 'venta') {
          summary.totalVenta += precio;
          summary.totalGramos -= peso;
        }

        // Trackear estados monetarios
        if (aspirante.estado_monetario) {
          summary.estadosMonetarios[aspirante.estado_monetario] = 
            (summary.estadosMonetarios[aspirante.estado_monetario] || 0) + 1;
        }
      });

      // Actualizar estado con el resumen
      setWeeklySummary(summary);

      // ... [rest of the chart data preparation remains the same]
    }
  }, [aspirantes, selectedYear, selectedMonth, selectedWeekOfMonth]);

  // Modificar la vista para mostrar información adicional
  return (
    <div className="aside-dashboard">
      {/* ... [previous code remains the same] */}

      {/* Resumen semanal */}
      <div className="targeta grid grid-cols-3 gap-4 mb-6"> {/* Changed to 3 columns */}
        <div className="card bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Total Comprado</h2>
          <p className="text-2xl">{formatCurrency(weeklySummary.totalCompra)}</p>
        </div>
        <div className="card bg-green-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Total Vendido</h2>
          <p className="text-2xl">{formatCurrency(weeklySummary.totalVenta)}</p>
        </div>
        <div className="card bg-yellow-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Precio Total</h2>
          <p className="text-2xl">{formatCurrency(weeklySummary.totalPrecioTotal)}</p>
        </div>
        <div className="card bg-yellow-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Gramos Totales</h2>
          <p className="text-2xl">{weeklySummary.totalGramos.toFixed(2)} g</p>
        </div>
      </div>

      {/* Mostrar estados monetarios */}
      {Object.keys(weeklySummary.estadosMonetarios).length > 0 && (
        <div className="estados-monetarios mb-6">
          <h2 className="text-xl font-bold mb-4">Estados Monetarios</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(weeklySummary.estadosMonetarios).map(([estado, count]) => (
              <div key={estado} className="card bg-purple-100 p-4 rounded">
                <h3 className="text-lg font-semibold">{estado}</h3>
                <p className="text-2xl">{count} registros</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ... [rest of the code remains the same] */}
    </div>
  );
}

export default Dashboard;