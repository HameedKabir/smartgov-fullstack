import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <h2 className="logo">SmartGov</h2>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>

        {role === "user" && (
          <>
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            <NavLink to="/report" onClick={() => setMenuOpen(false)}>Report Issue</NavLink>
          </>
        )}

        {role === "admin" && (
          <>
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>
          </>
        )}

        {role && (
          <span className="logout" onClick={logout}>Logout</span>
        )}
      </div>
    </nav>
  );
}
