import { cn } from "@/lib/utils";
import type React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-gray-900 dark:border-gray-800 bg-white border border-gray-200 justify-between flex flex-col space-y-4",
        className
      )}
    >
      <div className="flex-grow">{header}</div>
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="flex items-center space-x-2">
          {icon}
          <div className="font-sans font-bold text-gray-700 dark:text-gray-200 text-lg">
            {title}
          </div>
        </div>
        <div className="font-sans font-normal text-gray-500 text-sm dark:text-gray-400 mt-2">
          {description}
        </div>
      </div>
    </div>
  );
};
