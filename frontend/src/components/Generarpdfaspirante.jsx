import React from 'react';
import jsPDF from 'jspdf';

function GeneradorPDF({ id, nombre, telefono, correo,  Identificación, Teléfono, sexo, edad }) {
  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Títulos y estilos
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');

    // Contenido del PDF
    doc.text(`Perfil del Usuario - ID: ${id}`, 14, 20);

    // Datos del usuario
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${nombre}`, 14, 30);
    doc.text(`Teléfono: ${telefono}`, 14, 40);
    doc.text(`Correo: ${correo}`, 14, 50);
    doc.text(`Identificación: ${Identificación}`, 14, 60);
    doc.text(`Teléfono: ${Teléfono}`, 14, 70);
    doc.text(`Sexo: ${sexo}`, 14, 80);
    doc.text(`Edad: ${edad}`, 14, 90);

    // Agregar línea de separación
    doc.setLineWidth(0.5);
    doc.line(14, 100, 200, 100);

    // Información adicional
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Este documento ha sido generado automáticamente.`, 14, 110);
    doc.text(`Fecha de creación: ${new Date().toLocaleDateString()}`, 14, 116);

    // Guardar el PDF con un nombre específico
    doc.save(`PerfilUsuario${id}.pdf`);
  };

  return (
    <div>
      <button className='bg-green-700 w-full h-12 p-3 flex justify-center text-white' onClick={generarPDF}>Generar PDF</button>
    </div>
  );
}

export default GeneradorPDF;
