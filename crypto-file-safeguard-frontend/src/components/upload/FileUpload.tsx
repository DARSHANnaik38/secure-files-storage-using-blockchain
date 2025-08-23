import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js"; // For encryption
import api from "@/services/api"; // For backend communication

// Interface definitions for props and state
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

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

          const encryptionKey = "your-super-secret-key";
          const encryptedData = CryptoJS.AES.encrypt(
            fileData,
            encryptionKey
          ).toString();
          setProgress(50);

          const formData = new FormData();
          formData.append("file", new Blob([encryptedData]), file.name);

          const response = await api.post("/files/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          setProgress(100);

          // --- THIS IS THE FIX for the TypeScript error ---
          const finalFile: ProcessedFile = {
            ...processedFile,
            status: "completed",
            hash: response.data.ipfsHash,
          };

          setCurrentFile(finalFile);
          onFileProcessed?.(finalFile);

          toast({
            title: "File uploaded successfully!",
            description: `${file.name} has been stored on IPFS.`,
          });

          setTimeout(() => {
            setCurrentFile(null);
            setProgress(0);
            setIsProcessing(false);
          }, 3000);
        };
      } catch (error) {
        console.error("Upload failed", error);
        setCurrentFile((prev) => (prev ? { ...prev, status: "error" } : null));
        setIsProcessing(false);
        toast({
          title: "Upload failed",
          description: "There was an error processing your file.",
          variant: "destructive",
        });
      }
    },
    [onFileProcessed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isProcessing,
  });

  const getStatusIcon = () => {
    if (!currentFile)
      return <Upload className="h-12 w-12 text-muted-foreground" />;

    switch (currentFile.status) {
      case "uploading": // Added this case for consistency
      case "processing":
        return <Upload className="h-12 w-12 text-primary animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <AlertCircle className="h-12 w-12 text-destructive" />;
      default:
        return <Upload className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    if (!currentFile) return "Drop your file here or click to browse";

    switch (currentFile.status) {
      case "uploading":
      case "processing":
        return "Encrypting and uploading file...";
      case "completed":
        return "File successfully stored!";
      case "error":
        return "Error processing file";
      default:
        return "Processing...";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300",
            isDragActive
              ? "border-blue-500 bg-blue-500/10 scale-105"
              : "border-gray-600 hover:border-blue-500/50 hover:bg-blue-500/5",
            isProcessing && "cursor-not-allowed opacity-75"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isProcessing ? "Processing File" : "Upload Secure File"}
              </h3>
              <p className="text-muted-foreground">{getStatusText()}</p>
            </div>

            {currentFile && (
              <div className="w-full space-y-3 pt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{currentFile.name}</span>
                  <span className="text-muted-foreground">
                    ({(currentFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                </div>

                {currentFile.status === "completed" && (
                  <div className="text-xs space-y-1 text-left bg-gray-700/50 p-3 rounded">
                    <p>
                      <strong>IPFS Hash:</strong>{" "}
                      {currentFile.hash.substring(0, 20)}...
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isProcessing && !currentFile && <Button>Choose File</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
