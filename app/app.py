
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

from models.festival_models import train_models
from sklearn.metrics import ConfusionMatrixDisplay
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# ==================================================
# PAGE CONFIG
# ==================================================

st.set_page_config(
    page_title="Cultural Festival Archivist",
    page_icon="🏛️",
    layout="wide"
)


# ==================================================
# CUSTOM CSS
# ==================================================

st.markdown("""
<style>

.main {
    background-color: #f7f8fa;
}

.dashboard-title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 5px;
}

.dashboard-subtitle {
    font-size: 17px;
    color: #666;
    margin-bottom: 25px;
}

div[data-testid="stMetric"] {
    background: white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
}

div[data-testid="stMetricValue"] {
    font-size: 28px;
    font-weight: 700;
}

.stButton > button {
    border-radius: 8px;
    font-weight: 600;
}

</style>
""", unsafe_allow_html=True)


# ==================================================
# LOAD DATASET
# ==================================================

df = pd.read_csv("data/festival_dataset.csv")
# ==================================================
# DATASET CLEANING STATISTICS
# ==================================================

raw_df = pd.read_csv("data/festival_dataset.csv")

original_records = len(raw_df)

duplicate_records = raw_df.duplicated().sum()

missing_records = raw_df.isna().any(axis=1).sum()

# ==================================================
# CLEAN DATASET
# ==================================================

df = df.drop_duplicates()
df = df.dropna()
df = df.reset_index(drop=True)


# ==================================================
# SIDEBAR
# ==================================================

with st.sidebar:

    st.header("📂 Archive Menu")

    menu = st.sidebar.radio(
        "Navigate",
        [
            "Dashboard",
            "Festival Dataset",
            "ML Model Comparison",
            "Confusion Matrix",
            "Visualizations"
        ]
    )

    st.divider()

    st.subheader("🔎 Quick Info")

    st.write(
        "Explore cultural festival records, media "
        "and AI model results."
    )


# ==================================================
# DASHBOARD
# ==================================================

if menu == "Dashboard":

    st.markdown(
        '<div class="dashboard-title">'
        'CulturalFestival Digital Archivist'
        '</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="dashboard-subtitle">'
        'AI-Powered Cultural Festival Dashboard — '
        'Explore festival media, categories, locations '
        'and AI classification results.'
        '</div>',
        unsafe_allow_html=True
    )

    # ----------------------------------------------
    # STATISTICS
    # ----------------------------------------------

    st.subheader("📊 Archive Statistics")

    col1, col2, col3, col4 = st.columns(4)

    col1.metric(
        "Total Festivals",
        len(df)
    )

    col2.metric(
        "Total Media",
        int(df["Media_Count"].sum())
    )

    col3.metric(
        "Categories",
        df["Category"].nunique()
    )

    col4.metric(
        "Locations",
        df["Location"].nunique()
    )

    st.divider()

    # ----------------------------------------------
    # FESTIVAL MEDIA CHART
    # ----------------------------------------------

    st.subheader("📸 Media by Festival")

    festival_media = (
        df.groupby("Festival")["Media_Count"]
        .sum()
        .sort_values(ascending=False)
    )

    st.bar_chart(festival_media)

    # ----------------------------------------------
    # LOCATION CHART
    # ----------------------------------------------

    st.subheader("📍 Location Distribution")

    location_counts = df["Location"].value_counts()

    st.bar_chart(location_counts)

    # ----------------------------------------------
    # CATEGORY CHART
    # ----------------------------------------------

    st.subheader("🎭 Festival Category Distribution")

    category_counts = df["Category"].value_counts()

    st.bar_chart(category_counts)


# ==================================================
# FESTIVAL DATASET
# ==================================================

elif menu == "Festival Dataset":
    # ==================================================
    # DATASET CLEANING SUMMARY
    # ==================================================

    st.subheader("🧹 Dataset Cleaning Summary")

    cleaned_records = len(df)

    col1, col2, col3, col4 = st.columns(4)

    col1.metric(
        "Original Records",
        original_records
    )

    col2.metric(
        "Duplicates Removed",
        duplicate_records
    )

    col3.metric(
        "Missing Rows Removed",
        missing_records
    )

    col4.metric(
        "Cleaned Records",
        cleaned_records
    )
    st.header("📊 Festival Dataset")

    st.write(
        "Browse, search and filter cultural festival records."
    )

    # ----------------------------------------------
    # SEARCH
    # ----------------------------------------------

    search_festival = st.text_input(
        "🔎 Search Festival Name"
    )

    # ----------------------------------------------
    # LOCATION FILTER
    # ----------------------------------------------

    locations = [
        "All"
    ] + sorted(
        df["Location"].unique().tolist()
    )

    selected_location = st.selectbox(
        "📍 Filter by Location",
        locations
    )

    # ----------------------------------------------
    # CATEGORY FILTER
    # ----------------------------------------------

    categories = [
        "All"
    ] + sorted(
        df["Category"].unique().tolist()
    )

    selected_category = st.selectbox(
        "🎭 Filter by Category",
        categories
    )

    filtered_df = df.copy()

    if search_festival:

        filtered_df = filtered_df[
            filtered_df["Festival"]
            .str.contains(
                search_festival,
                case=False,
                na=False
            )
        ]

    if selected_location != "All":

        filtered_df = filtered_df[
            filtered_df["Location"]
            == selected_location
        ]

    if selected_category != "All":

        filtered_df = filtered_df[
            filtered_df["Category"]
            == selected_category
        ]

    st.subheader("Filtered Festival Records")

    st.dataframe(
        filtered_df,
        use_container_width=True
    )

    st.write(
        "Matching records:",
        len(filtered_df)
    )

    # ----------------------------------------------
    # DOWNLOAD FILTERED DATA
    # ----------------------------------------------

    csv_data = filtered_df.to_csv(
        index=False
    ).encode("utf-8")

    st.download_button(
        label="📥 Download Filtered Dataset",
        data=csv_data,
        file_name="filtered_festival_dataset.csv",
        mime="text/csv"
    )


# ==================================================
# ML MODEL COMPARISON
# ==================================================

elif menu == "ML Model Comparison":

    st.header("🤖 ML Model Comparison")

    st.write(
        "Compare machine learning models using "
        "Accuracy, Precision, Recall and F1-score."
    )

    # ----------------------------------------------
    # TRAIN MODELS
    # ----------------------------------------------

    results, confusion_matrices = train_models(df)

    # ----------------------------------------------
    # RESULTS TABLE
    # ----------------------------------------------

    results_df = pd.DataFrame.from_dict(
        results,
        orient="index"
    )

    results_df.index.name = "Model"

    results_df = results_df.reset_index()

    # ----------------------------------------------
    # DISPLAY METRICS
    # ----------------------------------------------

    display_df = results_df.copy()

    display_df["Accuracy"] = (
        display_df["Accuracy"] * 100
    ).round(2)

    display_df["Precision"] = (
        display_df["Precision"]
        .round(4)
    )

    display_df["Recall"] = (
        display_df["Recall"]
        .round(4)
    )

    display_df["F1-score"] = (
        display_df["F1-score"]
        .round(4)
    )

    st.subheader("📋 Model Performance Metrics")

    st.dataframe(
        display_df,
        use_container_width=True
    )

    # ----------------------------------------------
    # ACCURACY CHART
    # ----------------------------------------------

    st.subheader("📊 Model Accuracy Comparison")

    accuracy_chart = display_df[
        ["Model", "Accuracy"]
    ].set_index("Model")

    st.bar_chart(
        accuracy_chart
    )

    # ----------------------------------------------
    # METRIC CHART
    # ----------------------------------------------

    st.subheader("📈 Model Metrics Comparison")

    metric_chart = display_df[
        [
            "Model",
            "Precision",
            "Recall",
            "F1-score"
        ]
    ].set_index("Model")

    st.bar_chart(
        metric_chart
    )


# ==================================================
# CONFUSION MATRIX
# ==================================================

# ==================================================
# CONFUSION MATRIX
# ==================================================

elif menu == "Confusion Matrix":

    st.header("🧩 Confusion Matrix")

    st.write(
        "Confusion matrices for all trained "
        "machine learning models."
    )

    results, confusion_matrices = train_models(df)

    for name, cm in confusion_matrices.items():

        st.subheader(name)

        cm_array = np.array(cm)

        fig, ax = plt.subplots()

        ConfusionMatrixDisplay(
            confusion_matrix=cm_array
        ).plot(
            ax=ax,
            values_format="d"
        )

        ax.set_title(
            f"{name} - Confusion Matrix"
        )

        st.pyplot(
            fig,
            clear_figure=True
        )
        # ==================================================
# VISUALIZATIONS
# ==================================================

elif menu == "Visualizations":

    st.header("📊 Festival Visualizations")

    st.write(
        "Explore different visualizations of the "
        "cultural festival dataset."
    )

    # ==================================================
    # PIE CHART
    # ==================================================

    st.subheader("🎭 Festival Category Distribution")

    category_counts = df["Category"].value_counts()

    fig, ax = plt.subplots()

    ax.pie(
        category_counts,
        labels=category_counts.index,
        autopct="%1.1f%%",
        startangle=90
    )

    ax.set_title("Festival Categories")

    st.pyplot(fig, clear_figure=True)

    # ==================================================
    # BOX PLOT
    # ==================================================

    st.subheader("📦 Media Count Distribution")

    fig, ax = plt.subplots()

    sns.boxplot(
        y=df["Media_Count"],
        ax=ax
    )

    ax.set_ylabel("Media Count")
    ax.set_title("Festival Media Count Distribution")

    st.pyplot(fig, clear_figure=True)

    # ==================================================
    # SCATTER PLOT
    # ==================================================

    st.subheader("🔵 Media Count by Festival Record")

    fig, ax = plt.subplots()

    ax.scatter(
        range(len(df)),
        df["Media_Count"]
    )

    ax.set_xlabel("Festival Record")
    ax.set_ylabel("Media Count")
    ax.set_title("Festival Media Count Scatter Plot")

    st.pyplot(fig, clear_figure=True)

    # ==================================================
    # CORRELATION HEATMAP
    # ==================================================

    st.subheader("🔥 Correlation Heatmap")

    numeric_df = df.select_dtypes(
        include=np.number
    )

    if numeric_df.shape[1] >= 2:

        correlation = numeric_df.corr()

        fig, ax = plt.subplots(
            figsize=(8, 5)
        )

        sns.heatmap(
            correlation,
            annot=True,
            cmap="coolwarm",
            fmt=".2f",
            ax=ax
        )

        ax.set_title(
            "Festival Dataset Correlation"
        )

        st.pyplot(
            fig,
            clear_figure=True
        )

    else:

        st.info(
            "Not enough numeric columns available "
            "for correlation analysis."
        )
            # ==================================================
    # K-MEANS CLUSTERING
    # ==================================================

    st.subheader("🔗 Festival Clustering")

    st.write(
        "Group festival records into clusters based on "
        "their numeric characteristics."
    )

    clustering_data = df[
        ["Media_Count"]
    ].copy()

    if len(clustering_data) >= 3:

        scaler = StandardScaler()

        scaled_data = scaler.fit_transform(
            clustering_data
        )

        kmeans = KMeans(
            n_clusters=3,
            random_state=42,
            n_init=10
        )

        clusters = kmeans.fit_predict(
            scaled_data
        )

        clustering_data["Cluster"] = clusters

        fig, ax = plt.subplots()

        scatter = ax.scatter(
            range(len(clustering_data)),
            clustering_data["Media_Count"],
            c=clustering_data["Cluster"],
            s=80
        )

        ax.set_xlabel("Festival Record")
        ax.set_ylabel("Media Count")
        ax.set_title("K-Means Festival Clustering")

        st.pyplot(
            fig,
            clear_figure=True
        )

        st.subheader("📋 Clustered Festival Records")

        result_df = df[
            ["Festival", "Location", "Category", "Media_Count"]
        ].copy()

        result_df["Cluster"] = clusters

        st.dataframe(
            result_df,
            use_container_width=True
        )

    else:

        st.warning(
            "At least 3 festival records are required "
            "for clustering."
        )