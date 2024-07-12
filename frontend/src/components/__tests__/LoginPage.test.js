// frontend/src/components/__tests__/LoginPage.test.js

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoginPage from "../LoginPage";

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderLoginPage = () => {
  return render(
    <Router>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginPage />
      </AuthContext.Provider>
    </Router>
  );
};

describe("LoginPage", () => {
  it("should render login form", () => {
    const { getByLabelText, getByText } = renderLoginPage();
    expect(getByLabelText(/username/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByText(/login/i)).toBeInTheDocument();
  });

  it("should call login function on form submit", async () => {
    const { getByLabelText, getByText } = renderLoginPage();
    fireEvent.change(getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(getByText(/login/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "password123", false);
    });
  });
});
