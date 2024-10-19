import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Pagination } from "flowbite-react";
import NavLinks from "../components/navLinks";
import LoadingSpinner from "../components/loadingSpinner";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(3);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "https://back-gestor-empleados.onrender.com/api/notifi"
        );
        setNotifications(response.data);
      } catch (error) {
        setError("Se produjo un error al obtener notificaciones.");
      }
    };

    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `https://back-gestor-empleados.onrender.com/api/notifi/${id}`
      );
      setNotifications(
        notifications.filter((notification) => notification._id !== id)
      );
    } catch (error) {
      setError("Se produjo un error al eliminar la notificación.");
    }
  };

  // Get current notifications
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-dashboard">
      <div className="aside-dashboard">
        <NavLinks />
      </div>
      <div className="main-dashboard p-6">
        <div className="notifications-page bg-white rounded-lg p-6 mt-10 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-4">
            {currentNotifications.length > 0 ? (
              currentNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="notification-item p-4 border border-gray-300 rounded-md shadow-sm"
                >
                  <h3 className="text-lg font-bold">{notification.action}</h3>
                  <p>{notification.solicitud}</p>
                  <p className="text-gray-500">
                    Enviado por: {notification.quien}
                  </p>
                  <Button
                    onClick={() => deleteNotification(notification._id)}
                    color="failure"
                    className="mt-2"
                  >
                    Eliminar
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-16">
                <LoadingSpinner></LoadingSpinner>
              </p>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(notifications.length / notificationsPerPage)}
              onPageChange={paginate}
            />
          </div>
          <div className="footer-dashboard bg-gray-200 p-4 rounded-lg mt-4">

          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
