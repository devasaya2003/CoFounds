import Landing from "@/components/Landing/Landing";
import HowItWorks from "@/components/Landing/Steps";
import SuccessStories from "@/components/Landing/Testimonial";
import RotatingCards from "@/components/ui/WhyChooseCoFounds";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Landing />
      {/* <RotatingCards />
      <SuccessStories />
      <HowItWorks /> */}
    </div>
  );
}
