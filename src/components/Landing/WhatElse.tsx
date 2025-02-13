"use client";

import { Button } from "@/components/ui/button";
import { KanbanBoard } from "../Landing/KanbanBoard";
import { motion } from "framer-motion";
import { useState, FormEvent } from "react";

export default function WhatElse() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsDisabled(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsDisabled(false);
      return;
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsDisabled(false);
      } else {
        setMessage(data.error);
        setIsDisabled(false);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsDisabled(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col-reverse justify-center align-middle items-center">
      <section className="container px-4 py-24 mx-auto text-center bg-black border border-maincolor rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Not Just Another{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Hiring Platform
          </span>
        </h1>
        <p className="max-w-[600px] mx-auto mt-4 text-gray-400 md:text-xl">
          CoFounds is a full-fledged job management platform. Track your
          applications, manage interviews, and land your dream job.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto py-1 bg-white/10 md:border border-maincolor text-black md:rounded-full md:w-[50rem] pr-2 mt-5"
        >
          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            type="email"
            placeholder="e.g. johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="md:w-[40rem] text-white pl-5 md:border-none border w-full py-2 border-maincolor rounded-full bg-transparent text-start placeholder-gray-400 focus:outline-none focus:border-[#2563EB]"
            required
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="w-full"
          >
            <Button
              disabled={isDisabled}
              type="submit"
              className={`w-full md:rounded-full ${
                isDisabled
                  ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isDisabled ? "Processing..." : "Join WaitList"}
            </Button>
          </motion.div>
        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-gray-400">{message}</p>}
      </section>

      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          Manage Your Jobs with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Kanban Board
          </span>
        </h2>
        <KanbanBoard />
      </section>
    </div>
  );
}
