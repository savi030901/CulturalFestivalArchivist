
import React, { useEffect, useState } from "react";

const API_BASE = "https://cultural-festival-backend-bf80.onrender.com";
function FestivalDataset() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/uploads`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load festival records.");
        }
        return response.json();
      })
      .then((data) => {
        setFestivals(data);
        setError("");
      })
      .catch(() => {
        setError("Backend connect aagala. FastAPI server running-aa check pannu.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", padding: "30px" }}>
      <button
        onClick={() => (window.location.href = "/admin-dashboard")}
        style={{ padding: "10px 16px", cursor: "pointer" }}
      >
        ← Back to Admin Dashboard
      </button>

      <h1>Festival Dataset</h1>
      <p>View festival records saved in your archive.</p>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h3>Total Uploaded Records: {festivals.length}</h3>
      </div>

      {loading && <p>Loading festival records...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && festivals.length === 0 && (
        <p>No festival records found. Upload festival media first.</p>
      )}

      {!loading && !error && festivals.length > 0 && (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "12px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e8eef9", textAlign: "left" }}>
                {["Festival Name", "Location", "Category", "Description", "File Name"].map(
                  (heading) => (
                    <th key={heading} style={{ padding: "14px", borderBottom: "1px solid #ddd" }}>
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {festivals.map((festival) => (
                <tr key={festival.id}>
                  <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                    {festival.name}
                  </td>
                  <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                    {festival.location}
                  </td>
                  <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                    {festival.category}
                  </td>
                  <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                    {festival.description || "—"}
                  </td>
                  <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                    {festival.fileName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FestivalDataset;