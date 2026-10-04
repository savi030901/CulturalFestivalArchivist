
import React, { useEffect, useState } from "react";

const API_BASE = "https://cultural-festival-backend-bf80.onrender.com";


function AdminDashboard() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFestivals = async () => {
    try {
      const response = await fetch(`${API_BASE}/uploads`);

      if (!response.ok) {
        throw new Error("Could not load festival records.");
      }

      const data = await response.json();
      setFestivals(data);
      setError("");
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Backend connect aagala. FastAPI server-a check pannu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFestivals();
  }, []);

  const totalMedia = festivals.length;

  const totalFestivals = new Set(
    festivals
      .map((item) => item.name?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const totalLocations = new Set(
    festivals
      .map((item) => item.location?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const totalCategories = new Set(
    festivals
      .map((item) => item.category?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const goTo = (path) => {
    window.location.href = path;
  };

  const cardStyle = {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    border: "1px solid #e4eaf3",
    boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#e8eef9",
    color: "#1e3a8a",
    fontWeight: "600",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          padding: "20px 35px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          🏛️ Cultural Festival Digital Archivist
        </h2>

        <button
          onClick={() => goTo("/")}
          style={buttonStyle}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: "35px" }}>
        <h1>Welcome, Admin 👋</h1>
        <p>Manage and monitor the cultural festival archive.</p>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div style={cardStyle}>
            <h3>🎉 Total Festivals</h3>
            <p style={{ fontSize: "30px", fontWeight: "bold" }}>
              {loading ? "..." : totalFestivals}
            </p>
            <small>Unique uploaded festival names</small>
          </div>

          <div style={cardStyle}>
            <h3>📸 Media Files</h3>
            <p style={{ fontSize: "30px", fontWeight: "bold" }}>
              {loading ? "..." : totalMedia}
            </p>
            <small>Saved upload records</small>
          </div>

          <div style={cardStyle}>
            <h3>📍 Locations</h3>
            <p style={{ fontSize: "30px", fontWeight: "bold" }}>
              {loading ? "..." : totalLocations}
            </p>
            <small>Unique uploaded locations</small>
          </div>

          <div style={cardStyle}>
            <h3>🗂️ Categories</h3>
            <p style={{ fontSize: "30px", fontWeight: "bold" }}>
              {loading ? "..." : totalCategories}
            </p>
            <small>Unique uploaded categories</small>
          </div>
        </div>

        {/* Admin Actions */}
        <h2 style={{ marginTop: "40px" }}>Admin Actions</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Festival Dataset */}
          <div style={cardStyle}>
            <h3>📁 Festival Dataset</h3>
            <p>View uploaded festival records and details.</p>

            <button
              onClick={() => goTo("/festival-dataset")}
              style={buttonStyle}
            >
              View Festival Records →
            </button>
          </div>

          {/* Manage Media */}
          <div style={cardStyle}>
            <h3>📸 Manage Media</h3>
            <p>View uploaded festival photos and videos.</p>

            <button
              onClick={() => goTo("/gallery")}
              style={buttonStyle}
            >
              Manage Media →
            </button>
          </div>

          {/* ML Analytics */}
          <div style={cardStyle}>
            <h3>🤖 ML Analytics</h3>
            <p>View machine learning results and model metrics.</p>

            <button
  onClick={() =>
    window.open("https://culturalfestivalarchivist-r9cpvrzqgijdnropuhr4m6.streamlit.app", "_blank")
  }
  style={buttonStyle}
>
  Open ML Dashboard →
</button>
          {/* Refresh */}
          <div style={cardStyle}>
            <h3>🔄 Refresh Statistics</h3>
            <p>Reload the latest saved media records and counts.</p>

            <button
              onClick={loadFestivals}
              style={buttonStyle}
            >
              Refresh Counts
            </button>
          </div>
        </div>

        {/* Recent Uploads */}
        <h2 style={{ marginTop: "40px" }}>Recent Festival Uploads</h2>

        {loading && <p>Loading records...</p>}

        {!loading && !error && festivals.length === 0 && (
          <p>No uploaded festival records yet.</p>
        )}

        {!loading && !error && festivals.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#e8eef9" }}>
                  <th style={{ padding: "12px" }}>Festival</th>
                  <th style={{ padding: "12px" }}>Location</th>
                  <th style={{ padding: "12px" }}>Category</th>
                  <th style={{ padding: "12px" }}>File</th>
                </tr>
              </thead>

              <tbody>
                {[...festivals].reverse().slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                      {item.name}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                      {item.location}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                      {item.category}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                      {item.fileName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => goTo("/festival-dataset")}
              style={buttonStyle}
            >
              View All Records →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;