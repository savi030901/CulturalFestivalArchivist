import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [uploadedMemories, setUploadedMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultMemories = [
    {
      id: "default-1",
      title: "Temple Festival",
      category: "Ritual",
      location: "Temple",
      icon: "🛕",
    },
    {
      id: "default-2",
      title: "Festival Procession",
      category: "Procession",
      location: "Village Street",
      icon: "🥁",
    },
    {
      id: "default-3",
      title: "Traditional Dance",
      category: "Performance",
      location: "Festival Ground",
      icon: "💃",
    },
    {
      id: "default-4",
      title: "Festival Decorations",
      category: "Decoration",
      location: "Temple",
      icon: "🪔",
    },
    {
      id: "default-5",
      title: "Cultural Performance",
      category: "Cultural Event",
      location: "Stage",
      icon: "🎭",
    },
    {
      id: "default-6",
      title: "Community Celebration",
      category: "Celebration",
      location: "Festival Ground",
      icon: "🎉",
    },
  ];

  // Load uploaded memories from FastAPI
  const loadUploads = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/uploads`);

      if (!response.ok) {
        throw new Error("Could not load uploaded memories");
      }

      const items = await response.json();

      const formattedItems = items.map((item) => ({
        id: item.id,
        title: item.name,
        category: item.category,
        location: item.location,
        description: item.description,
        fileName: item.fileName,
        icon: item.fileType?.startsWith("video/")
          ? "🎥"
          : "📷",
        uploaded: true,
      }));

      setUploadedMemories(formattedItems);
    } catch (error) {
      console.error("Search loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const handleSearch = () => {
    const searchText = query.toLowerCase().trim();

    if (!searchText) {
      setResults([]);
      return;
    }

    const allMemories = [
      ...defaultMemories,
      ...uploadedMemories,
    ];

    const filtered = allMemories.filter((memory) => {
      const searchableText = `
        ${memory.title || ""}
        ${memory.category || ""}
        ${memory.location || ""}
        ${memory.description || ""}
        ${memory.fileName || ""}
      `.toLowerCase();

      return searchableText.includes(searchText);
    });

    setResults(filtered);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "50px 8%",
        background: "#f6f7fb",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>🔍 Smart Search</h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "10px",
          }}
        >
          Search cultural festival memories using keywords.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Try: procession, temple, dance, diwali..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            style={{
              width: "400px",
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: "14px 25px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#4b5563",
          }}
        >
          Found {results.length} matching festival memories
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "25px",
          marginTop: "50px",
        }}
      >
        {results.map((memory) => (
          <div
            key={memory.id}
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "55px" }}>
              {memory.icon}
            </div>

            <h3>{memory.title}</h3>

            <p
              style={{
                color: "#4f46e5",
                marginTop: "10px",
              }}
            >
              {memory.category}
            </p>

            <p style={{ color: "#6b7280" }}>
              📍 {memory.location}
            </p>

            {memory.description && (
              <p style={{ color: "#6b7280" }}>
                {memory.description}
              </p>
            )}

            {memory.uploaded && (
              <small
                style={{
                  display: "block",
                  marginTop: "10px",
                  fontWeight: "600",
                }}
              >
                📤 Uploaded Media
              </small>
            )}
          </div>
        ))}
      </div>

      {query && results.length === 0 && !loading && (
        <p
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#6b7280",
          }}
        >
          No matching festival memories found.
        </p>
      )}
    </div>
  );
}

export default Search;