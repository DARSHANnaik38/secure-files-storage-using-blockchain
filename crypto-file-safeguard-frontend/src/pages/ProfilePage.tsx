import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext"; // Use our global auth context
import api from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  // Get user data and the ability to update it from the global context
  const { user, setUser, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // Programmatically click the hidden file input
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
      // Send the image to the new backend endpoint
      const response = await api.post("/users/me/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newImageUrl = response.data.profilePictureUrl;

      // Update the global user state with the new image URL
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

  if (isLoading) {
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
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
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

            {/* This button has been updated */}
            <Button variant="outline" onClick={handleButtonClick}>
              Change Profile Picture
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
