import React, { useState } from 'react';

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/api/placeholder/100/100" 
              alt="Coopsantuario Logo" 
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Coopsantuario
            </h1>
          </div>
          <div className="flex space-x-6">
            <a 
              href="/comprar-cafe-nataga" 
              className="text-gray-700 hover:text-green-700 transition-colors font-medium"
              title="Comprar Café de Natagá"
            >
              Comprar Café
            </a>
            <a 
              href="/login" 
              className="text-gray-700 hover:text-green-700 transition-colors font-medium"
              title="Sobre Café Natagá"
            >
              iniciar
            </a>
       
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Café de Natagá: Calidad Premium
            </h2>
            <p className="text-xl text-gray-600">
              Descubre el sabor auténtico de Natagá. Café de especialidad cultivado 
              con pasión por la cooperativa Coopsantuario.
            </p>
            <div className="flex space-x-4">
              <a 
                href="/comprar-cafe-nataga"
                className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors shadow-md"
                title="Comprar Café de Alta Calidad Natagá"
              >
                Comprar Café Natagá
              </a>
              <a 
                href="/certificaciones"
                className="border border-green-600 text-green-600 px-6 py-3 rounded-full hover:bg-green-50 transition-colors"
                title="Certificaciones de Café Natagá"
              >
                Certificaciones
              </a>
            </div>
          </div>
          <div>
            <img 
              src="/api/placeholder/600/400" 
              alt="Café de Natagá - Coopsantuario" 
              className="rounded-xl shadow-2xl object-cover w-full h-96"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Por qué elegir Café de Natagá
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏔️",
                title: "Altura Premium",
                description: "Cultivado a más de 1,700 metros, garantizando un sabor único y excepcional."
              },
              {
                icon: "🤝",
                title: "Comercio Justo",
                description: "Apoyo directo a familias productoras de Natagá, promoviendo desarrollo sostenible."
              },
              {
                icon: "🏆",
                title: "Calidad Certificada",
                description: "Respaldado por Coopsantuario, líder en café de especialidad de la región."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Contacta con Coopsantuario
            </h2>
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Nombre" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              <input 
                type="email" 
                placeholder="Correo Electrónico" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              <textarea 
                placeholder="Tu mensaje sobre compra de café Natagá" 
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              ></textarea>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Coopsantuario</h4>
            <p className="text-gray-300">
              Café de Natagá: Calidad premium directamente desde los productores locales.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/comprar-cafe-nataga" className="hover:text-green-400">Comprar Café</a></li>
              <li><a href="/sobre-nataga" className="hover:text-green-400">Sobre Natagá</a></li>
              <li><a href="/certificaciones" className="hover:text-green-400">Certificaciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Contacto</h4>
            <p>Natagá, Huila, Colombia</p>
            <p>contacto@coopsantuario.com</p>
            <p>+57 XXX XXX XXXX</p>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-800 pt-4">
          <p className="text-gray-400">
            © 2024 Coopsantuario - Café de Natagá. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}