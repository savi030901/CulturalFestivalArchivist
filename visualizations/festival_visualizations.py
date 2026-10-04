import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "festival_dataset.csv"
OUTPUT_DIR = BASE_DIR / "visualizations"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Load dataset
df = pd.read_csv(DATA_FILE)

print("Dataset loaded successfully!")
print(f"Total records: {len(df)}")
print(f"Categories: {df['Category'].nunique()}")

# 1. Category distribution
plt.figure(figsize=(8, 5))
df["Category"].value_counts().plot(kind="bar")
plt.title("Festival Category Distribution")
plt.xlabel("Category")
plt.ylabel("Number of Records")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "category_distribution.png")
plt.close()

# 2. Category pie chart
plt.figure(figsize=(7, 7))
df["Category"].value_counts().plot(
    kind="pie",
    autopct="%1.1f%%"
)
plt.title("Festival Category Share")
plt.ylabel("")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "category_pie_chart.png")
plt.close()

# 3. Media count by festival
festival_media = df.groupby("Festival")["Media_Count"].mean().sort_values()

plt.figure(figsize=(9, 6))
festival_media.plot(kind="barh")
plt.title("Average Media Count by Festival")
plt.xlabel("Average Media Count")
plt.ylabel("Festival")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "media_count_by_festival.png")
plt.close()

# 4. Box plot
plt.figure(figsize=(8, 5))
sns.boxplot(
    data=df,
    x="Category",
    y="Media_Count"
)
plt.title("Media Count Distribution by Category")
plt.xlabel("Category")
plt.ylabel("Media Count")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "media_count_boxplot.png")
plt.close()

# 5. Scatter plot
plt.figure(figsize=(8, 5))
sns.scatterplot(
    data=df,
    x="Media_Count",
    y="Festival",
    hue="Category"
)
plt.title("Media Count vs Festival")
plt.xlabel("Media Count")
plt.ylabel("Festival")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "media_count_scatter.png")
plt.close()

# 6. Correlation heatmap
numeric_data = df[["Media_Count"]]

plt.figure(figsize=(6, 5))
sns.heatmap(
    numeric_data.corr(),
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)
plt.title("Correlation Heatmap")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "correlation_heatmap.png")
plt.close()

print("\nVisualization files created successfully!")

print("\nCreated files:")
print("1. category_distribution.png")
print("2. category_pie_chart.png")
print("3. media_count_by_festival.png")
print("4. media_count_boxplot.png")
print("5. media_count_scatter.png")
print("6. correlation_heatmap.png")
# 7. Clustering
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

cluster_data = df[["Media_Count"]].copy()

scaler = StandardScaler()
scaled_data = scaler.fit_transform(cluster_data)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
df["Cluster"] = kmeans.fit_predict(scaled_data)

plt.figure(figsize=(9, 5))

plt.scatter(
    df.index,
    df["Media_Count"],
    c=df["Cluster"],
    s=100
)

plt.title("Festival Media Count Clustering")
plt.xlabel("Festival Record")
plt.ylabel("Media Count")

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "festival_clustering.png",
    dpi=150
)

plt.close()

print("7. festival_clustering.png")