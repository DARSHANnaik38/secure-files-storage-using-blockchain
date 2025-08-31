import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

// Define the shape of your user profile data
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
}

// Define the shape of the context value
interface AuthContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoggedIn: boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- AUTO-LOGOUT CONFIGURATION ---
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- REUSABLE LOGOUT FUNCTION ---
  // Using useCallback and useNavigate is a more modern React approach
  const logout = useCallback(() => {
    localStorage.removeItem("jwtToken"); // Use your specific token name
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/"); // Redirect to home on logout, as you specified
    console.log("User has been logged out.");
  }, [navigate]);

  // --- AUTO-LOGOUT ON INACTIVITY ---
  useEffect(() => {
    let inactivityTimer: number;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(logout, INACTIVITY_TIMEOUT);
    };

    // Listen for any user activity to reset the timer
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    resetTimer(); // Start the timer initially

    // Clean up listeners when the component is no longer on screen
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [logout]);

  // --- INITIAL LOAD AND TOKEN VERIFICATION ---
  useEffect(() => {
    // --- LOGOUT ON FRESH START (for development) ---
    // Ensures you start logged out every time you run `npm run dev`
    if (import.meta.env.DEV && !sessionStorage.getItem("devSessionActive")) {
      console.log("New development session detected. Clearing old token.");
      localStorage.removeItem("jwtToken");
      sessionStorage.setItem("devSessionActive", "true");
    }
    // --- END ---

    const token = localStorage.getItem("jwtToken");

    const fetchUser = async () => {
      if (token) {
        try {
          // Set the auth header for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await api.get("/users/me");
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user, token might be invalid.", error);
          logout(); // If the token is bad, trigger the full logout process
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [logout]);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoggedIn, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
