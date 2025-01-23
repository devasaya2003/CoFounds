"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50
        
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center max-w-4xl backdrop-blur-md bg-black border border-white/35        rounded-full mt-4">
        <div className="flex justify-between items-center h-16 max-w-7xl w-full">
          {/* Logo */}
          <Link href="/" className="text-white text-xl font-bold">
            CoFounds.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-blue-200 transition-all duration-300"
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className="text-white hover:text-blue-200 transition-all duration-300"
            >
              Jobs
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-blue-200 transition-all duration-300"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-blue-200 transition-all duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black backdrop-blur-md rounded-lg border-b border-blue-600 min-h-screen flex justify-center align-middle items-center flex-col text-2xl p-4">
          <Link
            href="/"
            className="block text-white hover:text-blue-200 py-2"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className="block text-white hover:text-blue-200 py-2"
            onClick={toggleMenu}
          >
            Jobs
          </Link>
          <Link
            href="/about"
            className="block text-white hover:text-blue-200 py-2"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block text-white hover:text-blue-200 py-2"
            onClick={toggleMenu}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
