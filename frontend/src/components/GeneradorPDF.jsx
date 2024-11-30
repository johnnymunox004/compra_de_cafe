import jsPDF from 'jspdf';
import { Button } from 'flowbite-react';
import React from 'react';

function GeneradorPDF({ 
  id, 
  nombre, 
  telefono, 
  tipo_cafe, 
  peso, 
  precio, 
  estado, 
  estado_monetario, 
  date_create 
}) {
  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Configuración de estilos
    doc.setFontSize(12);
    
    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO DE PAGO', 105, 20, { align: 'center' });
    doc.text('Comprobante de Transacción', 105, 27, { align: 'center' });
    
    // Línea decorativa
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Información de la transacción
    doc.setFont('helvetica', 'normal');
    doc.text(`Número de Transacción: ${id}`, 20, 45);
    doc.text(`Fecha: ${new Date(date_create).toLocaleDateString()}`, 20, 52);
    
    // Detalles del cliente
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Cliente', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${nombre}`, 20, 72);
    doc.text(`Teléfono: ${telefono}`, 20, 79);
    
    // Detalles de la compra
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles de la Compra', 20, 92);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tipo de Café: ${tipo_cafe}`, 20, 99);
    doc.text(`Peso: ${peso} kg`, 20, 106);
    
    // Información de Pago
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Pago', 20, 119);
    doc.setFont('helvetica', 'normal');
    doc.text(`Precio Total: $${precio}`, 20, 126);
    doc.text(`Estado: ${estado}`, 20, 133);
    doc.text(`Estado Monetario: ${estado_monetario}`, 20, 140);
    
    // Línea final
    doc.setLineWidth(0.5);
    doc.line(20, 150, 190, 150);
    
    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Gracias por su compra', 105, 160, { align: 'center' });
    doc.text('Este documento es un comprobante de transacción', 105, 165, { align: 'center' });
    
    // Código QR o número de verificación (simulado)
    doc.text(`Código de Verificación: ${id.substring(0, 8)}`, 105, 175, { align: 'center' });

    // Guardar PDF
    doc.save(`Recibo_${id}.pdf`);
  };

  return (
    <div>
      <Button 
        color="success" 
        className='mr-2 w-full' 
        onClick={generarPDF}
      >
        Generar Recibo
      </Button>
    </div>
  );
}

export default GeneradorPDF;