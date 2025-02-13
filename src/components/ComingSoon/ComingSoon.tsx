"use client";
import { motion } from "framer-motion";

export default function ComingSoon() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F4F4F4]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Coming Soon
        </h1>
        <p className="text-xl text-gray-600">
        We&apos;re working hard to bring you something amazing!
        </p>
      </motion.div>
    </div>
  );
}