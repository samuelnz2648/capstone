// capstone/frontend/src/index.js

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "bootstrap/dist/css/bootstrap.min.css";

// Performance monitoring
const reportWebVitals = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
      "web-vitals"
    );
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  }
};

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Call reportWebVitals
reportWebVitals();
