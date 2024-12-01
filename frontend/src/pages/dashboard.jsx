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

  // Llamar a fetchAspirantes cuando el componente se monta
  useEffect(() => {
    fetchAspirantes();
  }, []);

  // Debug log para store
  useEffect(() => {
    console.log('Aspirantes Store:', {
      aspirantes,
      loading,
      error
    });
  }, [aspirantes, loading, error]);

  // Resto del código permanece igual...

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  // Años disponibles
  const years = Array.from(
    { length: new Date().getFullYear() - 2020 + 1 }, 
    (_, i) => 2020 + i
  );

  // Meses en español
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Semanas disponibles
  const weeks = [1, 2, 3, 4, 5];

  // Función para obtener la semana actual del mes
  function getCurrentWeek() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    
    // Calcular en qué semana está el día actual
    return Math.ceil(currentDate / 7);
  }

  // Estados para resumen semanal
  const [weeklySummary, setWeeklySummary] = useState({
    totalCompra: 0,
    totalVenta: 0,
    totalGramos: 0,
    totalPrecioTotal: 0,
    tiposCafe: {},
    estadosMonetarios: {}
  });

  // Estados para selector de semana
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekOfMonth, setSelectedWeekOfMonth] = useState(getCurrentWeek());

  // Estado para la gráfica
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Gramos por Tipo de Café',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  // Función para obtener rango de fechas de una semana específica
  const getWeekDateRange = (year, month, weekOfMonth) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Calcular inicio de la semana
    const startDate = new Date(year, month, 1 + (weekOfMonth - 1) * 7);
    
    // Ajustar si cae antes del primer día del mes
    while (startDate.getMonth() !== month) {
      startDate.setDate(startDate.getDate() + 1);
    }
    
    // Calcular fecha final
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    // Asegurar que no se exceda del último día del mes
    if (endDate > lastDayOfMonth) {
      endDate.setDate(lastDayOfMonth.getDate());
    }
    
    return { 
      start: startDate, 
      end: endDate 
    };
  };

  // Filtrar aspirantes por semana
  const filterAspirantesByWeek = (aspirantesArray, year, month, weekOfMonth) => {
    const { start, end } = getWeekDateRange(year, month, weekOfMonth);
    
    return aspirantesArray.filter(aspirante => {
      // Parsear fecha del aspirante
      const fechaAspirante = new Date(aspirante.date_create || aspirante.fecha);
      
      // Verificar si la fecha es válida y está dentro del rango de la semana
      return !isNaN(fechaAspirante.getTime()) && 
             fechaAspirante >= start && 
             fechaAspirante <= end;
    });
  };

  // Efecto para preparar datos cuando cambian los aspirantes o la semana seleccionada
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

      // Preparar datos para la gráfica
      const chartLabels = Object.keys(summary.tiposCafe);
      const chartData = Object.values(summary.tiposCafe);

      setChartData({
        labels: chartLabels,
        datasets: [{
          label: 'Gramos por Tipo de Café',
          data: chartData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      });
    }
  }, [aspirantes, selectedYear, selectedMonth, selectedWeekOfMonth]);

  // Renderizado condicional para manejar estado de carga y errores
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (aspirantes.length === 0) return <div>No hay datos disponibles</div>;

  return (
    <div>
      {/* Aquí agregarías la renderización de tu dashboard */}
      <h1>Dashboard de Aspirantes</h1>
      {/* Ejemplo de renderización de gráfica */}
      <Bar 
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Gramos por Tipo de Café'
            }
          }
        }}
      />
      {/* Agregar más elementos del dashboard según necesites */}
    </div>
  );
}

export default Dashboard;