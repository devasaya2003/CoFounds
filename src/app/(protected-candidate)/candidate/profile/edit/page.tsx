"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { getUserProfile } from "./api";
import { UserProfile } from "./api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import TabHandler from "./components/TabHandler"; 
import { useAppSelector } from "@/redux/hooks";

export default function EditProfilePage() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  
  const defaultTab = "personal-info";

  // Extract fetch profile logic to a reusable function
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const username = "dev123";
      const data = await getUserProfile(username);
      setProfileData(data);
      return data;
    } catch (err) {
      setError("Failed to load profile data");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading && !profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile data...</span>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error || "Failed to load profile data"}</p>
      </div>
    );
  }
  
  const renderJsonData = (data: unknown) => {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 overflow-auto max-h-[500px]">
        <pre className="text-sm">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Your Profile</h1>

      <Card>
        <CardContent className="p-6">
          <Suspense fallback={<div>Loading tabs...</div>}>
            <TabHandler 
              defaultTab={defaultTab} 
              renderJsonData={renderJsonData} 
              profileData={profileData}
              refetchProfile={fetchProfile} 
              isRefetching={loading && !!profileData}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}