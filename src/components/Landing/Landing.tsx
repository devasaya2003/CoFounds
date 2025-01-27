import React from "react";
import { Ubuntu } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Briefcase, Star, User2 } from "lucide-react";

const UbuntuFont = Ubuntu({
  weight: ["500"],
  subsets: ["latin"],
});

const Landing = () => {
  return (
    <div
      className={cn(
        "  bg-black text-white w-full  md:px-20 px-5  lg:min-h-screen flex justify-center align-middle items-center   ",
        UbuntuFont.className
      )}
    >
      <div
        className={cn(
          "  dark  text-white font-exconmedium   flex flex-col justify-center relative  items-center  lg:py-32 gap-8 py-10  "
        )}
      >
        <div className="heading md:text-6xl lg:text-9xl text-5xl max-w-7xl text-center ">
          Where
          <span className={cn("text-blue-600  font-exconmedium")}>
            {" "}
            Founders{" "}
          </span>
          meet Founding level Talent
        </div>
        <div className="subheading max-w-3xl text-center ">
          <span className={cn("text-center md:text-3xl text-xl")}>
            <span className={cn("text-blue-600 ")}> CoFounds </span>
            connects you with top opportunities, personalized to your skills and
            career goals.
          </span>
        </div>
        <div className="CTA_buttons flex justify-center align-middle items-center gap-3 md:flex-row flex-col w-full ">
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
    </div>
  );
};

export default Landing;
