import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Home.tsx";
import FilesPage from "./pages/Files.tsx";
import ContactPage from "./pages/Contact.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  // The <BrowserRouter> has been removed from this file
  return (
    <Routes>
      {/* Routes that use the main layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Standalone routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
