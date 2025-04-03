"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  onClick?: () => void;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const AuthButton: React.FC<AuthButtonProps> = ({
  type = "submit",
  isLoading = false,
  onClick,
  loadingText = "Processing...",
  children,
  className = "w-full bg-black hover:bg-black/90",
  variant = "default",
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={className}
      disabled={isLoading}
      variant={variant}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default AuthButton;