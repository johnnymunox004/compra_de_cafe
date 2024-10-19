import { create } from 'zustand';
import axios from 'axios';

const useEmpleadoStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),
  empleadoList: [],
  message: "",
  loading: false,
  error: "",

  fetchEmpleadoList: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ message: "Token no disponible. Por favor, inicia sesión." });
      return;
    }

    try {
      set({ loading: true });
      const response = await axios.get('https://back-gestor-empleados.onrender.com/api/empleados', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      set({ empleadoList: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching EmpleadoList:', error);
      set({ error: "Error al obtener la lista de empleados. Por favor, intenta de nuevo.", loading: false });
    }
  },

  createEmpleado: async (newEmpleado) => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ message: "Token no disponible. Por favor, inicia sesión." });
      return;
    }

    try {
      const response = await axios.post('https://back-gestor-empleados.onrender.com/api/empleados', newEmpleado, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      set((state) => ({
        empleadoList: [...state.empleadoList, response.data],
        message: "Empleado creado con éxito"
      }));
    } catch (error) {
      console.error('Error creating empleado:', error);
      set({ error: "Error al crear empleado. Por favor, intenta de nuevo." });
    }
  },

  updateEmpleado: async (id, updatedEmpleado) => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ message: "Token no disponible. Por favor, inicia sesión." });
      return;
    }

    try {
      const response = await axios.put(`https://back-gestor-empleados.onrender.com/api/empleados/${id}`, updatedEmpleado, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      set((state) => ({
        empleadoList: state.empleadoList.map(empleado => empleado._id === id ? response.data : empleado),
        message: "Empleado actualizado con éxito"
      }));
    } catch (error) {
      console.error('Error updating empleado:', error);
      set({ error: "Error al actualizar empleado. Por favor, intenta de nuevo." });
    }
  },

  deleteEmpleado: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ message: "Token no disponible. Por favor, inicia sesión." });
      return;
    }

    try {
      await axios.delete(`https://back-gestor-empleados.onrender.com/api/empleados/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      set((state) => ({
        empleadoList: state.empleadoList.filter(empleado => empleado._id !== id),
        message: "Empleado eliminado con éxito"
      }));
    } catch (error) {
      console.error('Error deleting empleado:', error);
      set({ error: "Error al eliminar empleado. Por favor, intenta de nuevo." });
    }
  },

  loginUser: async (user, password) => {
    try {
      const response = await axios.post('https://back-gestor-empleados.onrender.com/api/login', { user, password });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      set({ token: newToken, isLoggedIn: true });
      await useEmpleadoStore.getState().fetchEmpleadoList(); // Llama fetchEmpleadoList después de iniciar sesión
      set({ message: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error('Error logging in:', error);
      set({ error: "Error al iniciar sesión. Por favor, verifica tus credenciales." });
    }
  },

  logoutUser: () => {
    localStorage.removeItem('token');
    set({ token: null, isLoggedIn: false, empleadoList: [], message: "Sesión cerrada" });
  },
}));

export default useEmpleadoStore;
