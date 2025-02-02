"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Network, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const Particle = ({ className }: { className?: string }) => (
  <div
    className={`absolute rounded-full bg-[#99FD5D]/20 backdrop-blur-sm ${className}`}
    style={{
      width: Math.random() * 6 + 2 + "px",
      height: Math.random() * 6 + 2 + "px",
    }}
  />
);

export default function TechCards() {
  const [particles, setParticles] = useState<
    Array<{ id: number; style: { top: string; left: string } }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      },
    }));
    setParticles(newParticles);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-h-max bg-black p-6 md:p-12 relative overflow-hidden">
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={particle.style}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        ></motion.div>
      ))}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full bg-[#001F0E] text-[#99FD5D] border border-[#99FD5D]/20 hover:bg-[#99FD5D]/10 transition-colors"
        >
          How It Works?
        </motion.button>
      </motion.div>

      {/* Cards Container */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Application Submission",
            icon: <Terminal className="size-6" />,
            points: [
              "Get visible with your proof of work",
              "Get interviews based on what you build for masses",
              "Showcase your technical expertise",
              "Submit detailed project documentation",
              "Highlight your achievements",
            ],
          },
          {
            title: "Shortlisting and Management",
            icon: <Settings className="size-6" />,
            points: [
              "AI-powered application screening",
              "Real-time status tracking",
              "Automated skill assessment",
              "Interview scheduling system",
              "Feedback management",
            ],
          },
          {
            title: "Technical Evaluation",
            icon: <Cpu className="size-6" />,
            points: [
              "Code review process",
              "System design evaluation",
              "Performance analysis",
              "Security assessment",
              "Scalability testing",
            ],
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-lg p-6 bg-black border border-[#99FD5D]/10 shadow-[0_0_15px_rgba(153,253,93,0.1)] backdrop-blur-sm h-full"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#99FD5D]/0 via-[#99FD5D]/5 to-[#99FD5D]/0 rounded-lg blur-xl" />

            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#99FD5D]/10 text-[#99FD5D]">
                  {card.icon}
                </div>
                <h2 className="text-[#99FD5D] text-xl font-medium">
                  {card.title}
                </h2>
              </div>
              <ul className="space-y-4">
                {card.points.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + i * 0.1 }}
                    className="flex items-center gap-3 text-white text-[15px]"
                  >
                    <Network className="size-4 shrink-0" />
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
