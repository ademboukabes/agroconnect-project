import axios from 'axios';

const AI_SERVICE_URL = 'http://localhost:8000';

export const analyzeTrip = async (tripData) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/analyze`, tripData);
        return response.data;
    } catch (error) {
        console.error('AI Service Error:', error.message);
        return null;
    }
};

export const rateDriver = async (driverId, trips) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/rate-driver`, {
            driverId,
            trips
        });
        return response.data;
    } catch (error) {
        console.error('AI Service Error (Rate Driver):', error.message);
        return null;
    }
};

export const estimatePrice = async (tripData) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/estimate-price`, tripData);
        return response.data;
    } catch (error) {
        console.error('AI Service Error (Price Estimate):', error.message);
        return null;
    }
};
