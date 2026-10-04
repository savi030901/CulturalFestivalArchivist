import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [role, setRole] = useState("user");
  const handleLogin = (e) => {
  e.preventDefault();

  if (email && password) {
    if (role === "admin") {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/user-dashboard";
    }
  } else {
    alert("Please enter email and password.");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f6f7fb",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "40px",
          background: "white",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>🔐 Sign In</h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Access the Cultural Festival Archivist
        </p>

        <form onSubmit={handleLogin}>
            <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  }}
>
  <button
    type="button"
    onClick={() => setRole("user")}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #4f46e5",
      background: role === "user" ? "#4f46e5" : "white",
      color: role === "user" ? "white" : "#4f46e5",
      cursor: "pointer",
    }}
  >
    👤 User
  </button>

  <button
    type="button"
    onClick={() => setRole("admin")}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #4f46e5",
      background: role === "admin" ? "#4f46e5" : "white",
      color: role === "admin" ? "white" : "#4f46e5",
      cursor: "pointer",
    }}
  >
    🛡️ Admin
  </button>
</div>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "25px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;