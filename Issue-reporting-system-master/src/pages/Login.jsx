import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import "../styles/form.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setModalMessage("Login successful!");
      setModalIsOpen(true);
    } catch {
      setModalMessage("Login failed. Check email/password.");
      setModalIsOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Login"}</button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Notification"
        className="modal"
        overlayClassName="overlay"
      >
        <p>{modalMessage}</p>
        <button
          onClick={() => {
            setModalIsOpen(false);
            if (modalMessage.includes("successful")) {
              navigate(localStorage.getItem("role") === "admin" ? "/admin" : "/dashboard");
            }
          }}
        >
          Close
        </button>
      </Modal>
    </>
  );
}
