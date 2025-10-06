import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// The complete user profile object
interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  privateKey: string;
  ethereumAddress: string;
}

// The shape of our context
interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<void>;
  // --- ADDED THIS LINE BACK ---
  register: (credentials: {
    name: string;
    email: string;
    password?: string;
    phoneNumber?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUserData: (newData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("cfsUser");
    setUser(null);
    navigate("/");
  }, [navigate]);

  const login = async (credentials: { email: string; password?: string }) => {
    const response = await api.post<{ token: string } & UserProfile>(
      "/auth/login",
      credentials
    );
    const { token, ...userData } = response.data;
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("cfsUser", JSON.stringify(userData));
    setUser(userData);
    navigate("/files");
  };

  // --- ADDED THIS FUNCTION IMPLEMENTATION BACK ---
  const register = async (credentials: {
    name: string;
    email: string;
    password?: string;
    phoneNumber?: string;
  }) => {
    // This function calls the backend endpoint but does not log the user in.
    await api.post("/auth/register", credentials);
  };

  const updateUserData = (newData: Partial<UserProfile>) => {
    setUser((currentUser) => {
      if (currentUser) {
        const updatedUser = { ...currentUser, ...newData };
        localStorage.setItem("cfsUser", JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("cfsUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        // --- ADDED REGISTER TO THE PROVIDED VALUE ---
        register,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
