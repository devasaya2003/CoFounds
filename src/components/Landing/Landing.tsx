import React from "react";
import { Ubuntu } from "next/font/google";
import { cn } from "@/lib/utils";

import Hero from "./hero";

const Landing = () => {
  return (
    <div className={cn("  bg-white text-black")}>
      <Hero />
    </div>
  );
};

export default Landing;
