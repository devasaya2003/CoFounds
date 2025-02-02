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

export default function Hero() {
  return (
    <div className="landingpage flex flex-col justify-center align-middle items-center">
      <section className=" max-h-max pt-52 pb-28  w-full dark:bg-black bg-black  dark:bg-dot-[#99FD5D]/[0.2] bg-dot-[#99FD5D]/[0.2] relative flex items-center justify-center ">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10 -mt-28 md:mt-0"
        >
          {/* <MouseMoveEffect /> */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <motion.span
              initial={{ color: "white" }}
              animate={{ color: "#99FD5D" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="italic font-extralight"
            >
              Hiring
            </motion.span>{" "}
            is broken!
            <br />
            <motion.span
              initial={{ color: "white" }}
              animate={{ color: "white" }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              We are here to fix it
            </motion.span>{" "}
            <motion.span
              initial={{ color: "white" }}
              animate={{ color: "#99FD5D" }}
              transition={{ duration: 0.5, delay: 0.9 }}
            ></motion.span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Get hired fast with proof of work and community
          </p>

          <div className=" hidden ctabuttons py-4  flex-row justify-center align-middle items-center gap-5">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="font-bold w-[15rem]  px-8 py-3 rounded-full text-[#99FD5D] bg-black/20 border border-maincolor  hover:bg-opacity-90 transition-colors"
            >
              Proof of Work
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="font-bold w-[15rem]  px-8 py-3 rounded-full text-[#99FD5D] bg-black/20 border border-maincolor   hover:bg-opacity-90 transition-colors"
            >
              Proof of Community
            </motion.button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto py-4">
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              type="email"
              placeholder="e.g. johndoe@gmail.com"
              className="md:w-[40rem] w-full text-center px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#99FD5D]"
            />

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="font-bold md:w-[20rem] w-full  px-8 py-3 rounded-full bg-[#99FD5D] text-black  hover:bg-opacity-90 transition-colors"
            >
              Join Waitlist
            </motion.button>
          </div>
        </motion.div>
      </section>
      <WhyUs />
      <OurMission />
      <TechCards />
      <FAQAccordion />
    </div>
  );
}
