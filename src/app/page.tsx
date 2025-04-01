import React from 'react';
import Navbar from "@/components/Navbar";
import ClientSections from "@/components/ClientSections";

export default function Page() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <ClientSections />
    </div>
  );
}
