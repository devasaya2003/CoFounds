"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  forgotPasswordLink?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id = "password",
  value,
  onChange,
  placeholder = "••••••••",
  disabled = false,
  required = true,
  label = "Password",
  forgotPasswordLink = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {forgotPasswordLink && (
        <div className="flex justify-end">
          <a
            href="/auth/forgot-password"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Forgot password?
          </a>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;