import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8081/api", // The base URL of your Spring Boot backend
});

// This part automatically adds the JWT to your requests after you log in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
