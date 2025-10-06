import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "@/components/upload/FileUpload";
import { Upload, ShieldCheck, Box, Zap, Lock } from "lucide-react";

// This component shows a placeholder that directs logged-out users to register.
const UploadRedirect = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/register")}
      className="max-w-2xl mx-auto border-2 border-dashed border-gray-600 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-800 transition-colors"
    >
      <Upload className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-white">
        Upload Your Secure File
      </h3>
      <p className="text-muted-foreground">
        Click here to create an account and start uploading.
      </p>
    </div>
  );
};

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <main className="text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center pt-32 pb-16">
        <h1 className="text-5xl font-bold mb-4">Secure File Storage</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Store your files with military-grade encryption and blockchain
          security for your college project. Your data, protected.
        </p>
      </section>

      {/* Upload Section - This now correctly handles logged-in vs. logged-out users */}
      <section className="text-center px-4">
        <h2 className="text-3xl font-semibold mb-2">
          {isLoggedIn ? "Upload a File" : "Get Started"}
        </h2>
        <p className="text-gray-400 mb-8">
          Files are automatically encrypted and stored securely on the
          blockchain.
        </p>

        {/* --- REQUIREMENT 2: Conditional rendering based on login status --- */}
        {isLoggedIn ? <FileUpload /> : <UploadRedirect />}
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Why Choose SecureVault?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-blue-400" />}
              title="Military-Grade Encryption"
              description="Your files are encrypted with AES-256 before storage."
            />
            <FeatureCard
              icon={<Box className="h-8 w-8 text-blue-400" />}
              title="Blockchain Verification"
              description="File integrity is verified on a private blockchain."
            />
            <FeatureCard
              icon={<Lock className="h-8 w-8 text-blue-400" />}
              title="Decentralized Storage"
              description="Files are stored on IPFS for enhanced security."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-400" />}
              title="Fast Retrieval"
              description="Quick access to your files whenever you need them."
            />
          </div>
        </div>
      </section>
    </main>
  );
};

// Helper component for the feature cards
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-gray-800 p-6 rounded-lg text-center">
    <div className="inline-block bg-gray-700 p-3 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default Home;
