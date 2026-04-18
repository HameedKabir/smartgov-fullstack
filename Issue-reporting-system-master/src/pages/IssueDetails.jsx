import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../lib/api";
import "../styles/details.css";

export default function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setIssue(res.data);
      } catch {
        setErrorMessage("We could not load this issue right now.");
      }
    };

    fetchIssue();
  }, [id]);

  if (errorMessage) {
    return <p className="details">{errorMessage}</p>;
  }

  if (!issue) {
    return <p className="details">Loading issue details...</p>;
  }

  return (
    <div className="details">
      <h2>{issue.title}</h2>
      {issue.image && <img src={issue.image} alt={issue.title} className="issue-img" />}
      <p>{issue.description}</p>
      <p>Status: {issue.status}</p>
      <p>Category: {issue.category}</p>
      <p>Priority: {issue.priority}</p>
      <p>City: {issue.city || "Not specified"}</p>
      <p>Address: {issue.address || "Not specified"}</p>
      <p>Coordinates: {issue.lat}, {issue.lng}</p>

      {Array.isArray(issue.updates) && issue.updates.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Progress Updates</h3>
          {issue.updates.map((update) => (
            <div key={update._id || `${update.message}-${update.createdAt}`}>
              <p><strong>{update.status}</strong>: {update.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
