import jsPDF from 'jspdf';
import { Button } from 'flowbite-react';
import React from 'react';


function GeneradorPDF({ id, nombre, telefono, correo, file, Identificación, Teléfono, sexo, edad }) {
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
    doc.text(`file: ${file}`, 14, 100);


    // Agregar línea de separación
    doc.setLineWidth(0.5);
    doc.line(14, 115, 200, 115);

    // Información adicional
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Este documento ha sido generado automáticamente.`, 14, 110);
    doc.text(`Fecha de creación: ${new Date().toLocaleDateString()}`, 14, 120);

    // Guardar el PDF con un nombre específico
    doc.save(`PerfilUsuario${id}.pdf`);
  };

  return (
    <div>
      <Button color="success" className='mr-2 w-full' onClick={generarPDF}>Generar PDF</Button>
    </div>
  );
}

export default GeneradorPDF;
