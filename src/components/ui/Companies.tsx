"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import Image from "next/image";

export default function TrustedByCompanies() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.scrollWidth / 2);
    }
  }, []);

  useEffect(() => {
    if (containerWidth > 0) {
      controls.start({
        x: [-containerWidth, 0],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          },
        },
      });
    }
  }, [containerWidth, controls]);

  return (
    <div className="md:w-1/2 w-full mx-auto text-white overflow-hidden py-10">
      <span className="text-2xl ">Companies that hire from us</span>

      <div className="relative py-2">
        <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-maincolor to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-maincolor to-transparent z-10" />
        <div className="relative overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex space-x-10"
            animate={controls}
          >
            {[...web3Companies, ...web3Companies].map((logo, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 flex-shrink-0"
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  height={70}
                  width={70}
                  style={{ objectFit: "contain" }}
                  className="md:h-auto size-10"
                />
                <span className="text-white whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const web3Companies = [
  {
    name: "Solana Labs",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png?v=024",
  },
  {
    name: "Serum",
    image: "https://cryptologos.cc/logos/serum-srm-logo.png?v=024",
  },
  {
    name: "ChainLink",
    image: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=035",
  },
  {
    name: "Space ID",
    image: "https://cryptologos.cc/logos/space-id-id-logo.png?v=035",
  },
  {
    name: "Mango Markets",
    image: "https://cryptologos.cc/logos/mango-markets-mngo-logo.png?v=024",
  },
  {
    name: "Flare",
    image: "https://cryptologos.cc/logos/flare-flr-logo.png?v=035",
  },
  {
    name: "Orca",
    image: "https://cryptologos.cc/logos/orca-orca-logo.png?v=024",
  },
  {
    name: "Paypal",
    image: "https://cryptologos.cc/logos/paypal-usd-pyusd-logo.png?v=035",
  },
  {
    name: "Nexo",
    image: "https://cryptologos.cc/logos/nexo-nexo-logo.png?v=035",
  },
  {
    name: "Polygon",
    image: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=035",
  },
];
