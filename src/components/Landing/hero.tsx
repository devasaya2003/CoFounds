"use client";

import { motion } from "framer-motion";
import { div } from "motion/react-client";
import WhyChooseUs from "../ui/WhyChooseCoFounds";
import WhyUs from "../ui/WhyChooseCoFounds";
import OurMission from "./OurMission";
import HowItWorks from "./Steps";
import TechCards from "./HowItWorks";
import { MouseMoveEffect } from "../ui/MouseMovement";
import FAQAccordion from "./FAQ";
import WhatElse from "./WhatElse";
import { PT_Sans } from "next/font/google";
import { Button } from "../ui/button";

const sansFont = PT_Sans({ weight: ["700"], subsets: ["latin"] });

export default function Hero() {
  return (
    <div className="landingpage flex flex-col justify-center align-middle items-center bg-[#F4F4F4] overflow-hidden">
      {/* <MouseMoveEffect /> */}
      <section className=" max-h-max pt-52 pb-28  w-full    relative flex items-center justify-center md:mt-0 mt-20 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10 -mt-28 md:mt-0"
        >
          {/* <MouseMoveEffect /> */}
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
            <motion.span
              initial={{ color: "white" }}
              animate={{ color: "#2563EB" }}
              transition={{ duration: 0.5, delay: 0.9 }}
            ></motion.span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Get hired fast with proof of work and community
          </p>

          <div className=" hidden ctabuttons py-4  flex-row justify-center align-middle items-center gap-5 borfer border-maincolor">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="font-bold w-[15rem]  px-8 py-3 rounded-full text-[#2563EB] bg-black/20 border border-maincolor  hover:bg-opacity-90 transition-colors"
            >
              Proof of Work
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="font-bold w-[15rem]  px-8 py-3 rounded-full text-[#2563EB] bg-black/20 border border-maincolor   hover:bg-opacity-90 transition-colors"
            >
              Proof of Community
            </motion.button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto py-1   bg-white/10 md:border border-maincolor text-white md:rounded-full md:w-[50rem] pr-2 ">
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              type="email"
              placeholder="e.g. johndoe@gmail.com"
              className="md:w-[40rem]  pl-5 md:border-none border w-full py-2 border-maincolor rounded-full bg-transparent text-start placeholder-gray-400 focus:outline-none focus:border-[#2563EB]"
            />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="w-full"
            >
              <Button className="w-full md:rounded-full">Join WaitList</Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <WhyUs />
      <OurMission />
      <TechCards />
      <WhatElse />
      <FAQAccordion />
    </div>
  );
}
