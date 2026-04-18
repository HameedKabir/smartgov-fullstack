import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Smart Governance System</h1>
      <p>
        Report public issues safely and track resolution status in real-time.
      </p>

      <div className="home-buttons">
        <Link to="/register" className="btn">Get Started</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  );
}