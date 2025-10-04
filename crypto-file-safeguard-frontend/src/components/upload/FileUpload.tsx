import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js";
import api from "@/services/api";

// Blockchain context
import { useContract } from "@/context/ContractContext";

// Types
interface FileUploadProps {
  onFileProcessed?: (file: ProcessedFile) => void;
}

interface ProcessedFile {
  id: string;
  name: string;
  size: number;
  hash: string;
  chunks: number;
  uploadDate: Date;
  status: "uploading" | "processing" | "completed" | "error";
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<ProcessedFile | null>(null);

  const { contract, isConnected, connectWallet } = useContract();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Require wallet connection
      if (!isConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet before uploading a file.",
          variant: "destructive",
        });
        connectWallet();
        return;
      }

      const file = acceptedFiles[0];
      setIsProcessing(true);
      setProgress(0);

      const processedFile: ProcessedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        hash: "",
        chunks: 0,
        uploadDate: new Date(),
        status: "processing",
      };
      setCurrentFile(processedFile);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async (e) => {
          const fileData = e.target?.result as string;

          // Encrypt file
          const encryptionKey = "your-super-secret-key"; // 🔑 Replace with dynamic key later
          const encryptedData = CryptoJS.AES.encrypt(
            fileData,
            encryptionKey
          ).toString();
          setProgress(25);

          // Upload encrypted file to backend → Pinata
          const formData = new FormData();
          formData.append("file", new Blob([encryptedData]), file.name);

          const response = await api.post("/files/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const ipfsHash = response.data.ipfsHash;
          setProgress(60);

          // Store metadata on blockchain
          if (contract) {
            try {
              toast({
                title: "Confirm Transaction",
                description: "Please approve the blockchain transaction.",
              });

              const tx = await contract.addFile(ipfsHash, file.size, file.name);
              await tx.wait();

              setProgress(100);

              const finalFile: ProcessedFile = {
                ...processedFile,
                status: "completed",
                hash: ipfsHash,
              };
              setCurrentFile(finalFile);
              onFileProcessed?.(finalFile);

              toast({
                title: "File Secured 🎉",
                description: `${file.name} stored on IPFS & blockchain.`,
              });
            } catch (blockchainError) {
              console.error(
                "❌ Blockchain transaction failed:",
                blockchainError
              );
              throw new Error("Transaction rejected or blockchain error.");
            }
          }

          // Reset after completion
          setTimeout(() => {
            setCurrentFile(null);
            setProgress(0);
            setIsProcessing(false);
          }, 4000);
        };
      } catch (error) {
        console.error("❌ Upload failed:", error);
        setCurrentFile((prev) => (prev ? { ...prev, status: "error" } : null));
        setIsProcessing(false);
        toast({
          title: "Upload Failed",
          description: "Error occurred while processing your file.",
          variant: "destructive",
        });
      }
    },
    [onFileProcessed, contract, isConnected, connectWallet]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isProcessing,
  });

  // Status UI helpers
  const getStatusIcon = () => {
    if (!currentFile) return <Upload className="h-8 w-8 text-blue-400" />;
    switch (currentFile.status) {
      case "processing":
      case "uploading":
        return <FileText className="h-8 w-8 text-yellow-400 animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Upload className="h-8 w-8 text-blue-400" />;
    }
  };

  const getStatusText = () => {
    if (!currentFile) return "Drag & drop or click to upload";
    switch (currentFile.status) {
      case "processing":
        return "Encrypting & uploading...";
      case "uploading":
        return "Uploading to IPFS...";
      case "completed":
        return "✅ File secured on blockchain!";
      case "error":
        return "❌ Upload failed.";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700 text-white">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer transition",
            isDragActive
              ? "border-blue-400 bg-gray-700"
              : "border-gray-600 hover:border-blue-400"
          )}
        >
          <input {...getInputProps()} />
          {getStatusIcon()}
          <p className="mt-4 text-lg">{getStatusText()}</p>
          {isProcessing && (
            <Progress value={progress} className="mt-4 w-full" />
          )}
          {currentFile && (
            <p className="mt-2 text-sm text-muted-foreground">
              {currentFile.name} (
              {(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Reset button */}
        {currentFile && currentFile.status === "error" && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentFile(null);
                setProgress(0);
                setIsProcessing(false);
              }}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
