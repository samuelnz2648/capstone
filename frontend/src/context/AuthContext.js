// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );
  const [username, setUsername] = useState(() =>
    localStorage.getItem("username")
  );
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setAuthHeader = (token) => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    };

    setAuthHeader(authToken);
  }, [authToken]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);
      setAuthToken(token);
      setUsername(username);
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setAuthToken(null);
    setUsername(null);
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        username,
        login,
        logout,
        error,
        clearError,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
