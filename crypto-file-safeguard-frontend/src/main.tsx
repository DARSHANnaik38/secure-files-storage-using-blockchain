import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Import BrowserRouter
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ContractProvider } from "./context/ContractContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 2. Wrap everything with BrowserRouter */}
    <BrowserRouter>
      <ContractProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContractProvider>
    </BrowserRouter>
  </React.StrictMode>
);
