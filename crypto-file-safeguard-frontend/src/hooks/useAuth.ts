import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    // Remove the token from storage
    localStorage.removeItem("jwtToken");
    // Update the state to reflect the user is logged out
    setIsLoggedIn(false);
    // Redirect to the home page to clear everything
    window.location.href = "/"; // <-- This line has been changed
  };

  return { isLoggedIn, logout };
};
