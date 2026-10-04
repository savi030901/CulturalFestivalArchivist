import "./App.css";
import Upload from "./upload";
import Gallery from "./Gallery";
import Search from "./Search";
import Login from "./Login";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import Dashboard from "./Dashboard";
import FestivalDataset from "./FestivalDataset";
function App() {
  if (window.location.pathname === "/upload") {
    return <Upload />;
  }
if (window.location.pathname === "/gallery") {
  return <Gallery />;
}
if (window.location.pathname === "/search") {
  return <Search />;
}
if (window.location.pathname === "/login") {
  return <Login />;
}
if (window.location.pathname === "/user-dashboard") {
  return <UserDashboard />;
}
if (window.location.pathname === "/admin-dashboard") {
  return <AdminDashboard />;
}

if (window.location.pathname === "/festival-dataset") {
  return <FestivalDataset />;
}
if (window.location.pathname === "/dashboard") {
  return <Dashboard />;
}
  return (
    <div className="app">
      <nav className="navbar">
        <h2>🏛️ Cultural Festival Archivist</h2>

        
<div className="nav-links">
<a className="active" href="/">🏠 Home</a>
  <a href="/gallery">▦ Gallery</a>
  <a href="/upload">⬆ Upload</a>
  <a href="/search">⌕ Search</a>
  <a href="/dashboard">📊 Dashboard</a>
  <a href="/user-dashboard">▣ My Archive</a>
  <a href="/admin-dashboard">♟ Admin</a>

  <button onClick={() => (window.location.href = "/login")}>
    Sign In
  </button>
</div>
      </nav>
<section className="stats">
  <div className="stat-card">
    <span>🖼️</span>
    <div>
      <p>Total Festivals</p>
      <h2>1010</h2>
    </div>
  </div>

  <div className="stat-card">
    <span>🎥</span>
    <div>
      <p>Total Media Files</p>
      <h2>2450</h2>
    </div>
  </div>

  <div className="stat-card">
    <span>📍</span>
    <div>
      <p>Total Locations</p>
      <h2>4</h2>
    </div>
  </div>

  <div className="stat-card">
    <span>👥</span>
    <div>
      <p>Total Categories</p>
      <h2>6</h2>
    </div>
  </div>
</section>
      <section className="hero">
        <div className="hero-content">
          <p className="tag">AI-POWERED DIGITAL ARCHIVE</p>

          <h1>
            Preserve Our
            <br />
            <span>Cultural Heritage</span>
          </h1>

          <p>
            Discover, organize and explore cultural festival
            photos, videos and memories in one digital archive.
          </p>

          <div className="buttons">
          
<button
  className="primary"
  onClick={() => (window.location.href = "/gallery")}
>
  Explore Archive →
</button>


            
<button
  className="secondary"
  onClick={() => window.location.href = "/upload"}
>
  Upload Media
</button>          </div>
        </div>

        <div className="hero-card">
          <div className="festival-icon">🎭</div>
          <h3>Festival Memories</h3>
          <p>Explore cultural events, rituals and celebrations.</p>
        </div>
      </section>

<section className="featured-festivals">
  <div className="section-heading">
    <div>
      <h2>🏛️ Featured Festivals</h2>
      <p>Discover celebrations from across India</p>
    </div>

    <button onClick={() => (window.location.href = "/gallery")}>
      View All →
    </button>
  </div>

  <div className="festival-grid">
    <article className="festival-card">
      <img
        src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80"
        alt="Indian cultural celebration"
      />
      <div className="festival-info">
        <h3>Rath Yatra</h3>
        <p>📍 Puri, Odisha</p>
        <span>Ritual</span>
        <span>Procession</span>
      </div>
    </article>

    <article className="festival-card">
      <img
        src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=600&q=80"
        alt="Festival lights"
      />
      <div className="festival-info">
        <h3>Diwali</h3>
        <p>📍 Across India</p>
        <span>Festival</span>
        <span>Lighting</span>
      </div>
    </article>

    <article className="festival-card">
      <img
        src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80"
        alt="Traditional festival celebration"
      />
      <div className="festival-info">
        <h3>Onam</h3>
        <p>📍 Kerala</p>
        <span>Culture</span>
        <span>Dance</span>
      </div>
    </article>

    <article className="festival-card">
      <img
        src="https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80"
        alt="Indian traditional celebration"
      />
      <div className="festival-info">
        <h3>Pongal</h3>
        <p>📍 Tamil Nadu</p>
        <span>Harvest</span>
        <span>Tradition</span>
      </div>
    </article>
  </div>
</section>
      <section className="features">
        <div className="feature-card">
          <div>📸</div>
          <h3>Photos</h3>
          <p>Organize festival photographs.</p>
        </div>

        <div className="feature-card">
          <div>🎥</div>
          <h3>Videos</h3>
          <p>Store and explore festival videos.</p>
        </div>

        <div className="feature-card">
          <div>🔍</div>
          <h3>Smart Search</h3>
          <p>Find cultural memories easily.</p>
        </div>

        <div className="feature-card">
          <div>🤖</div>
          <h3>AI Classification</h3>
          <p>Automatically organize festival content.</p>
        </div>
      </section>

      <section className="about">
        <h2>Explore Cultural Heritage</h2>
        <p>
          A digital space to preserve and discover festival memories,
          events, rituals and cultural moments.
        </p>
      </section>

      <footer>
        <p>© 2026 Cultural Festival Archivist</p>
      </footer>
    </div>
  );
}

export default App;