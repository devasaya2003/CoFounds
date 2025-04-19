"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;  // Add the error prop
}

const EmailInput: React.FC<EmailInputProps> = ({
  id = "email",
  value,
  onChange,
  placeholder = "name@company.com",
  disabled = false,
  required = true,
  label = "Email",
  error,  // Include error in the function props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default EmailInput;