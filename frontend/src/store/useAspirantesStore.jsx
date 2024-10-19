import { create } from 'zustand';
import axios from 'axios';

const useAspirantesStore = create((set) => ({
  aspirantes: [],
  loading: false,
  error: null,

  fetchAspirantes: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get("http://localhost:1500/api/aspirantes", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      set({ aspirantes: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createAspirante: async (newAspirante) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      await axios.post("http://localhost:1500/api/aspirantes", newAspirante, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      set((state) => ({ aspirantes: [...state.aspirantes, newAspirante], loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createEmpleados: async (newAspirante) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      await axios.post("http://localhost:1500/api/empleados", newAspirante, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      set((state) => ({ aspirantes: [...state.aspirantes, newAspirante], loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateAspirante: async (id, updatedAspirante) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:1500/api/aspirantes/${id}`, updatedAspirante, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      set((state) => ({
        aspirantes: state.aspirantes.map((aspirante) =>
          aspirante._id === id ? updatedAspirante : aspirante
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteAspirante: async (id) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:1500/api/aspirantes/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      set((state) => ({
        aspirantes: state.aspirantes.filter((aspirante) => aspirante._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useAspirantesStore;
