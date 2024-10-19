import React, { useEffect, useState } from "react";
import useAspirantesStore from "./useAspirantesStore";

const aspirantesSolisitud
 = () => {
  const { aspirantes, fetchAspirantes, createAspirante, loading, error } = useAspirantesStore();
  const [form, setForm] = useState({
    nombre: "",
    identificacion: "",
    edad: "",
    sexo: "",
    rol: "",
    file: "",
    email: "",
    telefono: "",
    estado: ""
  });

  useEffect(() => {
    fetchAspirantes();
  }, [fetchAspirantes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {





    e.preventDefault();
    await createAspirante(form);
  };

  return (
    <div>
      <h1>Aspiranotes</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" value={form.nombre} onChange={handleInputChange} placeholder="Nombre" />
        <input type="text" name="identificacion" value={form.identificacion} onChange={handleInputChange} placeholder="Identificación" />
        <input type="text" name="edad" value={form.edad} onChange={handleInputChange} placeholder="Edad" />
        <input type="text" name="sexo" value={form.sexo} onChange={handleInputChange} placeholder="Sexo" />
        <input type="text" name="rol" value={form.rol} onChange={handleInputChange} placeholder="Rol" />
        <input type="file" name="file" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
        <input type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" />
        <input type="text" name="telefono" value={form.telefono} onChange={handleInputChange} placeholder="Teléfono" />
        <input type="text" name="estado" value={form.estado} onChange={handleInputChange} placeholder="Estado" />
        <button type="submit" disabled={loading}>Aspirar</button>
      </form>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {aspirantes.map((aspirante) => (
          <li key={aspirante._id}>{aspirante.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default aspirantesSolisitud
;
