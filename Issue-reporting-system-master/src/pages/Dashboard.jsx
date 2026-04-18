import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../lib/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get("/issues");
        setIssues(Array.isArray(res.data) ? res.data : []);
      } catch {
        setErrorMessage("We could not load issues right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const filteredIssues = filter === "All" ? issues : issues.filter((issue) => issue.status === filter);

  return (
    <div className="dashboard">
      <h2>All Reported Issues</h2>
      <select onChange={(e) => setFilter(e.target.value)} defaultValue="All">
        <option>All</option>
        <option>Pending</option>
        <option>In Review</option>
        <option>Resolved</option>
        <option>Rejected</option>
      </select>

      {isLoading && <p>Loading your reported issues...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      {!isLoading && !errorMessage && filteredIssues.length === 0 && (
        <p>No issues match this filter yet.</p>
      )}

      <div className="grid">
        {filteredIssues.map((issue) => (
          <div className="card" key={issue.id}>
            {issue.image && <img src={issue.image} alt="issue" />}
            <h3>{issue.title}</h3>
            <p>Status: {issue.status}</p>
            <p>Location: Lat {issue.lat}, Lng {issue.lng}</p>
            <Link to={`/issue/${issue.id}`} className="details-link">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
