import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Estado para controlar el diálogo
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navegación */}
      <nav className="w-full bg-green-800 h-20 p-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="text-3xl text-white font-bold tracking-wide">Café Campesino</div>
        <div className="flex space-x-6">
          <Link 
            to="/login" 
            className="text-lg text-white hover:text-gray-300 transition-colors duration-200 font-semibold"
          >
            Iniciar Sesiónnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
          </Link>
        </div>

      </nav>
      <menu className=' bg-white w-full h-20'>
        
      </menu>

      {/* Sección principal */}
      <section 
  className="w-full bg-cover bg-center text-white flex justify-center items-center" 
  style={{ 
    backgroundImage: "url('https://cdn.leonardo.ai/users/5663631f-e53a-413e-bd2f-3c164fc61885/generations/cfda9541-c488-44e1-bbbd-4b2895c88b11/Leonardo_Kino_XL_Cosecha_ManualProductores_locales_recogen_el_0.jpg')", 
    height: "70vh",  // Ajuste de la altura
    minHeight: "500px"  // Altura mínima
  }}
>
  <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg">
    <h1 className="text-5xl font-bold mb-4">Café Directo de Nuestros Productores</h1>
    <p className="text-xl mb-8">
      Apoyamos a los campesinos comprando café directamente desde las montañas.
    </p>
    <button
      onClick={openDialog}
      className="bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 shadow-lg transition-all"
    >
      Saber Más
    </button>
  </div>
</section>




      {/* Galería de imágenes */}
      <section className=" mt-5 py-16 ">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Nuestros Productores y Procesos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg transition hover:shadow-xl">
              <img 
                src="https://cdn.leonardo.ai/users/5663631f-e53a-413e-bd2f-3c164fc61885/generations/cfda9541-c488-44e1-bbbd-4b2895c88b11/Leonardo_Kino_XL_Cosecha_ManualProductores_locales_recogen_el_3.jpg" 
                alt="Finca de café" 
                className="w-full h-56 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-semibold mb-2">Cosecha Manual</h3>
              <p className="text-gray-600">
                Productores locales recogen el café de manera manual, seleccionando solo los mejores granos.
              </p>
            </div>

            <div className=" p-6 rounded-lg shadow-lg transition hover:shadow-xl">
              <img 
                src="https://cdn.leonardo.ai/users/5663631f-e53a-413e-bd2f-3c164fc61885/generations/65250166-4b2b-4ee1-82e0-9d631a8c1491/Leonardo_Kino_XL_crea_una_plantacion_de_cafe_1.jpg" 
                alt="Secado al sol" 
                className="w-full h-56 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-semibold mb-2">Secado al Sol</h3>
              <p className="text-gray-600">
                El secado natural al sol es clave para preservar el sabor auténtico del café.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-lg transition hover:shadow-xl">
              <img 
                src="https://cdn.leonardo.ai/users/5663631f-e53a-413e-bd2f-3c164fc61885/generations/79c06944-96be-489e-bdce-dca716470587/Leonardo_Kino_XL_Seleccin_de_GranosLos_mejores_granos_se_selec_1.jpg" 
                alt="Granos de café" 
                className="w-full h-56 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-semibold mb-2">Selección de Granos</h3>
              <p className="text-gray-600">
                Los mejores granos se seleccionan para asegurar la mayor calidad de cada taza de café.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de ubicación */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Nuestra Ubicación</h2>
          <p className="text-xl mb-8">
            Estamos ubicados en el corazón de las montañas, donde se cultiva el mejor café.
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.8350111737464!2d-74.00594168459325!3d40.7127759793311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c91fbb7%3A0xa0b71b5d60f6bb7b!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1632831626469!5m2!1sen!2sin"
            className="w-full h-96 border-0 rounded-lg shadow-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Botón adicional para abrir diálogo */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={openDialog}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 shadow-lg transition-all"
        >
          Contactar
        </button>
      </div>

      {/* Diálogo */}
      {isDialogOpen && (
        <div>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeDialog}  // Cierra al hacer click fuera del diálogo
          />

          {/* Diálogo */}
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-md">
              <h2 className="text-3xl font-bold mb-4">Contacta con Nosotros</h2>
              <p className="mb-4">
                ¿Interesado en saber más sobre cómo apoyamos a los productores locales? ¡Envíanos un mensaje!
              </p>
              <form>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Tu email"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    className="w-full px-4 py-2 border rounded"
                    rows="4"
                    placeholder="Tu mensaje"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 shadow-lg transition-all"
                >
                  Enviar
                </button>
              </form>
              <button
                onClick={closeDialog}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pie de página */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Café Campesino. Todos los derechos reservados.</p>
          <p className="mt-2 text-gray-400">Comprometidos con el comercio justo y el apoyo a nuestros productores locales.</p>
        </div>
      </footer>
    </div>
  );
}
