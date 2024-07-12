// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import api, { setAuthToken } from "../utils/api";

export const AuthContext = createContext();

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
    if (authToken) {
      setAuthToken(authToken);
    }
  }, [authToken]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/users/login", {
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
    setAuthToken(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post("/users/refresh-token");
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      setAuthToken(token);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  }, [logout]);

  const validateToken = useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else if (decodedToken.exp * 1000 - Date.now() < 300000) {
          // 5 minutes
          refreshToken();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [logout, refreshToken]);

  useEffect(() => {
    validateToken();
    const interval = setInterval(validateToken, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [validateToken]);

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
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
