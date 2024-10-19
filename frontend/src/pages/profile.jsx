import React, { useEffect, useState } from "react";
import { getUserDataFromToken } from "../utils/getUserById";
import NavLinks from "../components/navLinks";
const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Suponiendo que has almacenado el token JWT en el localStorage
        const userData = await getUserDataFromToken(token);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-dashboard">
    
    <div className="aside-dashboard">
      <NavLinks/>
    </div>
    <div className="main-dashboard">
    <div className="container mx-auto">
      <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="w-full p-4 px-5 py-5">
            <div className="md:mt-0 md:col-span-2">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-lg font-bold leading-6 text-gray-900">
                  Perfil de Usuario
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Información del usuario
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Nombre :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {userData ? userData.user : "Cargando..."}
                    </dd>
                    <img
                      src={`https://unavatar.io/github/${userData ? userData.user : "Cargando..."}`}
                      className="mb-3 h-24 w-24 rounded-full shadow-lg"
                    />
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Nombre
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {userData ? userData.name : "Cargando..."}
                    </dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {userData ? userData.email : "Cargando..."}
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Rol</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {userData ? userData.rol : "Cargando..."}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
    </div>

      </div>
    </div>
  </div>
  );
};

export default Profile;
