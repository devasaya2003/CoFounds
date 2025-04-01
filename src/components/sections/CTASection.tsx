"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import React from 'react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-display font-bold mb-6">Ready to Transform Your Career?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-10">
          Join our exclusive community today and connect with employers who value demonstrated skills over traditional resumes.
        </p>
        <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90">
          <MessageSquare className="h-5 w-5 mr-2" />
          Join Our WhatsApp Community
        </Button>
      </div>
    </section>
  );
}