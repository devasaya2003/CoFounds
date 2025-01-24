"use client";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import React from "react";
import WhyChooseImage1 from "../../../public/assets/WhyChoose/pixeltrue-seo-1.png";
import WhyChooseImage2 from "../../../public/assets/WhyChoose/pixeltrue-plan-1.png";
import WhyChooseImage3 from "../../../public/assets/WhyChoose/pixeltrue-data-analysis.png";
import WhyChooseImage4 from "../../../public/assets/WhyChoose/pixeltrue-business-meeting-1.png";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import { Card } from "@/components/ui/card";
import { useWindowSize } from "@/hooks/useWindowSize";

interface CardData {
  title: string;
  description: string;
  image: StaticImageData;
  bgColor: string;
  rotate: number; // Rotation in degrees
  position: {
    x: number; // Horizontal translation in pixels
    y: number; // Vertical translation in pixels
  };
}

const containerVariants: Variants = {
  offscreen: {},
  onscreen: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  offscreen: {
    y: 300,
    opacity: 0,
  },
  onscreen: {
    y: 50,
    rotate: -1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export default function RotatingCards() {
  const { width } = useWindowSize();

  const getPosition = (baseX: number, baseY: number) => {
    if (width && width < 640) {
      return { x: baseX * -0.1, y: baseY * -0.5 }; // Adjust for small screens
    }
    return { x: baseX, y: baseY };
  };

  return (
    <motion.div
      className="w-full bg-black p-4 sm:p-8"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.5, once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[#FCF6EA] text-center md:text-6xl lg:text-7xl text-5xl font-bold mb-8 sm:mb-16 flex flex-col md:flex-row justify-center items-center gap-4 z-50">
          <span>Your Career</span>
          <span>Simplified</span>
        </h1>

        <motion.div
          className="relative w-full flex flex-col sm:flex-row justify-center items-center sm:items-start gap-6 sm:gap-4 md:px-10 px-10"
          variants={containerVariants}
        >
          {cards.map((card, index) => {
            const position = getPosition(card.position.x, card.position.y);
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="w-full md:w-1/4 max-w-xs sm:max-w-sm"
              >
                <Card
                  className={cn(
                    "md:w-full w-[17rem] md:h-[27rem] p-4 sm:p-6 rounded-3xl transition-all duration-300 hover:z-10 hover:scale-105"
                  )}
                  style={{
                    backgroundColor: card.bgColor,
                    color: card.bgColor === "#162D67" ? "white" : "#162D67",
                    zIndex: index === 2 ? "999" : `${index}`,
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${card.rotate}deg)`,
                  }}
                >
                  <div className="aspect-video relative mb-4">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      width={500}
                      height={500}
                      className="object-cover h-52"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    {card.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

const cards: CardData[] = [
  {
    title: "More Reliability",
    description:
      "Enjoy zero downtime with our lightning-fast contactless cards and readers. Customers never waste a second and you never lose a sale.",
    image: WhyChooseImage1,
    bgColor: "#FCF6EA",
    rotate: -5,
    position: { x: 40, y: -15 }, // Translate 40px right, 0px vertically
  },
  {
    title: "More Revenue",
    description:
      "Centralize the payment experience and capture every kobo that moves through your ecosystem with a single integration.",
    image: WhyChooseImage2,
    bgColor: "#FFE9F4",
    rotate: 5,
    position: { x: 20, y: -20 }, // Translate 0px horizontally, 20px up
  },
  {
    title: "More Control",
    description:
      "Virtual and physical card issuing; submerchant collections; instant settlements – everything they said was impossible from a simple dashboard.",
    image: WhyChooseImage3,
    bgColor: "#68DACB",
    rotate: 8,
    position: { x: -20, y: -15 }, // Translate 20px right, 50px up
  },
  {
    title: "More Loyalty",
    description:
      "Flex on ‘em with branded cards and rewards programs that keep you top of your customers’ minds – and wallets!",
    image: WhyChooseImage4,
    bgColor: "#162D67",
    rotate: -2,
    position: { x: -50, y: -20 }, // Translate 0px horizontally, 80px up
  },
];
