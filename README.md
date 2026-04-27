SpaceX Falcon 9 Landing Predictor - Full Stack Application

![SpaceX Falcon 9 Landing Predictor](Screenshots/dashboard_screenshot.jpg) <!-- Ensure you add a screenshot here later! -->

Welcome to the **SpaceX Falcon 9 Landing Predictor**. This project predicts whether the first stage of a SpaceX Falcon 9 rocket will land successfully. Landing the first stage significantly reduces the cost of space launches (from roughly $165M to ~$60M), a key competitive advantage for SpaceX. 

Originally built as a series of standalone Jupyter Notebooks evaluating different Machine Learning models, this repository has been professionally refactored into a sleek, full-stack web application! 

Key Features

*   **Interactive React Dashboard**: A gorgeous dark-themed, glassmorphic UI built natively in React (Vite) and styled from scratch without heavy CSS frameworks. 
*   **FastAPI Machine Learning Server**: A highly optimized Python backend that streams historical datasets and serves live Machine Learning predictions from our optimal trained model.
*   **Live Mission Predictor**: Users can interact with the dynamic frontend UI, tweak launch parameters (Payload Mass, Orbit, Launch Site, Grid Fins), and receive live, visually-animated probability confidence scores of landing success!
*   **End-to-End ML Pipeline**: The `backend/train_model.py` pipeline ingests raw `scikit-learn` datasets and serializes complex categorical classifiers (`LogisticRegression`) complete with standard scalers directly to disk.

Technology Stack

**Frontend**
*   **React + Vite**: For a lightning-fast, modular UI architecture.
*   **Recharts**: Powering the dynamic payload scatter plots and site-success pie charts.
*   **Lucide-React**: Clean, lightweight iconography.

**Backend**
*   **FastAPI**: Blazing fast Python web server for serving data and inference.
*   **Scikit-Learn**: Implementation of the LogisticRegression classification algorithm.
*   **Pandas & NumPy**: Core data manipulation and feature one-hot encoding.
*   **Uvicorn**: ASGI web server implementation.

Running the Application Locally

The application utilizes a decoupled architecture, operating both the React frontend and Python backend simultaneously.

### 1. Start the Machine Learning Backend
Open a terminal in the project root and start the API:
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
*The API will start at `http://127.0.0.1:8000`*

### 2. Start the Frontend Dashboard
Open a second terminal to run the UI:
```bash
cd frontend
npm install
npm run dev
```
*Access the dashboard at `http://localhost:5173`*

## 📊 Data Science Methodology

Before this full-stack migration, exhaustive data analysis and modeling were performed using standard Data Science tools:
1.  **Data Collection**: REST API calls to the SpaceX API and web scraping Wikipedia for Falcon 9 launch records.
2.  **Data Wrangling**: Cleaning missing values and calculating payload mass means using Pandas.
3.  **Exploratory Data Analysis (EDA)**: Leveraging SQL (Db2) and visualization libraries (Matplotlib, Seaborn) to uncover launch trends.
4.  **Interactive Visualizations**: Prototyping dashboards using Folium for geographic maps and Plotly Dash.
5.  **Predictive Modeling**: Training Logistic Regression, SVM, Decision Trees, and KNN models to find the highest accuracy classifier. `LogisticRegression` was ultimately chosen for the live backend API!

---
*Developed by Pratik004-PS*
