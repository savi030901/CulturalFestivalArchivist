import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import sys

# --------------------------------------------------
# PAGE CONFIG
# --------------------------------------------------

st.set_page_config(
    page_title="Cultural Festival Archivist",
    page_icon="🏛️",
    layout="wide"
)

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

DATA_FILE = BASE_DIR / "data" / "festival_dataset.csv"
MODEL_FILE = BASE_DIR / "models" / "festival_models.py"
VISUALIZATION_DIR = BASE_DIR / "visualizations"

# Allow importing train_models()
sys.path.insert(0, str(BASE_DIR))

from models.festival_models import train_models


# --------------------------------------------------
# TITLE
# --------------------------------------------------

st.title("🏛️ Cultural Festival Archivist")

st.markdown(
    """
    ### 🤖 AI-Powered Cultural Heritage Dashboard

    Explore festival data, machine learning model performance,
    and cultural heritage visualizations.
    """
)

st.divider()


# --------------------------------------------------
# LOAD DATASET
# --------------------------------------------------

@st.cache_data
def load_dataset():
    return pd.read_csv(DATA_FILE)


try:
    df = load_dataset()

except Exception as e:
    st.error(f"Could not load dataset: {e}")
    st.stop()


# --------------------------------------------------
# DATASET OVERVIEW
# --------------------------------------------------

st.header("📊 Dataset Overview")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Total Records",
        len(df)
    )

with col2:
    st.metric(
        "Festivals",
        df["Festival"].nunique()
    )

with col3:
    st.metric(
        "Locations",
        df["Location"].nunique()
    )

with col4:
    st.metric(
        "Categories",
        df["Category"].nunique()
    )


st.subheader("Festival Dataset")

st.dataframe(
    df,
    use_container_width=True
)


# --------------------------------------------------
# CATEGORY DISTRIBUTION
# --------------------------------------------------

st.divider()

st.header("🏷️ Festival Category Distribution")

category_counts = df["Category"].value_counts()

fig, ax = plt.subplots(figsize=(9, 5))

category_counts.plot(
    kind="bar",
    ax=ax
)

ax.set_title("Festival Category Distribution")
ax.set_xlabel("Category")
ax.set_ylabel("Number of Records")

plt.xticks(rotation=45)
plt.tight_layout()

st.pyplot(fig)


# --------------------------------------------------
# PIE CHART
# --------------------------------------------------

st.subheader("🥧 Category Share")

fig, ax = plt.subplots(figsize=(7, 7))

category_counts.plot(
    kind="pie",
    autopct="%1.1f%%",
    ax=ax
)

ax.set_ylabel("")

st.pyplot(fig)


# --------------------------------------------------
# MODEL TRAINING
# --------------------------------------------------

st.divider()

st.header("🤖 Machine Learning Model Comparison")

with st.spinner("Training machine learning models..."):

    try:

        results, confusion_matrices = train_models(df)

    except Exception as e:

        st.error(
            f"Model training failed: {e}"
        )

        st.stop()


# --------------------------------------------------
# MODEL RESULTS TABLE
# --------------------------------------------------

st.subheader("📈 Model Performance Metrics")

results_df = pd.DataFrame(results).T

st.dataframe(
    results_df.style.format("{:.4f}"),
    use_container_width=True
)


# --------------------------------------------------
# ACCURACY COMPARISON
# --------------------------------------------------

st.subheader("🎯 Accuracy Comparison")

fig, ax = plt.subplots(figsize=(9, 5))

results_df["Accuracy"].plot(
    kind="bar",
    ax=ax
)

ax.set_title("Model Accuracy Comparison")
ax.set_xlabel("Model")
ax.set_ylabel("Accuracy")
ax.set_ylim(0, 1.1)

plt.xticks(rotation=30)
plt.tight_layout()

st.pyplot(fig)


# --------------------------------------------------
# PRECISION / RECALL / F1
# --------------------------------------------------

st.subheader("📊 Precision, Recall and F1-score")

metrics_df = results_df[
    [
        "Precision",
        "Recall",
        "F1-score"
    ]
]

fig, ax = plt.subplots(figsize=(10, 5))

metrics_df.plot(
    kind="bar",
    ax=ax
)

ax.set_title(
    "Precision, Recall and F1-score Comparison"
)

ax.set_xlabel("Model")
ax.set_ylabel("Score")
ax.set_ylim(0, 1.1)

plt.xticks(rotation=30)
plt.tight_layout()

st.pyplot(fig)


# --------------------------------------------------
# CONFUSION MATRICES
# --------------------------------------------------

st.divider()

st.header("🔲 Confusion Matrices")

model_names = list(confusion_matrices.keys())

selected_model = st.selectbox(
    "Select a model",
    model_names
)

matrix = confusion_matrices[selected_model]

labels = sorted(
    df["Category"].unique()
)

fig, ax = plt.subplots(figsize=(7, 6))

sns.heatmap(
    matrix,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=labels,
    yticklabels=labels,
    ax=ax
)

ax.set_title(
    f"Confusion Matrix - {selected_model}"
)

ax.set_xlabel("Predicted")
ax.set_ylabel("Actual")

plt.xticks(rotation=45)
plt.yticks(rotation=0)
plt.tight_layout()

st.pyplot(fig)


# --------------------------------------------------
# OTHER VISUALIZATIONS
# --------------------------------------------------

st.divider()

st.header("📊 Cultural Heritage Visualizations")

visualization_files = [
    (
        "Category Distribution",
        "category_distribution.png"
    ),
    (
        "Category Pie Chart",
        "category_pie_chart.png"
    ),
    (
        "Media Count by Festival",
        "media_count_by_festival.png"
    ),
    (
        "Media Count Box Plot",
        "media_count_boxplot.png"
    ),
    (
        "Media Count Scatter Plot",
        "media_count_scatter.png"
    ),
    (
        "Correlation Heatmap",
        "correlation_heatmap.png"
    ),
    ("Festival Clustering", "festival_clustering.png"),
]


for title, filename in visualization_files:

    image_path = VISUALIZATION_DIR / filename

    if image_path.exists():

        st.subheader(title)

        st.image(
            str(image_path),
            use_container_width=True
        )

    else:

        st.warning(
            f"{filename} not found."
        )


# --------------------------------------------------
# FOOTER
# --------------------------------------------------

st.divider()

st.markdown(
    """
    **Cultural Festival Archivist**  
    AI-powered digital archive for preserving and exploring
    cultural festival heritage.
    """
)