"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="absolute top-0 left-0 right-0 z-50  text-white px-4 md:px-20 pt-5 bg-transparent"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between border bg-maincolor/5 border-maincolor/50 drop-shadow-lg shadow-maincolor rounded-full max-w-5xl">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-black">Co</span>
          <span className="text-[#2563EB]">Founds</span>
          <span className="text-white">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            "Recruiter(Coming Soon)",
            "Jobs(Coming Soon)",
            "Newsletter",
            "Resources",
          ].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/${item.toLowerCase()}`}
                className="hover:text-[#2563EB] text-black transition-colors"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Link
            href="https://chat.whatsapp.com/FUo2MVMuvSKKsbJwoIldW3"
            className="hidden md:block bg-[#2563EB] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors"
          >
            Join Our Community
          </Link>

          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
                animate={isMenuOpen ? { rotate: 45, y: 5 } : {}}
              />
              <motion.line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
                animate={isMenuOpen ? { opacity: 0 } : {}}
              />
              <motion.line
                x1="3"
                y1="18"
                x2="21"
                y2="18"
                animate={isMenuOpen ? { rotate: -45, y: -5 } : {}}
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden w-full absolute top-full left-0 right-0 bg-black border border-maincolor backdrop-blur-lg mt-2 rounded-xl shadow-lg overflow-hidden"
            >
              <motion.div className="flex flex-col p-4 space-y-4">
                {[
                  "Recruiter(Coming Soon)",
                  "Jobs(Coming Soon)",
                  "Newsletter",
                  "Resources",
                ].map((item) => (
                  <motion.div
                    key={item}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="block py-2 px-4 hover:text-[#2563EB]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={itemVariants}
                  className="pt-4 border-t border-maincolor/50"
                >
                  <Link
                    href="/join"
                    className="block w-full text-center bg-[#2563EB] text-black px-4 py-2 rounded-full hover:bg-opacity-90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Our Community
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
