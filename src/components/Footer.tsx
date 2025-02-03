"use client";
import Link from "next/link";
import { Twitter, Instagram, Linkedin, Youtube, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 bottom-0 flex justify-center align-middle items-center">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:px-20 px-5 ">
        {/* Company Description & Social */}
        <div className="space-y-4">
          <p className="text-gray-300 max-w-sm">
            CoFounds is a platform that helps talented individuals get hired
            fast with proof of work and community support.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#9BF348] transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:text-[#9BF348] transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="hover:text-[#9BF348] transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="hover:text-[#9BF348] transition-colors">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link href="#" className="hover:text-[#9BF348] transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">COMPANY</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Terms & conditions
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">QUICK LINKS</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Hire talent
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Find work
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Community
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-300 hover:text-[#9BF348] transition-colors"
              >
                Resources
              </Link>
            </li>
          </ul>
        </div>

        {/* Download Section */}
        <div className="space-y-4">
          <div className="pt-2">
            <p className="text-gray-300">
              Are you hiring?{" "}
              <Link href="#" className="text-[#9BF348] hover:underline">
                Find Talent
              </Link>
            </p>
          </div>
          <div className="text-lg">
            <h2>Join Our Newsletter for latest update</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 max-w-md mx-auto py-4 text-base">
              <motion.input
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                type="email"
                placeholder="e.g. johndoe@gmail.com"
                className="md:w-[20rem] w-full text-center px-6 py-3 md:rounded-l-full rounded-t-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#99FD5D]"
              />

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="font-bold md:w-[20rem] w-full  px-8 py-3 md:rounded-r-full rounded-b-md bg-[#99FD5D] text-black  hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
