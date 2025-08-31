import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext"; // Your existing auth context
import { useContract } from "@/context/ContractContext"; // Our new contract context
import api from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, File as FileIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define a TypeScript type for the file data we get from the smart contract
type BlockchainFile = {
  fileName: string;
  fileSize: bigint;
  fileHash: string;
};

const ProfilePage = () => {
  // --- EXISTING AUTH LOGIC ---
  const { user, setUser, isLoading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- NEW BLOCKCHAIN LOGIC ---
  const { contract, connectWallet, isConnected } = useContract();
  const [userFiles, setUserFiles] = useState<BlockchainFile[]>([]);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState("");

  // Effect to fetch files from the blockchain when the wallet is connected
  useEffect(() => {
    const fetchBlockchainFiles = async () => {
      // Only run if the contract exists and the wallet is connected
      if (contract && isConnected) {
        setIsFilesLoading(true);
        setFilesError("");
        try {
          const filesFromChain = await contract.getFiles();
          setUserFiles(filesFromChain);
        } catch (err) {
          console.error("Failed to fetch blockchain files:", err);
          setFilesError("Could not retrieve your files. Please try again.");
        } finally {
          setIsFilesLoading(false);
        }
      }
    };

    fetchBlockchainFiles();
  }, [contract, isConnected]); // This hook depends on `isConnected` now

  // --- EXISTING PROFILE PICTURE LOGIC ---
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/users/me/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImageUrl = response.data.profilePictureUrl;
      if (user) {
        setUser({ ...user, profilePictureUrl: newImageUrl });
      }
      toast({ title: "Success", description: "Profile picture updated!" });
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture.",
        variant: "destructive",
      });
    }
  };

  // --- RENDER LOGIC ---
  if (isAuthLoading) {
    return (
      <div className="text-center text-white p-10">Loading profile...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 p-10">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 text-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card 1: User Profile */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">My Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.profilePictureUrl || undefined}
                  alt={user.name}
                />
                <AvatarFallback>
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="w-full text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-muted-foreground">Phone Number:</span>
                  <span>{user.phoneNumber || "Not provided"}</span>
                </div>
              </div>
              <Button variant="outline" onClick={handleButtonClick}>
                Change Profile Picture
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Blockchain Files */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              My Blockchain Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="text-center">
                <p className="mb-4">
                  Connect your wallet to view your secure files.
                </p>
                <Button onClick={connectWallet}>Connect Wallet</Button>
              </div>
            ) : (
              <>
                {isFilesLoading && <p>Loading files from blockchain...</p>}
                {filesError && <p className="text-red-500">{filesError}</p>}
                {!isFilesLoading && !filesError && (
                  <ul className="space-y-3">
                    {userFiles.length > 0 ? (
                      userFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center p-2 bg-gray-700 rounded-md"
                        >
                          <FileIcon className="h-5 w-5 mr-3 text-blue-400" />
                          <div className="flex-grow">
                            <p className="font-semibold">{file.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              Size: {file.fileSize.toString()} bytes
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">
                        No files found on the blockchain.
                      </p>
                    )}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
