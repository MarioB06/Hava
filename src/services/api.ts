import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.113:8000/api'; // Domain
// const API_BASE_URL = '  '; // local IP

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;