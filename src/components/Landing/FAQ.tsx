"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is CoFounds?",
    answer:
      "CoFounds is a platform that helps you find and connect with potential co-founders for your startup.",
  },
  {
    question: "Is CoFounds free to use?",
    answer:
      "Yes, CoFounds has a free tier available for all users with basic features.",
  },
  {
    question: "How does CoFounds differ from traditional job boards?",
    answer:
      "Unlike traditional job boards that only list jobs, CoFounds allows you to manage applications, track progress, and directly interact with recruiters—all from one platform.",
  },
  {
    question: "What is CoFounds?",
    answer:
      "CoFounds is a modern platform designed to streamline the co-founder matching process.",
  },
  {
    question: "What is CoFounds?",
    answer:
      "CoFounds helps entrepreneurs find their ideal co-founders through a sophisticated matching algorithm.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  return (
    <div className="min-h-screen  flex items-center justify-center align-middle p-4">
      <div className="w-full max-w-3xl space-y-6 flex justify-start align-middle items-center text-start flex-col">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 text-base rounded-full bg-[#001F0E] text-[#99FD5D] border border-[#99FD5D]/20 hover:bg-[#99FD5D]/10 transition-colors"
        >
          Some Q&A
        </motion.button>

        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              backgroundColor:
                openIndex === index ? "rgba(10, 15, 13, 0.3)" : "transparent",
            }}
            className="rounded-lg overflow-hidden "
          >
            <motion.button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="md:w-[55rem] w-screen flex md:items-center justify-between p-4 text-left px-10"
              whileHover={{ backgroundColor: "rgba(153, 253, 93, 0.03)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[#99FD5D] font-medium">{faq.question}</span>
              <motion.div initial={false} transition={{ duration: 0.2 }}>
                {openIndex === index ? (
                  <Minus className="w-6 h-6 text-[#99FD5D]" />
                ) : (
                  <Plus className="w-6 h-6 text-[#99FD5D]" />
                )}
              </motion.div>
            </motion.button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-screen  px-10"
                >
                  <div className="px-4 pb-4">
                    <p className="text-white/90">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
