SpaceX Launch Data Analysis and Prediction 

This project analyzes SpaceX Falcon 9 launch data and builds machine learning models to predict whether the first stage of the rocket will successfully land.
The project follows the complete Data Science methodology including: Data Collection using API Web Scraping Data Wrangling Exploratory Data Analysis (EDA) SQL Analysis Interactive Visual Analytics Machine Learning Prediction

Business Problem

SpaceX reduces launch cost by reusing Falcon 9 rocket boosters. Predicting booster landing success helps estimate launch cost and improves decision-making for space missions.

Technologies Used
Python
Pandas
NumPy
Matplotlib & Seaborn
Plotly Dash
Folium Maps
SQL
Scikit-learn
BeautifulSoup
Jupyter Notebook

Data Sources

SpaceX REST API
Wikipedia
Web Scraping

Project Structure 
SpaceX-Capstone/ │
├── notebooks/ 
│ api_data_collection.ipynb
│ web_scraping.ipynb
│ data_wrangling.ipynb
│ eda_visualization.ipynb
│ sql_analysis.ipynb
│ folium_map.ipynb
│ ml_prediction.ipynb
│ dash_app.py │
├── dataset/
├── screenshots/
├── README.md

Project Workflow

Data Collection

Collected launch data using SpaceX API Extracted historical launch data using web scraping

Data Wrangling

Cleaned missing values Created landing success classification Selected important features

Exploratory Data Analysis

Launch success rate by site Payload vs landing success Orbit vs success rate Yearly launch trend

SQL Analysis

Performed queries to analyze:

Launch counts Payload distribution Success rates by site Booster version performance

Interactive Visualization

Folium map showing launch site locations Plotly Dash dashboard with:
Success pie chart Payload vs outcome scatter plot

Machine Learning Prediction

Models Used:

Logistic Regression Decision Tree Random Forest Support Vector Machine Model evaluation included:
Accuracy score Confusion matrix Best model comparison

Results

Payload mass and launch site strongly influence landing success. Certain booster versions show higher reliability.
Machine learning models achieved strong prediction accuracy.
