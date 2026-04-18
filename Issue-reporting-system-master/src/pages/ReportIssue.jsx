import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import "../styles/form.css";

export default function ReportIssue() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Road");
  const [priority, setPriority] = useState("Medium");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [image, setImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("priority", priority);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("lat", lat);
    formData.append("lng", lng);

    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/issues", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalMessage("Issue submitted successfully.");
      setModalIsOpen(true);
    } catch {
      setModalMessage("Issue submission failed. Please check the form fields and try again.");
      setModalIsOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Report an Issue</h2>
        <input placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="Describe the issue clearly"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Road</option>
          <option>Sanitation</option>
          <option>Electricity</option>
          <option>Water</option>
          <option>Security</option>
          <option>Health</option>
          <option>General</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <input placeholder="City or region" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Address or landmark" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
        <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Issue"}</button>
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
            if (modalMessage.includes("successfully")) {
              navigate("/dashboard");
            }
          }}
        >
          Close
        </button>
      </Modal>
    </>
  );
}
