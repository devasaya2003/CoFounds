"use client";

import { HTMLAttributes, useEffect, useRef, useState } from "react";
import Avatar1 from "@/assets/InfinteScrollAssets/avataaars.png";
import Avatar2 from "@/assets/InfinteScrollAssets/avataaars (1).png";
import Avatar3 from "@/assets/InfinteScrollAssets/avataaars (2).png";
import Avatar4 from "@/assets/InfinteScrollAssets/avataaars (3).png";

import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    company: "TechInnovate India",
    text: "This platform helped me find my dream job in just two weeks! The personalized recommendations and easy-to-use interface made the process seamless and stress-free. I can’t recommend it enough!",
    avatar: Avatar1,
  },
  {
    name: "Rahul Patel",
    role: "Product Manager",
    company: "StartUp Solutions",
    text: "The AI-powered matching system is incredibly accurate. It saved me so much time by filtering jobs that perfectly matched my skills and career goals. Highly recommended for anyone serious about job hunting!",
    avatar: Avatar2,
  },
  {
    name: "Ananya Desai",
    role: "UX Designer",
    company: "CreativeMinds",
    text: "I love how easy it is to connect with top companies across India. The platform also offers great insights into company cultures, helping me make informed decisions. It’s a game-changer!",
    avatar: Avatar3,
  },
  {
    name: "Vikram Malhotra",
    role: "Data Scientist",
    company: "DataTech Solutions",
    text: "Found multiple great opportunities tailored to my skills and preferences. The platform's ability to suggest highly relevant roles is unmatched. It’s like having a career coach at your fingertips!",
    avatar: Avatar4,
  },
  {
    name: "Neha Gupta",
    role: "Marketing Specialist",
    company: "BrandBoost India",
    text: "The platform's career resources helped me prepare for interviews effectively. From resume tips to mock interviews, everything was extremely helpful in landing my dream job.",
    avatar: Avatar1,
  },
  {
    name: "Arjun Reddy",
    role: "Full Stack Developer",
    company: "CodeCrafters",
    text: "Seamless experience from profile creation to job acceptance. The user-friendly design and comprehensive features make this platform stand out from the rest.",
    avatar: Avatar2,
  },
  {
    name: "Sanya Mehta",
    role: "HR Manager",
    company: "TalentBridge",
    text: "The platform not only helped me find a role that aligned with my experience but also introduced me to new industries I hadn’t considered before. Exceptional service!",
    avatar: Avatar3,
  },
  {
    name: "Aman Verma",
    role: "Backend Developer",
    company: "CloudMatrix",
    text: "The advanced job search filters saved me a ton of time. I could find roles that matched my skills and even applied directly on the platform. Absolutely worth it!",
    avatar: Avatar4,
  },
  {
    name: "Pooja Nair",
    role: "Content Strategist",
    company: "CreativeSpark",
    text: "From setting up my profile to connecting with companies, the process was a breeze. I appreciated the detailed job descriptions and transparency throughout.",
    avatar: Avatar1,
  },
  {
    name: "Karan Singh",
    role: "UI Developer",
    company: "PixelPerfect",
    text: "The platform’s intuitive design made it easy for me to explore new job opportunities. It felt like the roles were curated specifically for me. Great experience!",
    avatar: Avatar2,
  },
  {
    name: "Rohit Jain",
    role: "DevOps Engineer",
    company: "NextGen Systems",
    text: "The platform’s notification system kept me updated on new opportunities and application statuses. The responsiveness of the team was also commendable.",
    avatar: Avatar3,
  },
  {
    name: "Meera Iyer",
    role: "Project Manager",
    company: "Agile Solutions",
    text: "The platform is a must-have for job seekers. The detailed company profiles and employee reviews were incredibly helpful in making informed decisions.",
    avatar: Avatar4,
  },
  {
    name: "Rajiv Khanna",
    role: "Graphic Designer",
    company: "DesignHive",
    text: "As someone transitioning into a new field, the platform gave me tailored suggestions that boosted my confidence. I’m now working in a role I love!",
    avatar: Avatar1,
  },
  {
    name: "Ishita Basu",
    role: "Business Analyst",
    company: "InsightCorp",
    text: "The step-by-step guidance provided by the platform helped me navigate a competitive job market with ease. It’s the best career tool I’ve come across.",
    avatar: Avatar2,
  },
  {
    name: "Nikhil Rao",
    role: "iOS Developer",
    company: "AppSphere",
    text: "This platform takes the hassle out of job searching. I particularly loved the ability to see how my profile matched up with a role’s requirements.",
    avatar: Avatar3,
  },
  {
    name: "Swati Jain",
    role: "Digital Marketing Executive",
    company: "AdGuru",
    text: "The platform’s emphasis on skill-based job recommendations ensured I found roles that aligned with my expertise. It’s a revolutionary way to job hunt.",
    avatar: Avatar4,
  },
  {
    name: "Kunal Das",
    role: "Blockchain Developer",
    company: "CryptoCore",
    text: "With the platform’s help, I found a blockchain role that perfectly fit my niche expertise. It’s a great resource for specialized professionals.",
    avatar: Avatar1,
  },
  {
    name: "Rhea Kapoor",
    role: "Data Analyst",
    company: "AnalyzeThis",
    text: "The detailed analytics about job applications and views helped me tailor my approach. It’s the perfect companion for any data-driven professional.",
    avatar: Avatar2,
  },
  {
    name: "Manoj Pillai",
    role: "Tech Lead",
    company: "InnovateHub",
    text: "The platform streamlined my job search and connected me with startups where my skills were highly valued. It’s a must-try for senior professionals.",
    avatar: Avatar3,
  },
  {
    name: "Ankita Roy",
    role: "Software Tester",
    company: "BugFree Tech",
    text: "The platform’s features, like skill assessments and real-time updates, kept me motivated throughout the process. I landed a role faster than expected!",
    avatar: Avatar4,
  },
];

export function Reviews() {
  return (
    <div className="relative max-w-5xl  ">
      <img
        className="absolute select-none hidden xl:block -left-32 top-1/3"
        src="/what-people-are-saying.png"
        alt=""
        aria-hidden="true"
      />
      <ReviewGrid />
    </div>
  );
}

function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray(TESTIMONIALS, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid lg:h-[49rem]  lg:max-h-[60vh] max-h-max grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-1 lg:grid-cols-3"
    >
      {isInView ? (
        <>
          <div className="lg:hidden overflow-hidden">
            <ReviewRow reviews={TESTIMONIALS} msPerPixel={20} />
          </div>
          <div className="hidden lg:block">
            <ReviewColumn
              reviews={[...column1, ...column3.flat(), ...column2]}
              reviewClassName={(reviewIndex) =>
                cn({
                  "md:hidden":
                    reviewIndex >= column1.length + column3[0].length,
                  "lg:hidden": reviewIndex >= column1.length,
                })
              }
              msPerPixel={10}
            />
          </div>
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden lg:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden lg:block"
            msPerPixel={10}
          />
        </>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black" />
    </div>
  );
}

function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: typeof TESTIMONIALS;
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  const colref = useRef<HTMLDivElement | null>(null);

  const [columnheight, setColumnHeight] = useState(0);

  const duration = `${columnheight * msPerPixel}ms`;
  useEffect(() => {
    if (!colref.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(colref.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(colref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={colref}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {reviews.concat(reviews).map((review, index) => (
        <Review
          key={index}
          review={review}
          className={reviewClassName?.(index % reviews.length)}
        />
      ))}
    </div>
  );
}

function ReviewRow({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: typeof TESTIMONIALS;
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [rowWidth, setRowWidth] = useState(0);

  const duration = `${rowWidth * msPerPixel}ms`;

  useEffect(() => {
    if (!rowRef.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setRowWidth(rowRef.current?.scrollWidth ?? 0);
    });

    resizeObserver.observe(rowRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div
        ref={rowRef}
        className={cn(
          "flex animate-marquee-horizontal space-x-8 py-4",
          className
        )}
        style={{ "--marquee-duration": "5000ms" } as React.CSSProperties}
      >
        {reviews.concat(reviews).map((review, index) => (
          <Review
            key={index}
            review={review}
            className={cn(
              "w-80 flex-shrink-0",
              reviewClassName?.(index % reviews.length)
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  review: (typeof TESTIMONIALS)[number];
}

function Review({ review, className, ...props }: ReviewProps) {
  const POSSIBLE_ANIM_DELAYS = ["0s", "0.1s", "0.2s", "0.3s", "0.4s", "0.5s"];
  const animationDelay =
    POSSIBLE_ANIM_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIM_DELAYS.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-lg bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <p className="text-sm leading-6 text-gray-900">{review.text}</p>
      <div className="mt-4 flex items-center gap-x-4">
        <div className="flex-none rounded-full bg-gray-50 p-1">
          <div className="h-8 w-8 rounded-full bg-gray-200">
            <Image
              alt="avatar"
              src={review.avatar || "/placeholder.svg"}
              width={32}
              height={32}
              className="size-8 object-cover rounded-full"
            />
          </div>
        </div>
        <div className="text-sm leading-6">
          <p className="font-semibold text-gray-900">{review.name}</p>
          <p className="text-gray-600">{review.role}</p>
        </div>
      </div>
    </div>
  );
}

function splitArray<T>(array: Array<T>, numparts: number) {
  const result: Array<Array<T>> = [];
  for (let index = 0; index < array.length; index++) {
    const element = index % numparts;
    if (!result[element]) {
      result[element] = [];
    }

    result[element].push(array[index]);
  }
  return result;
}
