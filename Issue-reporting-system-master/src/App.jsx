import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import IssueDetails from "./pages/IssueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import "./styles/global.css";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ role, children }) => {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  return localStorage.getItem("role") === role ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/report" element={<RoleRoute role="user"><ReportIssue /></RoleRoute>} />
        <Route path="/issue/:id" element={<PrivateRoute><IssueDetails /></PrivateRoute>} />
        <Route path="/admin" element={<RoleRoute role="admin"><Admin /></RoleRoute>} />
      </Routes>
    </Router>
  );
}
