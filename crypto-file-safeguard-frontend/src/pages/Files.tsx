import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";
import CryptoJS from "crypto-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { File as FileIcon, Download, Trash2 } from "lucide-react";
import FileUpload from "@/components/upload/FileUpload";

type BackendFile = {
  fileName: string;
  fileSize: number;
  ipfsHash: string;
};

const Files = () => {
  const [userFiles, setUserFiles] = useState<BackendFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserFiles = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get<BackendFile[]>("/files/my-files");
      setUserFiles(response.data);
    } catch (err) {
      console.error("❌ Failed to fetch files:", err);
      setError("Could not retrieve your files. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserFiles();
  }, [fetchUserFiles]);

  // --- THIS IS THE UPDATED DOWNLOAD FUNCTION ---
  const handleDownload = async (file: BackendFile) => {
    try {
      // 1. Get the ENCRYPTED file blob DIRECTLY from our backend
      const response = await api.get(`/files/download/${file.ipfsHash}`, {
        responseType: "blob", // We expect file data directly
      });
      const encryptedBlob = response.data;
      const encryptedText = await encryptedBlob.text();

      // 2. Decrypt and trigger the download
      const encryptionKey = "your-super-secret-key";
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
      const decryptedDataUrl = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedDataUrl) {
        throw new Error("Decryption failed. Incorrect key or corrupted data.");
      }

      const link = document.createElement("a");
      link.href = decryptedDataUrl;
      link.download = file.fileName; // Use the original filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("❌ Download failed:", err);
      setError("Could not download the file. Please try again.");
    }
  };

  const handleDelete = async (hash: string) => {
    alert(`Delete functionality for ${hash} is not yet implemented.`);
  };

  const handleUploadComplete = () => {
    fetchUserFiles();
  };

  return (
    <div className="container mx-auto py-10 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Upload a New File
        </h1>
        <p className="text-muted-foreground mb-4">
          Files are encrypted in your browser before being sent to our servers.
        </p>
        <FileUpload onFileProcessed={handleUploadComplete} />
      </div>

      <hr className="border-gray-700" />

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Secure Files</h1>
        <p className="text-muted-foreground mb-8">
          All your securely stored files are listed below.
        </p>

        {isLoading && (
          <p className="text-center text-white">Loading your files...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userFiles.length > 0 ? (
              userFiles.map((file) => (
                <Card
                  key={file.ipfsHash}
                  className="bg-gray-800 border-gray-700 text-white shadow-lg hover:shadow-xl transition"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileIcon className="text-blue-400" />
                      <span className="truncate text-left">
                        {file.fileName}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-left">
                      <span className="font-mono text-xs truncate">
                        {file.ipfsHash}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-left">
                    <p>
                      File Size: {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(file.ipfsHash)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-gray-800/50 rounded-lg p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  You haven't uploaded any files yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
