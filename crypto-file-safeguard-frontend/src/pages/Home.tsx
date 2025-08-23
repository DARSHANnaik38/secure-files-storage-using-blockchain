import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import FileUpload from "@/components/upload/FileUpload";
import { Upload, ShieldCheck, Box, Zap, Lock } from "lucide-react";
import React from "react";

// This is a new "dummy" component for logged-out users
const UploadRedirect = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/register")}
      className="max-w-2xl mx-auto border-2 border-dashed border-gray-600 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-800 transition-colors"
    >
      <Upload className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold">Upload Secure File</h3>
      <p className="text-muted-foreground">
        Drop your file here or click to browse
      </p>
      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Choose File
      </button>
    </div>
  );
};

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    // The bg-gray-900 class has been removed to make the background transparent
    <main className="text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center pt-32 pb-16">
        <h1 className="text-5xl font-bold mb-4">Secure File Storage</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Store your files with military-grade encryption and blockchain
          security. Your data, protected by the future of technology.
        </p>
      </section>

      {/* Upload Section - Now with conditional logic */}
      <section className="text-center px-4">
        <h2 className="text-3xl font-semibold mb-2">Upload Your Files</h2>
        <p className="text-gray-400 mb-8">
          Files are automatically encrypted, chunked, and stored securely
        </p>

        {/* This is the key change: */}
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
              description="Your files are encrypted with AES-256 before storage"
            />
            <FeatureCard
              icon={<Box className="h-8 w-8 text-blue-400" />}
              title="Blockchain Storage"
              description="File hashes stored immutably on the blockchain"
            />
            <FeatureCard
              icon={<Lock className="h-8 w-8 text-blue-400" />}
              title="Secure Chunking"
              description="Files split into encrypted chunks for enhanced security"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-400" />}
              title="Fast Retrieval"
              description="Quick access to your files when you need them"
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
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default Home;
