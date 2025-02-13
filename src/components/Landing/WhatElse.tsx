"use client";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "../Landing/KanbanBoard";
import { motion } from "framer-motion";

export default function WhatElse() {
  return (
    <div className="min-h-screen  text-white flex flex-col-reverse justify-center align-middle items-center">
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto py-1   bg-white/10 md:border border-maincolor text-black md:rounded-full md:w-[50rem] pr-2 mt-5 ">
          <motion.input
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            type="email"
            placeholder="e.g. johndoe@gmail.com"
            className="md:w-[40rem] text-white  pl-5 md:border-none border w-full py-2 border-maincolor rounded-full bg-transparent text-start placeholder-gray-400 focus:outline-none focus:border-[#2563EB]"
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
