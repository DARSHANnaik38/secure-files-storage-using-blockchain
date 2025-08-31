import { useEffect, useState } from "react";
import { useContract } from "@/context/ContractContext"; // Import our contract hook
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

// Define a TypeScript type for our file data
type BlockchainFile = {
  fileName: string;
  fileSize: bigint;
  fileHash: string;
};

const FilesPage = () => {
  // Use our hook to get the contract and connection status
  const { contract, isConnected, connectWallet } = useContract();
  const [userFiles, setUserFiles] = useState<BlockchainFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // This `useEffect` hook will run when the wallet connection status changes
  useEffect(() => {
    const fetchBlockchainFiles = async () => {
      // Only fetch if the contract is ready and the wallet is connected
      if (contract && isConnected) {
        setIsLoading(true);
        setError("");
        try {
          // This is the call to your smart contract's `getFiles` function
          const filesFromChain = await contract.getFiles();
          setUserFiles(filesFromChain);
        } catch (err) {
          console.error("Failed to fetch files:", err);
          setError(
            "Could not retrieve your files. Please try reconnecting your wallet."
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlockchainFiles();
  }, [contract, isConnected]); // It re-runs when the contract or isConnected state changes

  // --- Render Logic ---

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white">
        <h2 className="text-2xl font-semibold mb-4">
          Connect to View Your Files
        </h2>
        <p className="mb-6 text-muted-foreground">
          Please connect your wallet to access your secure files on the
          blockchain.
        </p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-white mb-2">My Secure Files</h1>
      <p className="text-muted-foreground mb-8">
        All your files are encrypted and stored securely on the blockchain.
      </p>

      {isLoading && (
        <p className="text-center text-white">
          Loading your files from the blockchain...
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userFiles.length > 0 ? (
            userFiles.map((file, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 text-white"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileIcon className="text-blue-400" />
                    <span className="truncate">{file.fileName}</span>
                  </CardTitle>
                  <CardDescription>
                    IPFS Hash:{" "}
                    <span className="font-mono text-xs truncate">
                      {file.fileHash}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    File Size:{" "}
                    {(Number(file.fileSize) / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              You haven't uploaded any files to the blockchain yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FilesPage;
