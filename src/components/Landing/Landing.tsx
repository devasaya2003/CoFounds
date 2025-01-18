import React from "react";
import { Ubuntu, Jersey_15 } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

import ArrowPng from "../../assets/LandingPageAssets/kwjfbk-removebg-preview.png";
import Image from "next/image";
import { Briefcase, Star, User2 } from "lucide-react";
import { Reviews } from "./InfiniteCarousel";

const UbuntuFont = Ubuntu({ weight: ["500"] });
const JerseyFont = Jersey_15({ weight: ["400"] });

const Landing = () => {
  return (
    <div
      className={cn(
        "  bg-black text-white grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 md:px-20 px-5  lg:max-h-screen   ",
        UbuntuFont.className
      )}
    >
      <div
        className={cn(
          "  dark bg-black text-white   flex flex-col justify-start relative  items-start  lg:py-32 gap-8 py-10  ",
          UbuntuFont.className
        )}
      >
        <div className="md:absolute hidden -right-[7rem] bottom-32">
          <Image
            src={ArrowPng}
            alt="joboffersvgimage"
            width={400}
            height={400}
          />
        </div>

        <div className="heading md:text-6xl lg:text-8xl text-5xl max-w-3xl text-start ">
          Your
          <span
            className={cn(
              "text-blue-600 lg:text-9xl md:text-8xl text-7xl",
              JerseyFont.className
            )}
          >
            {" "}
            Dream Job{" "}
          </span>
          is Just a Click Away
        </div>
        <div className="subheading max-w-3xl text-start">
          <span className={cn("text-center md:text-3xl text-xl")}>
            <span className={cn("text-blue-600 ")}> CoFounds </span>
            connects you with top opportunities, personalized to your skills and
            career goals.
          </span>
        </div>
        <div className="CTA_buttons flex justify-start align-middle items-start gap-3 md:flex-row flex-col w-full ">
          <Button className="bg-blue-700 w-full text-white rounded-lg text-lg py-5 px-2 md:w-48 hover:bg-blue-700">
            Signup For Free
          </Button>
          <Button className="bg-blue-700 text-white rounded-lg text-lg py-5 px-2 md:w-48 w-full hover:bg-blue-700">
            Explore Jobs Now
          </Button>
        </div>
        <div className="stats flex md:flex-row flex-col justify-start align-middle items-start gap-5 text-lg">
          <div className="flex justify-center align-middle items-center gap-2">
            <Star color="#FFB200" className=" outline-none border-none" />
            4.5 Ratings
          </div>
          <div className="flex justify-center align-middle items-center gap-2">
            <User2 color="#06D001" className=" outline-none border-none" />
            10K+ Users
          </div>
          <div className="flex justify-center align-middle items-center gap-2">
            <Briefcase color="#067aff" className="outline-none border-none" />
            7.5K+ Jobs Offered
          </div>
        </div>
      </div>
      <Reviews />
    </div>
  );
};

export default Landing;
