import pandas as pd
import numpy as np
import io
import requests
import os
import pickle
from sklearn import preprocessing
from sklearn.linear_model import LogisticRegression

def download_data():
    os.makedirs('data', exist_ok=True)
    
    urls = {
        'dashboard': "https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-DS0321EN-SkillsNetwork/datasets/spacex_launch_dash.csv",
        'part2': "https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-DS0321EN-SkillsNetwork/datasets/dataset_part_2.csv",
        'part3': "https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-DS0321EN-SkillsNetwork/datasets/dataset_part_3.csv"
    }
    
    file_paths = {}
    for name, url in urls.items():
        file_path = f"data/{name}.csv"
        if not os.path.exists(file_path):
            print(f"Downloading {name} from {url}...")
            response = requests.get(url)
            with open(file_path, 'wb') as f:
                f.write(response.content)
        file_paths[name] = file_path
        
    return file_paths

def train_and_save_model(file_paths):
    print("Loading data...")
    # Load dataset_part_2.csv
    data = pd.read_csv(file_paths['part2'])
    
    # Load dataset_part_3.csv (Features)
    X_raw = pd.read_csv(file_paths['part3'])
    
    Y = data['Class'].to_numpy()
    
    print("Scaling features...")
    scaler = preprocessing.StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)
    
    print("Training Logistic Regression model...")
    # Using the best parameters found in the notebook: {'C': 0.01, 'penalty': 'l2', 'solver': 'lbfgs'}
    lr = LogisticRegression(C=0.01, penalty='l2', solver='lbfgs')
    lr.fit(X_scaled, Y)
    
    # Check accuracy on train set
    acc = lr.score(X_scaled, Y)
    print(f"Model trained with training accuracy: {acc:.4f}")
    
    # Save the model and scaler
    with open('model.pkl', 'wb') as f:
        pickle.dump(lr, f)
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
        
    # Also save the columns used in X so the API knows how to encode new payloads
    with open('features.pkl', 'wb') as f:
        pickle.dump(list(X_raw.columns), f)
        
    print("Artifacts saved successfully (model.pkl, scaler.pkl, features.pkl)")

if __name__ == "__main__":
    paths = download_data()
    train_and_save_model(paths)
