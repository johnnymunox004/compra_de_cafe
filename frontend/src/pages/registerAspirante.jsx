import React, { useEffect, useState } from "react";
import useAspirantesStore from "../store/useAspirantesStore";
import { Modal, Button, Card, TextInput, Label } from "flowbite-react";
import { Link } from "react-router-dom";

function DashboardListAspirantRegister() {
  const {
    aspirantes,
    fetchAspirantes,
    loading,
    error,
    createAspirante,
    updateAspirante,
    deleteAspirante,
  } = useAspirantesStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    identificacion: "",
    edad: "",
    sexo: "",
    rol: "",
    file: "",
    email: "",
    telefono: "",
    estado: "",
    date_create: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchAspirantes();
  }, [fetchAspirantes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updateAspirante(currentId, formData);
    } else {
      createAspirante(formData);
    }
    setShowModal(false);
    setFormData({
      nombre: "",
      identificacion: "",
      edad: "",
      sexo: "",
      rol: "",
      file: "",
      email: "",
      telefono: "",
      estado: "",
      date_create: "",
    });
    setEditMode(false);
  };

  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">
      <div className="header-dashboard  w-full bg-blue-600  py-4 px-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">
          Formulario Aspirantes
        </h1>
      </div>
      <div className="main-dashboard col-span-3 md:col-span-2 p-6 rounded-lg shadow-lg bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="nombre" className="mb-2 font-semibold text-gray-700">
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="identificacion" className="mb-2 font-semibold text-gray-700">
              Identificación:
            </label>
            <input
              type="text"
              id="identificacion"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleInputChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="edad" className="mb-2 font-semibold text-gray-700">
              Edad:
            </label>
            <input
              type="text"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="sexo" className="mb-2 font-semibold text-gray-700">
              Sexo:
            </label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="hidden"></option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="file" className="mb-2 font-semibold text-gray-700">
              File:
            </label>
            <input
              type="text"
              id="file"
              name="file"
              value={formData.file}
              onChange={handleInputChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-2 font-semibold text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="telefono" className="mb-2 font-semibold text-gray-700">
              Teléfono:
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editMode ? "Actualizar" : "Crear"}
          </button>
        </form>
      </div>
      <div className="footer-dashboard col-span-3 md:col-span-1 bg-blue-600 py-4 px-6 rounded-lg shadow-lg">
        <Link to="/" className="flex justify-center text-3xl font-bold text-center text-white">
          Inicio
        </Link>
      </div>
    </div>
  );
  
}

export default DashboardListAspirantRegister;
