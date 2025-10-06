import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../services/api"; // Corrected import path
import CryptoJS from "crypto-js";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FileUploadProps {
  onFileProcessed?: () => void;
}

interface ProcessedFile {
  name: string;
  size: number;
  status: "encrypting" | "uploading" | "saving" | "completed" | "error";
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<ProcessedFile | null>(null);

  const resetState = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentFile(null);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0 || isProcessing) return;

      const file = acceptedFiles[0];
      setIsProcessing(true);
      setCurrentFile({
        name: file.name,
        size: file.size,
        status: "encrypting",
      });

      try {
        // --- STEP 1: ENCRYPT FILE ---
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async (e) => {
          try {
            const fileData = e.target?.result as string;
            const encryptionKey = "your-super-secret-key";
            const encryptedData = CryptoJS.AES.encrypt(
              fileData,
              encryptionKey
            ).toString();
            setProgress(25);
            setCurrentFile((prev) =>
              prev ? { ...prev, status: "uploading" } : null
            );

            // --- STEP 2: UPLOAD TO IPFS VIA BACKEND ---
            const formData = new FormData();
            formData.append("file", new Blob([encryptedData]), file.name);

            const uploadResponse = await api.post("/files/upload", formData, {
              onUploadProgress: (event) => {
                const total = event.total || 1;
                const percent = Math.round((event.loaded * 100) / total);
                setProgress(25 + percent * 0.5); // Progress from 25% to 75%
              },
            });

            // Extract data for the next step
            const { ipfsHash, fileName, fileSize } = uploadResponse.data;
            setProgress(75);
            setCurrentFile((prev) =>
              prev ? { ...prev, status: "saving" } : null
            );

            // --- STEP 3: SAVE HASH TO BLOCKCHAIN VIA BACKEND ---
            await api.post("/files/save-hash", {
              ipfsHash,
              fileName,
              fileSize,
            });

            setProgress(100);
            setCurrentFile((prev) =>
              prev ? { ...prev, status: "completed" } : null
            );
            toast({
              title: "File Secured 🎉",
              description: `${fileName} is now stored securely.`,
            });
            onFileProcessed?.();
            setTimeout(resetState, 3000);
          } catch (error) {
            console.error("❌ Upload process failed:", error);
            setCurrentFile((prev) =>
              prev ? { ...prev, status: "error" } : null
            );
            toast({
              title: "Upload Failed",
              description: "Could not process the file. Please try again.",
              variant: "destructive",
            });
          }
        };
      } catch (error) {
        console.error("❌ File reader failed:", error);
        resetState();
      }
    },
    [isProcessing, onFileProcessed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isProcessing,
  });

  const getStatusIcon = () => {
    // ... UI helper functions remain the same
    if (!currentFile) return <Upload className="h-8 w-8 text-blue-400" />;
    switch (currentFile.status) {
      case "encrypting":
      case "uploading":
      case "saving":
        return <FileText className="h-8 w-8 text-yellow-400 animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusText = () => {
    // ... UI helper functions remain the same
    if (!currentFile) return "Drag & drop or click to upload";
    switch (currentFile.status) {
      case "encrypting":
        return `Encrypting ${currentFile.name}...`;
      case "uploading":
        return `Uploading to secure storage...`;
      case "saving":
        return `Saving to blockchain...`;
      case "completed":
        return "✅ File secured!";
      case "error":
        return "❌ Upload failed.";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700 text-white">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 transition-colors",
            isProcessing
              ? "cursor-not-allowed bg-gray-900"
              : "cursor-pointer hover:border-blue-400",
            isDragActive ? "border-blue-400 bg-gray-700" : "border-gray-600"
          )}
        >
          <input {...getInputProps()} />
          {getStatusIcon()}
          <p className="mt-4 text-lg text-center">{getStatusText()}</p>
          {isProcessing && (
            <div className="w-full mt-4">
              <Progress value={progress} className="w-full" />
              {currentFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  {currentFile.name}
                </p>
              )}
            </div>
          )}
        </div>
        {currentFile?.status === "error" && (
          <div className="text-center mt-4">
            <Button variant="outline" onClick={resetState}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
