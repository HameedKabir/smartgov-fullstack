import React, { useEffect, useState } from "react";

import { api } from "../lib/api";
import "../styles/dashboard.css";

export default function Admin() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get("/issues");
        setIssues(Array.isArray(res.data) ? res.data : []);
      } catch {
        setErrorMessage("We could not load admin issue data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const updateStatus = async (id) => {
    try {
      await api.put(`/issues/${id}`, { status: "Resolved" });
      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === id ? { ...issue, status: "Resolved" } : issue,
        ),
      );
    } catch {
      setErrorMessage("Status update failed. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Admin Panel</h2>
      {isLoading && <p>Loading all reported issues...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <div className="grid">
        {issues.map((issue) => (
          <div className="card" key={issue.id}>
            <h3>{issue.title}</h3>
            <p>Status: {issue.status}</p>
            <p>Location: Lat {issue.lat}, Lng {issue.lng}</p>
            <button onClick={() => updateStatus(issue.id)}>Mark Resolved</button>
          </div>
        ))}
      </div>
    </div>
  );
}
