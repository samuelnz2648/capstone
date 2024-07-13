// capstone/frontend/src/App.js

import React, { useContext, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { TodoProvider } from "./context/TodoContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner"; 
import NotFound from "./components/NotFound";

// Lazy load components for better performance
const LoginPage = React.lazy(() => import("./components/LoginPage"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const RegisterPage = React.lazy(() => import("./components/RegisterPage"));
const TodoPage = React.lazy(() => import("./components/TodoPage"));
const SummaryPage = React.lazy(() => import("./components/SummaryPage"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TodoProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/todos"
                  element={
                    <ProtectedRoute>
                      <TodoPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/summary"
                  element={
                    <ProtectedRoute>
                      <SummaryPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </TodoProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const ProtectedRoute = ({ children }) => {
  const { authToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return authToken ? children : <Navigate to="/" />;
};

export default App;
