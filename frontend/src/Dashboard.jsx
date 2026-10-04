import { useState } from "react";

function Dashboard() {
  const defaultFestivals = [
    { category: "Ritual" },
    { category: "Lighting" },
    { category: "Dance" },
    { category: "Harvest" },
    { category: "Dance" },
    { category: "Ritual" },
  ];

  const [uploads] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("festivalUploads") || "[]"
      );
    } catch {
      return [];
    }
  });

  const allFestivals = [
    ...defaultFestivals,
    ...uploads,
  ];

  const categories = {};

  allFestivals.forEach((item) => {
    const category = item.category || "Other";

    categories[category] =
      (categories[category] || 0) + 1;
  });

  const categoryData = Object.entries(categories);

  const totalFestivals = allFestivals.length;

  const photos = uploads.filter((item) =>
    item.fileType?.startsWith("image/")
  ).length;

  const videos = uploads.filter((item) =>
    item.fileType?.startsWith("video/")
  ).length;

  const maxValue =
    Math.max(...categoryData.map((item) => item[1]), 1);

  return (
    <main className="dashboard-page">

      <header className="gallery-header">
        <div>
          <p className="gallery-tag">
            CULTURAL HERITAGE ARCHIVE
          </p>

          <h1>📊 Archive Dashboard</h1>

          <p>
            Overview of your cultural festival collection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => (window.location.href = "/")}
        >
          ← Home
        </button>
      </header>

      {/* STATISTICS */}

      <section className="stats">

        <div className="stat-card">
          <span>🖼️</span>
          <div>
            <p>Total Festivals</p>
            <h2>{totalFestivals}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>📸</span>
          <div>
            <p>Uploaded Photos</p>
            <h2>{photos}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🎥</span>
          <div>
            <p>Uploaded Videos</p>
            <h2>{videos}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🏷️</span>
          <div>
            <p>Categories</p>
            <h2>{categoryData.length}</h2>
          </div>
        </div>

      </section>

      {/* CATEGORY CHART */}

      <section className="dashboard-section">

        <h2>📊 Festival Category Distribution</h2>

        <div className="simple-chart">

          {categoryData.map(([category, count]) => {

            const percentage =
              (count / maxValue) * 100;

            return (
              <div
                className="chart-row"
                key={category}
              >

                <div className="chart-label">
                  <span>{category}</span>
                  <strong>{count}</strong>
                </div>

                <div className="chart-bar-background">

                  <div
                    className="chart-bar"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* CATEGORY OVERVIEW */}

      <section className="dashboard-section">

        <h2>📁 Category Overview</h2>

        <div className="category-list">

          {categoryData.map(
            ([category, count]) => (
              <div
                className="category-item"
                key={category}
              >
                <span>{category}</span>

                <strong>{count}</strong>
              </div>
            )
          )}

        </div>

      </section>

      {/* RECENT UPLOADS */}

      <section className="dashboard-section">

        <h2>✨ Recent Uploads</h2>

        {uploads.length === 0 ? (
          <p>
            No uploaded media yet.
          </p>
        ) : (
          <div className="dashboard-upload-list">

            {uploads
              .slice()
              .reverse()
              .slice(0, 5)
              .map((item) => (
                <div
                  className="dashboard-upload-item"
                  key={item.id}
                >

                  <h3>{item.name}</h3>

                  <p>
                    📍 {item.location}
                  </p>

                  <small>
                    {item.category}
                  </small>

                </div>
              ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default Dashboard;
