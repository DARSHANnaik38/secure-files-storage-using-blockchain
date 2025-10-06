import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home"; // Changed from HomePage to Home to match your file name
import Files from "./pages/Files"; // Changed from FilesPage to Files
import Contact from "./pages/Contact"; // Changed from ContactPage to Contact
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import React from "react";

// This component remains the same. It protects individual routes.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center p-10">Loading session...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* --- Routes that use the main Layout --- */}
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />

        {/* Private Routes: Each is wrapped in ProtectedRoute */}
        <Route
          path="files"
          element={
            <ProtectedRoute>
              <Files />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* --- Standalone routes that don't use the main Layout --- */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/files" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          isLoggedIn ? <Navigate to="/files" replace /> : <RegisterPage />
        }
      />

      {/* Catch-all 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
