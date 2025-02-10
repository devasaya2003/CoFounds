"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Settings2, Code2 } from "lucide-react";

export default function HiringProcess() {
  const steps = [
    {
      title: "Application Submission",
      icon: Terminal,
      items: [
        "Get visible with your proof of work",
        "Get interviews based on what you build for masses",
        "Showcase your technical expertise",
        "Submit detailed project documentation",
        "Highlight your achievements",
      ],
    },
    {
      title: "Shortlisting and Management",
      icon: Settings2,
      items: [
        "AI-powered application screening",
        "Real-time status tracking",
        "Automated skill assessment",
        "Interview scheduling system",
        "Feedback management",
      ],
    },
    {
      title: "Technical Evaluation",
      icon: Code2,
      items: [
        "Code review process",
        "System design evaluation",
        "Performance analysis",
        "Security assessment",
        "Scalability testing",
      ],
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="text-center mb-10">
        <button className="px-6 py-2 text-base rounded-full  text-[#2563EB] border border-[#2563EB]/20 hover:bg-[#2563EB]/10 transition-colors">
          How it Works?
        </button>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Your journey to getting hired on CoFounds is simple and
          straightforward
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-none border border-black text-black shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            </div>

            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-primary">
                  {step.title}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {step.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span className="text-base text-black">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
