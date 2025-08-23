import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
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

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          // If a token exists, fetch the user's data
          const response = await api.get("/users/me");
          setUser(response.data);
        } catch (error) {
          console.error(
            "Failed to fetch user on load, token might be invalid.",
            error
          );
          localStorage.removeItem("jwtToken"); // Clean up invalid token
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    window.location.href = "/"; // Redirect to home on logout
  };

  // Determine login status based on the presence of user data
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoggedIn, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create the custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
