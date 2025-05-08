"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "../api";

interface TabHandlerProps {
    defaultTab: string;
    renderJsonData: (data: unknown) => React.ReactElement;
    profileData: UserProfile;
}

export default function TabHandler({ defaultTab, renderJsonData, profileData }: TabHandlerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabParam = searchParams?.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || defaultTab);

    useEffect(() => {
        if (pathname === "/candidate/profile/edit" && !tabParam) {
            router.push(`/candidate/profile/edit?tab=${defaultTab}`);
        }
    }, [pathname, router, tabParam, defaultTab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`/candidate/profile/edit?tab=${value}`);
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-6 w-full mb-8">
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Personal Information Data</h2>
                    <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
                    {renderJsonData({
                        id: profileData.id,
                        firstName: profileData.firstName,
                        lastName: profileData.lastName,
                        email: profileData.email,
                        userName: profileData.userName,
                        dob: profileData.dob,
                        phone: profileData.phone,
                        description: profileData.description,
                        profileImage: profileData.profileImage
                    })}
                </div>
            </TabsContent>

            <TabsContent value="skills">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Skills Data</h2>
                    <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
                    {renderJsonData(profileData.skillset)}
                </div>
            </TabsContent>

            <TabsContent value="education">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Education Data</h2>
                    <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
                    {renderJsonData(profileData.education)}
                </div>
            </TabsContent>

            <TabsContent value="projects">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Projects Data</h2>
                    <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
                    {renderJsonData(profileData.projects)}
                </div>
            </TabsContent>

            <TabsContent value="certificates">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Certificates Data</h2>
                    <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
                    {renderJsonData(profileData.certificates)}
                </div>
            </TabsContent>

            <TabsContent value="experience">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Experience Data</h2>
                    <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
                    {renderJsonData(profileData.experience)}
                </div>
            </TabsContent>
        </Tabs>
    );
}