function UserDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "50px 8%",
        background: "#f6f7fb",
      }}
    >
      <h1>👤 User Dashboard</h1>

      <p style={{ color: "#6b7280", marginTop: "10px" }}>
        Welcome to the Cultural Festival Digital Archivist
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "25px",
          marginTop: "40px",
        }}
      >

        {/* Upload */}
        <div
          onClick={() => (window.location.href = "/upload")}
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "45px" }}>📤</div>
          <h3>Upload Media</h3>
          <p>Upload festival photos and videos.</p>
        </div>

        {/* Gallery */}
        <div
          onClick={() => (window.location.href = "/gallery")}
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "45px" }}>🖼️</div>
          <h3>Gallery</h3>
          <p>Explore festival memories.</p>
        </div>

        {/* Search */}
        <div
          onClick={() => (window.location.href = "/search")}
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "45px" }}>🔍</div>
          <h3>Smart Search</h3>
          <p>Search cultural memories.</p>
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;