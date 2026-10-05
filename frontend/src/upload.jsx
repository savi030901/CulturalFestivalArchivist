
import { useEffect, useState } from "react";

const API_BASE = "https://cultural-festival-backend-bf80.onrender.com";

function Upload() {
  const [file, setFile] = useState(null);
  const [festivalName, setFestivalName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Ritual");
  const [description, setDescription] = useState("");
  const [uploaded, setUploaded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUploads, setLoadingUploads] = useState(true);

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const response = await fetch(`${API_BASE}/uploads`);

        if (!response.ok) {
          throw new Error("Could not load saved uploads");
        }

        const items = await response.json();

        setUploaded(
          items.map((item) => ({
            ...item,
            previewUrl: item.mediaUrl
              ? `${API_BASE}${item.mediaUrl}`
              : item.previewUrl,
          }))
        );
      } catch (error) {
        console.error("Load uploads error:", error);
      } finally {
        setLoadingUploads(false);
      }
    };

    loadUploads();
  }, []);

  const handleUpload = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      if (
        !selectedFile.type.startsWith("image/") &&
        !selectedFile.type.startsWith("video/")
      ) {
        alert("Please select an image or video.");
        event.target.value = "";
        setFile(null);
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("Please choose a file smaller than 50 MB.");
        event.target.value = "";
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const submitUpload = async (event) => {
    event.preventDefault();

    if (!file || !festivalName.trim() || !location.trim()) {
      alert("Please select a file, festival name and location.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("festivalName", festivalName.trim());
      formData.append("location", location.trim());
      formData.append("category", category);
      formData.append("description", description.trim());
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/uploads`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Upload failed. Please try again."
        );
      }

      const savedItem = {
        ...result.item,
        previewUrl: `${API_BASE}${result.item.mediaUrl}`,
      };

      setUploaded((previous) => [savedItem, ...previous]);

      setFile(null);
      setFestivalName("");
      setLocation("");
      setCategory("Ritual");
      setDescription("");

      const input = document.getElementById("festival-file");

      if (input) {
        input.value = "";
      }

      alert("Festival media saved successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Could not upload the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-page">
      <header className="upload-header">
        <div>
          <p className="upload-tag">
            CULTURAL HERITAGE ARCHIVE
          </p>

          <h1>📤 Upload Festival Media</h1>

          <p>
            Preserve festival photos and videos in your digital archive.
          </p>
        </div>

        <button
          type="button"
          onClick={() => (window.location.href = "/")}
        >
          ← Home
        </button>
      </header>

      <form className="upload-form" onSubmit={submitUpload}>
        <h2>Festival Information</h2>

        <p className="upload-help">
          Select a media file and enter its festival details.
        </p>

        <label
          htmlFor="festival-file"
          className="upload-dropzone"
        >
          <span className="upload-cloud">☁️</span>
          <strong>Choose a photo or video</strong>
          <span>Click here to browse your device</span>
          <small>Images and videos supported (max 50 MB)</small>
        </label>

        <input
          id="festival-file"
          type="file"
          accept="image/*,video/*"
          onChange={handleUpload}
          required
        />

        {file && (
          <div className="selected-file">
            <strong>Selected file:</strong> {file.name}

            {file.type.startsWith("image/") && (
              <img
                className="upload-preview"
                src={URL.createObjectURL(file)}
                alt="Selected festival preview"
              />
            )}

            {file.type.startsWith("video/") && (
              <video
                className="upload-preview"
                src={URL.createObjectURL(file)}
                controls
              />
            )}
          </div>
        )}

        <div className="upload-fields">
          <label>
            Festival Name

            <input
              value={festivalName}
              onChange={(e) => setFestivalName(e.target.value)}
              placeholder="e.g. Pongal Festival"
              required
            />
          </label>

          <label>
            Category

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Ritual</option>
              <option>Dance</option>
              <option>Music</option>
              <option>Procession</option>
              <option>Decoration</option>
              <option>Food</option>
              <option>Harvest</option>
            </select>
          </label>

          <label>
            Location

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Madurai, Tamil Nadu"
              required
            />
          </label>

          <label>
            Description

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this festival memory..."
              rows="3"
            />
          </label>
        </div>

        <button
          className="upload-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Upload Festival Media"}
        </button>
      </form>

      <section className="uploaded-section">
        <h2>Recently Added</h2>

             {loadingUploads ? (
          <p className="upload-help">Loading saved uploads...</p>
        ) : uploaded.length === 0 ? (
          <p className="upload-help">
            Your uploaded festival photos and videos will appear here.
          </p>
        ) : (
          <div className="uploaded-grid">
            {uploaded.map((item) => (
              <article className="gallery-card" key={item.id}>
                {item.fileType?.startsWith("video/") ? (
                  <video
                    className="uploaded-video"
                    src={item.previewUrl}
                    controls
                  />
                ) : (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                  />
                )}

                <div className="gallery-card-content">
                  <h3>{item.name}</h3>
                  <p>📍 {item.location}</p>
                  <span>{item.category}</span>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  <small>{item.fileName}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Upload;

