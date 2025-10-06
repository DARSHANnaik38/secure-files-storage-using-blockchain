import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, File as FileIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, updateUserData, isLoading: isAuthLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileCount, setFileCount] = useState<number | null>(null);
  const [isFilesLoading, setIsFilesLoading] = useState(false);

  useEffect(() => {
    const fetchFileCount = async () => {
      if (user) {
        setIsFilesLoading(true);
        try {
          const response = await api.get("/files/count");
          setFileCount(response.data.count);
        } catch (err) {
          console.error("Failed to fetch file count:", err);
          setFileCount(0);
        } finally {
          setIsFilesLoading(false);
        }
      }
    };
    fetchFileCount();
  }, [user]);

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
      updateUserData({ profilePictureUrl: newImageUrl });
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

  if (isAuthLoading) {
    return (
      <div className="text-center text-white p-10">Loading profile...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 p-10">
        User not found. Please log in.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 text-white">
      {/* Hidden file input for profile picture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* User Details Card */}
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
              <Button variant="outline" onClick={handleButtonClick}>
                Change Profile Picture
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File Summary Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              File Storage Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
            <FileIcon className="h-16 w-16 text-blue-400" />
            {isFilesLoading ? (
              <p>Loading file stats...</p>
            ) : (
              <div className="text-center">
                <p className="text-4xl font-bold">{fileCount ?? "N/A"}</p>
                <p className="text-muted-foreground">Secure Files Stored</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
