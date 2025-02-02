"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ImageWhyus from "./pixeltrue-business-meeting-1.png";

import Image from "next/image";

export interface WhyUsCard {
  id: string;
  title: string;
  description: string;
  image?: string;
  className?: string;
}

export interface WhyUsData {
  heading: {
    prefix: string;
    highlight1: string;
    middle: string;
    highlight2: string;
    conjunction: string;
    highlight3: string;
  };
  subheading: string;
  cards: WhyUsCard[];
}

export const whyUsData: WhyUsData = {
  heading: {
    prefix: "Get",
    highlight1: "hired",
    middle: "fast with",
    highlight2: "proof of work",
    conjunction: "and",
    highlight3: "community",
  },
  subheading:
    "NO bullshit resume loop Get hired for your skills not education or college Show your proof of work and community",
  cards: [
    {
      id: "resume",
      title: "No bullshit resume loop",
      description:
        "We believe if you have skills, few keywords wont be the one to define your journey.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EA7Of1FiUFW46frLJ52i7UC4rlRPD8.png",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      id: "skills",
      title: "Get hired for your skills not education or college",
      description:
        "Get Paid and appreciated for you skills not that you went to some fancy college or have a fancy degree.",
      className: "md:col-span-2",
    },
    {
      id: "proof",
      title: "Show your proof of work and community",
      description:
        "Showcase your talent to the recruiters with exceptional projects made.",
      className: "md:col-span-2",
    },
  ],
};

export default function WhyUs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <section className="relative min-h-screen max-w-7xl py-24">
      {/* Background with dots pattern */}
      <div className="absolute inset-0 bg-black bg-dot-white/[0.2]" />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Why Us Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-base rounded-full bg-[#001F0E] text-[#99FD5D] border border-[#99FD5D]/20 hover:bg-[#99FD5D]/10 transition-colors"
          >
            Our Mission
          </motion.button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {whyUsData.cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePosition({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              className={`relative overflow-hidden rounded-3xl bg-[#1A1F1A] p-8 ${card.className}`}
            >
              {/* Spotlight effect */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(153, 253, 93, 0.1), transparent 40%)`,
                }}
              />

              <div className="h-full flex flex-col justify-center align-middle items-center">
                <h3 className="md:text-4xl text-2xl font-bold mb-4 text-[#99FD5D]">
                  {card.title}
                </h3>
                {card.image && (
                  <div className="relative flex-1 my-6">
                    <Image
                      src={ImageWhyus}
                      alt={card.title}
                      width={400}
                      height={300}
                      className="rounded-lg object-cover md:size-[25rem] size-[20rem]"
                    />
                  </div>
                )}
                <p className="text-gray-300 md:text-2xl text-lg">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
