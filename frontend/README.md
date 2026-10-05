# 🏛️ CulturalFestivalArchivist

## AI-Powered Digital Cultural Festival Archive

CulturalFestivalArchivist is an AI-powered digital archive designed to preserve, organize, search and analyze cultural festival information and media.

The system combines a React frontend, FastAPI backend and Streamlit-based machine-learning dashboard.

## 🚀 Main Features

* User and Admin Login
* User Dashboard
* Festival Media Upload
* Digital Gallery
* Search Festival Media
* Media Delete Management
* Admin Dashboard
* Festival Dataset Management
* Dataset Search and Filtering
* Dataset Cleaning Summary
* CSV Dataset Download
* Machine Learning Model Comparison
* Confusion Matrix
* Festival Visualizations
* K-Means Clustering

## 🤖 Machine Learning Models

The project compares four machine-learning algorithms:

1. Logistic Regression
2. Decision Tree
3. Random Forest
4. XGBoost

The models are evaluated using:

* Accuracy
* Precision
* Recall
* F1-score

## 📊 Data Visualizations

The Streamlit dashboard provides:

* Festival Category Pie Chart
* Media Count Box Plot
* Media Count Scatter Plot
* Correlation Heatmap
* Confusion Matrix
* K-Means Clustering Visualization
* Model Accuracy Comparison

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Python
* FastAPI
* Uvicorn

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost

### Data Visualization

* Streamlit
* Matplotlib
* Seaborn

## 📁 Project Structure

```text
CulturalFestivalArchivist/
│
├── app/
│   └── app.py
│
├── data/
│   └── festival_dataset.csv
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── models/
│   └── festival_models.py
│
├── uploaded_media/
│
├── server.py
├── festival_uploads.json
├── requirements.txt
└── README.md
```

## ▶️ How to Run the Project

### 1. Start the React Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### 2. Start the FastAPI Backend

From the project root:

```bash
python -m uvicorn server:app --reload --port 8000
```

Backend:

```text
https://cultural-festival-backend-bf80.onrender.com
```

### 3. Start the Streamlit ML Dashboard

Activate the virtual environment:

```bash
source .venv/Scripts/activate
```

Then run:

```bash
python -m streamlit run app/app.py --server.port 8501
```

ML Dashboard:

```text
http://localhost:8501
```

## 🧹 Dataset Cleaning

Before analysis and model training, the dataset is cleaned by:

* Removing duplicate records
* Removing rows containing missing values
* Resetting the dataframe index

The dashboard also displays a dataset cleaning summary.

## 🔗 System Architecture

```text
User
  │
  ▼
React Frontend
  │
  ▼
FastAPI Backend
  │
  ├── Media Storage
  └── Festival Data
          │
          ▼
   Machine Learning
          │
          ▼
Streamlit Dashboard
          │
          ├── Model Comparison
          ├── Confusion Matrix
          ├── Visualizations
          └── K-Means Clustering
```

## 🎯 Project Objective

The main objective of CulturalFestivalArchivist is to provide a digital platform for preserving cultural festival memories while using machine learning and data visualization techniques to analyze festival data.

## 👥 Project Type

Academic / Hackathon Project

## 📌 Future Enhancements

* Cloud-based media storage
* User profile management
* Advanced AI-based image classification
* Automatic festival recognition
* Real-time notifications
* Cloud deployment
