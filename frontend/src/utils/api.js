// frontend/src/utils/api.js

import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
};

// Add this interceptor to automatically add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
