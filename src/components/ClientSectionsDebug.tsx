"use client";

import React, { useState, useEffect } from 'react';
import { jobs } from "@/data/jobs";
import { testimonials } from "@/data/testimonials";
import { stories } from "@/data/stories";

export default function ClientSectionsDebug() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    console.log("ClientSectionsDebug mounted");
  }, []);

  return (
    <div className="p-10 bg-gray-100 my-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Debug Information</h2>
      
      <div className="mb-4">
        <div className="font-semibold">Rendering Environment:</div>
        <div>{isClient ? 'Client-side rendered' : 'Server-side rendered'}</div>
      </div>
      
      <div className="mb-4">
        <div className="font-semibold">Data Available:</div>
        <div>Jobs: {jobs?.length || 0}</div>
        <div>Testimonials: {testimonials?.length || 0}</div>
        <div>Stories: {stories?.length || 0}</div>
      </div>
      
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => alert('Client interaction works!')}
      >
        Test Client Interaction
      </button>
    </div>
  );
}