import axios from 'axios';

const API_URL = "http://localhost:8000/api"; // Django API server

// Signup - Create a new user
export const signup = async (username, email, password) => {
  return axios.post(`${API_URL}/signup/`, { username, email, password });
};

// Login - Retrieve JWT tokens
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, { username, password });


    // Storing the tokens in localStorage for subsequent requests
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);

    return response;
  } catch (error) {
    throw new Error('Login failed, please check your credentials.');
  }
};

// To use the refresh token and get a new access token
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    localStorage.setItem('access', response.data.access);
    return response.data.access;
  } catch (error) {
    throw new Error('Unable to refresh token.');
  }
};
