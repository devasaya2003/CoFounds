import React from "react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "../ui/TextGenerationEffect";

const missiontext = `Proof of Work and Community will together tell your professional story more effectively than traditional resumes. This helps both candidates showcase their true abilities and companies find the right talent more efficiently.`;
const OurMission = () => {
  return (
    <div className="text-white max-w-5xl text-center text-2xl md:text-3xl lg:text-4xl min-h-[40rem] flex flex-col justify-center align-middle items-center px-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center mb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 text-base rounded-full  text-[#2563EB] border border-[#2563EB]/20 hover:bg-[#2563EB]/10 transition-colors"
        >
          Our Mission
        </motion.button>
      </motion.div>

      <TextGenerateEffect words={missiontext} />
    </div>
  );
};

export default OurMission;
