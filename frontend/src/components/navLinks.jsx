import React, { useEffect, useState } from 'react';
import { FaHome } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaUserAstronaut, FaRegBell } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { hasNoToken } from "../utils/getUserById";
import { CgProfile } from "react-icons/cg";

const NavLinks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (hasNoToken()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };



  return (

<div className="navbar">
  <div className="navbar-container">
    <Link to="/dashboard" className="nav-link">
      <FaHome className="icon" />
      <span>Home</span>
    </Link>
    <Link to="/dashboard/list-aspirant" className="nav-link">
      <BsFillPersonLinesFill className="icon" />
      <span>compra</span>
    </Link>
    {/* <Link to="/dashboard/usuarios" className="nav-link">
      <FaUserAstronaut className="icon" />
      <span>Usuarios</span>
    </Link> */}

    <Link to="/profile" className="nav-link">
      <CgProfile className="icon" />
      <span>Perfil Del Usuario</span>
    </Link>
    <Link to="/" onClick={handleLogout} className="nav-link logout">
      <IoLogIn className="icon" />
      <span>Salir</span>
    </Link>
  </div>
</div>

  
    
  );
};

export default NavLinks;
