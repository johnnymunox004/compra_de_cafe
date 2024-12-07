import React, { useState } from 'react';
import ImageSlider from '../components/slider.jsx'

export default function Home() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navegación */}
      <nav className="w-full bg-green-800 h-20 p-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="text-3xl text-white font-bold tracking-wide">
          <h1>Café de Natagá - Coopsantuario</h1>
        </div>
        <div className="flex space-x-6">
          <a 
            href="/productos"
            className="text-lg text-white hover:text-gray-300 transition-colors duration-200 font-semibold"
          >
            Nuestro Café
          </a>
          <a 
            href="/login" 
            className="text-lg text-white hover:text-gray-300 transition-colors duration-200 font-semibold"
          >
            Iniciar Sesión
          </a>
        </div>
      </nav>

      {/* Hero Section con contenido optimizado */}
      <section 
        className="w-full bg-cover bg-center text-white flex justify-center items-center" 
        style={{ 
          backgroundImage: "url('/api/placeholder/1200/800')", 
          height: "70vh",
          minHeight: "500px"
        }}
      >
        <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg">
          <h2 className="text-5xl font-bold mb-4">Café Premium de Natagá - Coopsantuario</h2>
          <p className="text-xl mb-8">
            El mejor café de altura cultivado por productores locales de Natagá. 
            Certificado por Coopsantuario para garantizar la máxima calidad.
          </p>
          <button
            onClick={openDialog}
            className="bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 shadow-lg transition-all"
          >
            Comprar Café de Natagá
          </button>
        </div>
      </section>

      {/* Sección de características con palabras clave */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">¿Por qué elegir café de Natagá?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Altura Premium</h3>
              <p>Cultivado a más de 1,700 metros sobre el nivel del mar en Natagá, Huila.</p>
            </article>
            <article className="p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Certificado Coopsantuario</h3>
              <p>Respaldado por la cooperativa líder en café de especialidad de la región.</p>
            </article>
            <article className="p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Comercio Justo</h3>
              <p>Apoyo directo a familias productoras de café en Natagá.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
          <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Contacta con Nosotros</h2>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <textarea
                  placeholder="Tu mensaje"
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <p>Dirección: Natagá, Huila, Colombia</p>
              <p>Email: hola</p>
              <p>Tel: +57 XXX XXX XXXX</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="/productos" className="hover:text-gray-300">Nuestro Café</a></li>
                <li><a href="/sobre-nataga" className="hover:text-gray-300">Sobre Natagá</a></li>
                <li><a href="/coopsantuario" className="hover:text-gray-300">Coopsantuario</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Certificaciones</h3>
              <p>Certificado por Coopsantuario</p>
              <p>Café de Altura Premium</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p>&copy; 2024 Café de Natagá - Coopsantuario. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  

    <div>
      <ImageSlider />
    </div>
    </div>
  );
}
