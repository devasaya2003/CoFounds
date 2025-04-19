"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EmailInput from "@/components/auth/EmailInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { validateSignupForm } from "@/utils/auth_utils";

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate", // Default role is candidate
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/candidate/app");
    }
  }, [isAuthenticated, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
    // Clear error when user starts typing
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      confirmPassword: e.target.value,
    }));
    if (formErrors.confirmPassword) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const validateForm = () => {
    const { errors, isValid } = validateSignupForm(formData, agreedToTerms);
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { email, password, role } = formData;
    
    try {
      await dispatch(signUp({ email, password, role })).unwrap();
      // Success - redirect will happen via the useEffect above
    } catch (err) {
      // Error is already handled in the Redux slice
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Sign Up for the best hiring platform ever</CardTitle>
          <CardDescription>Create a candidate account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailInput
              value={formData.email}
              onChange={handleEmailChange}
              disabled={isLoading}
              error={formErrors.email}
            />
            
            <PasswordInput
              value={formData.password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              id="password"
              label="Password"
              error={formErrors.password}
            />
            
            <PasswordInput
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={isLoading}
              id="confirmPassword"
              label="Confirm Password"
              error={formErrors.confirmPassword}
            />
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                disabled={isLoading} 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {formErrors.terms && <p className="text-sm text-red-500">{formErrors.terms}</p>}
            
            <AuthButton 
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create Candidate Account
            </AuthButton>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5">
              <path
                fill="#EA4335"
                d="M12 5c1.6168 0 3.1013.5978 4.236 1.5788l3.1757-3.1289C17.3877 1.7443 14.8145.8 12 .8 7.3249.8 3.3795 3.7054 1.5366 7.9033l3.6541 2.8436C6.2509 7.483 8.8956 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.8391-.0759-1.6455-.2172-2.4229H12v4.9514h6.4868c-.2798 1.4699-1.1294 2.7145-2.4079 3.5557l3.7227 2.8701C21.9533 19.1941 23.49 16.041 23.49 12.275"
              />
              <path
                fill="#FBBC05"
                d="M5.1907 14.5469l-3.6541 2.8436C3.2846 21.2596 7.3249 24 12 24c2.9022 0 5.3376-.9443 7.1164-2.5628l-3.7227-2.8701c-1.0282.6842-2.3555 1.0886-3.9351 1.0886-3.1044 0-5.749-2.483-6.6906-5.8331"
              />
              <path
                fill="#34A853"
                d="M12 24c4.6751 0 8.6205-2.9054 10.4634-7.1033l-3.7227-2.8701c-1.0282.6842-2.3555 1.0886-3.9351 1.0886-3.1044 0-5.749-2.483-6.6906-5.8331L4.5 12.1867C6.3429 18.8013 10.675 24 12 24"
              />
            </svg>
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}