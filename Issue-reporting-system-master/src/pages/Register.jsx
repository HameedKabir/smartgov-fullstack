import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import "../styles/form.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/auth/register", { name, email, password, phone, city });
      setModalMessage("Registration successful!");
      setModalIsOpen(true);
    } catch {
      setModalMessage("Registration failed. Email may already exist.");
      setModalIsOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input placeholder="Name or Alias" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Phone Number (Optional)" onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="City/Region" onChange={(e) => setCity(e.target.value)} />
        <button disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Register"}</button>
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
              navigate("/login");
            }
          }}
        >
          Close
        </button>
      </Modal>
    </>
  );
}
