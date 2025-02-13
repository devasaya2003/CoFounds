"use client";
import { BentoGrid, BentoGridItem } from "@/components/ui/Bento-grid";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  IconBriefcase,
  IconUsers,
  IconChartBar,
  IconBuildingSkyscraper,
  IconRocket,
  IconAward,
} from "@tabler/icons-react";
import NetworkingImage from "./pixeltrue-business-meeting-1.png";
import SuccessImage from "./afif-ramdhasuma-jl4BQJs87Do-unsplash.jpg";

const TalentPoolAnimation = () => {
  const avatars = [
    "/avatar1.png",
    "/avatar2.png",
    "/avatar3.png",
    "/avatar4.png",
    "/avatar5.png",
    "/avatar6.png",
  ];

  return (
    <motion.div
      className="flex flex-wrap justify-center items-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {avatars.map((avatar, i) => (
        <motion.div
          key={i}
          className="relative m-1"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Image
            src={avatar || "/placeholder.svg"}
            alt={`Talent ${i + 1}`}
            width={60}
            height={60}
            className="rounded-full border-2 border-primary"
          />
          <motion.div
            className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 + 0.2 }}
          >
            {["💻", "📊", "🎨", "📱", "🔬", "📈"][i]}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SmartMatchingAnimation = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-col space-y-4 h-full justify-center"
    >
      <motion.div
        variants={variants}
        className="flex items-center space-x-2 bg-white dark:bg-black p-2 rounded-full"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500" />
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-grow" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex items-center space-x-2 bg-white dark:bg-black p-2 rounded-full"
      >
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full flex-grow" />
        <div className="w-8 h-8 rounded-full bg-purple-500" />
      </motion.div>
    </motion.div>
  );
};

const InsightsAnimation = () => {
  return (
    <motion.div
      className="flex justify-center items-end h-full space-x-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[40, 70, 50, 90, 60].map((height, i) => (
        <motion.div
          key={i}
          className="w-8 bg-blue-600 rounded-t-lg"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        />
      ))}
    </motion.div>
  );
};

const NetworkingAnimation = () => {
  return (
    <motion.div
      className="relative h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={NetworkingImage}
        alt="Networking event"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-purple-500/50 rounded-lg" />
    </motion.div>
  );
};

const StartupEcosystemAnimation = () => {
  const iconVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
  };

  return (
    <motion.div
      className="grid grid-cols-3 gap-4 h-full p-4"
      initial="initial"
      animate="animate"
    >
      {["💡", "🚀", "💻", "📊", "🤝", "🌟"].map((icon, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg text-3xl"
          variants={iconVariants}
          transition={{ delay: i * 0.1 }}
        >
          {icon}
        </motion.div>
      ))}
    </motion.div>
  );
};

const SuccessStoriesAnimation = () => {
  return (
    <motion.div
      className="relative h-full overflow-hidden rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={SuccessImage}
        alt="Success story"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/70 to-orange-500/70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-white text-4xl font-bold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Success!
        </motion.div>
      </div>
    </motion.div>
  );
};

const items = [
  {
    title: "Smart Matching",
    description:
      "Our AI-powered algorithm ensures perfect matches between candidates and job openings.",
    header: <SmartMatchingAnimation />,
    className: "md:col-span-2",
    icon: <IconBriefcase className="h-4 w-4 text-purple-500" />,
  },
  {
    title: "Industry Insights",
    description:
      "Stay informed with the latest trends and data in your industry.",
    header: <InsightsAnimation />,
    className: "md:col-span-1",
    icon: <IconChartBar className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Networking Opportunities",
    description:
      "Connect with like-minded professionals and expand your network.",
    header: <NetworkingAnimation />,
    className: "md:col-span-1",
    icon: <IconBuildingSkyscraper className="h-4 w-4 text-red-500" />,
  },
  {
    title: "Startup Ecosystem",
    description:
      "Immerse yourself in a thriving community of innovators and entrepreneurs.",
    header: <StartupEcosystemAnimation />,
    className: "md:col-span-1",
    icon: <IconRocket className="h-4 w-4 text-orange-500" />,
  },
  {
    title: "Success Stories",
    description:
      "Join countless professionals who have found their dream roles or ideal candidates through CoFounds.",
    header: <SuccessStoriesAnimation />,
    className: "md:col-span-1",
    icon: <IconAward className="h-4 w-4 text-yellow-500" />,
  },
];

export default function CoFoundsBentoGrid() {
  return (
    <div className="flex flex-col relative justify-center align-middle items-center gap-10 md:p-2 p-5">
      <div className="absolute w-screen h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent  -top-5" />
      <div className="absolute w-screen h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent  -bottom-10" />
      <div className="absolute w-[1px] h-[60rem] bg-gradient-to-t from-transparent via-gray-400 to-transparent  -left-20" />
      <div className="absolute  h-[60rem] w-[1px] bg-gradient-to-t from-transparent via-gray-400 to-transparent  -right-20" />
      <button className="px-6 py-2 text-base rounded-full  text-[#2563EB] border border-[#2563EB]/20 hover:bg-[#2563EB]/10 transition-colors">
        Why Us?
      </button>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
