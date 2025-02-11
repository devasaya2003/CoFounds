import { Button } from "@/components/ui/button";
import { KanbanBoard } from "../Landing/KanbanBoard";

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
        <Button size="lg" className="mt-8 bg-white text-black font-semibold">
          Join Waitlist
        </Button>
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
