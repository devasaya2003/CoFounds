"use client";

import { motion } from "framer-motion";
import WhyChooseUs from "../ui/WhyChooseCoFounds";
import OurMission from "./OurMission";
import HowItWorks from "./Steps";
import TechCards from "./HowItWorks";
import FAQAccordion from "./FAQ";
import WhatElse from "./WhatElse";
import { PT_Sans } from "next/font/google";
import { Button } from "../ui/button";
import { useState, FormEvent } from "react";

const sansFont = PT_Sans({ weight: ["700"], subsets: ["latin"] });

export default function Hero() {
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
    <div className="landingpage flex flex-col justify-center align-middle items-center bg-[#F4F4F4] overflow-hidden">
      <section className="max-h-max pt-52 pb-28 w-full relative flex items-center justify-center md:mt-0 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10 -mt-28 md:mt-0"
        >
          <h1
            className={`text-4xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight ${sansFont.className}`}
          >
            <motion.span
              initial={{ color: "white" }}
              animate={{ color: "#2563EB" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="italic font-extralight"
            >
              Hiring
            </motion.span>{" "}
            is broken!
            <br />
            <motion.span
              initial={{ color: "white" }}
              animate={{ color: "black" }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              We are here to fix it
            </motion.span>{" "}
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Get hired fast with proof of work and community
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto py-1 bg-white/10 md:border border-maincolor text-black md:rounded-full md:w-[50rem] pr-2"
          >
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              type="email"
              placeholder="e.g. johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="md:w-[40rem] pl-5 md:border-none border w-full py-2 border-maincolor rounded-full bg-transparent text-start placeholder-gray-400 focus:outline-none focus:border-[#2563EB]"
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

          {message && (
            <p className="mt-4 text-center text-gray-700">{message}</p>
          )}
        </motion.div>
      </section>
      <WhyChooseUs />
      <OurMission />
      <TechCards />
      <WhatElse />
      <FAQAccordion />
    </div>
  );
}
