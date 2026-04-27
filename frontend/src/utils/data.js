const API_URL = "http://127.0.0.1:8000/api/data";
const PREDICT_URL = "http://127.0.0.1:8000/api/predict";

export const fetchSpaceXData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from API: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching telemetry data:", error);
    throw error;
  }
};

export const predictLandingSuccess = async (payload) => {
  try {
    const response = await fetch(PREDICT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
        // Try to get error message from backend
        try {
            const errJson = await response.json();
            throw new Error(errJson.detail || "Prediction failed");
        } catch(e) {
            throw new Error(`Failed to predict: ${response.statusText}`);
        }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Prediction API Error:", error);
    throw error;
  }
};
