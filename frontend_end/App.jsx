import "./App.css";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>🏛️ Cultural Festival Archivist</h2>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Gallery</a>
          <a href="#">Search</a>
          <a href="#">About</a>
          <button>Sign In</button>
        </div>
      </nav>

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
            <button className="primary">Explore Archive</button>
            <button className="secondary">Upload Media</button>
          </div>
        </div>

        <div className="hero-card">
          <div className="festival-icon">🎭</div>
          <h3>Festival Memories</h3>
          <p>Explore cultural events, rituals and celebrations.</p>
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