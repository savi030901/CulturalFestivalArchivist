import { useEffect, useState } from "react";

const API_BASE = "https://culturalfestivalarchivist.onrender.com";

function Gallery() {
  const defaultFestivals = [
    {
      id: "default-1",
      title: "Rath Yatra",
      category: "Ritual",
      location: "Puri, Odisha",
      image:
        "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "default-2",
      title: "Diwali",
      category: "Lighting",
      location: "Across India",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "default-3",
      title: "Onam Celebration",
      category: "Dance",
      location: "Kerala",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "default-4",
      title: "Pongal",
      category: "Harvest",
      location: "Tamil Nadu",
      image:
        "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "default-5",
      title: "Traditional Dance",
      category: "Dance",
      location: "Festival Ground",
      image:
        "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: "default-6",
      title: "Cultural Celebration",
      category: "Ritual",
      location: "India",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80",
    },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [uploadedFestivals, setUploadedFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load uploads from FastAPI backend
  const loadUploads = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/uploads`);

      if (!response.ok) {
        throw new Error("Could not load uploads");
      }

      const items = await response.json();

      const formattedItems = items.map((item) => ({
        id: item.id,
        title: item.name,
        category: item.category,
        location: item.location,
        image: item.mediaUrl
          ? `${API_BASE}${item.mediaUrl}`
          : "",
        fileType: item.fileType,
        description: item.description,
        fileName: item.fileName,
        uploaded: true,
      }));

      setUploadedFestivals(formattedItems);
    } catch (error) {
      console.error("Gallery loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const deleteFestival = async (festival) => {
    if (!festival.uploaded) {
      alert("Default festival records cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${festival.title}" from the archive?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE}/uploads/${festival.id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Could not delete festival."
        );
      }

      setUploadedFestivals((previous) =>
        previous.filter((item) => item.id !== festival.id)
      );

      alert("Festival media deleted successfully!");
    } catch (error) {
      alert(error.message || "Delete failed. Check the backend server.");
    }
  };
  const allFestivals = [
    ...defaultFestivals,
    ...uploadedFestivals,
  ];

  const categories = [
    "All",
    ...new Set(
      allFestivals
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  const filteredFestivals = allFestivals.filter((festival) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      festival.title?.toLowerCase().includes(searchText) ||
      festival.location?.toLowerCase().includes(searchText) ||
      festival.description?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      festival.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <div>
          <p className="gallery-tag">
            CULTURAL HERITAGE ARCHIVE
          </p>

          <h1>🖼️ Festival Gallery</h1>

          <p>
            Explore cultural festivals, rituals and
            celebrations across India.
          </p>
        </div>

        <button
          type="button"
          onClick={() => (window.location.href = "/")}
        >
          ← Home
        </button>
      </header>

      <div className="gallery-toolbar">
        <input
          type="text"
          placeholder="Search festivals or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All"
                ? "All Categories"
                : item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={loadUploads}
        >
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <p className="gallery-count">
          Loading saved festival media...
        </p>
      )}

      {!loading && (
        <p className="gallery-count">
          Showing {filteredFestivals.length} festival records
        </p>
      )}

      <div className="gallery-grid">
        {filteredFestivals.map((festival) => (
          <article
            className="gallery-card"
            key={festival.id}
          >
            {festival.fileType?.startsWith("video/") ? (
              <video
                className="uploaded-video"
                src={festival.image}
                controls
              />
            ) : (
              <img
                src={festival.image}
                alt={festival.title}
              />
            )}

            <div className="gallery-card-content">
              <h3>{festival.title}</h3>

              <p>📍 {festival.location}</p>

              <span>{festival.category}</span>

              {festival.uploaded && (
                <small
                  style={{
                    display: "block",
                    marginTop: "8px",
                    fontWeight: "600",
                  }}
                >
                  📤 Uploaded Media
                </small>
              )}

              {festival.description && (
                <p>{festival.description}</p>
              )}

              {festival.fileName && (
                <small>{festival.fileName}</small>
              )}
              
{festival.uploaded && (
  <button
    type="button"
    onClick={() => deleteFestival(festival)}
    style={{
      marginTop: "12px",
      padding: "9px 14px",
      background: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "7px",
      cursor: "pointer",
    }}
  >
    🗑️ Delete Media
  </button>
)}
            </div>
          </article>
        ))}
      </div>

      {!loading && filteredFestivals.length === 0 && (
        <p className="gallery-empty">
          No matching festivals found. Try another search.
        </p>
      )}
    </main>
  );
}

export default Gallery;