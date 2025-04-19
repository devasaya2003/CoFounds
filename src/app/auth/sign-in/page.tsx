"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setEmail, setPassword, clearError, signIn, setToken } from "@/redux/slices/authSlice";
import EmailInput from "@/components/auth/EmailInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { validateSigninForm } from "@/utils/auth_utils";

export default function CandidateSignIn() {
  const dispatch = useAppDispatch();
  const { email, password, isLoading, error, isAuthenticated, userRole, token } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  
  // Local state for form errors
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    
    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {    
    if (isAuthenticated && userRole === "candidate") {
      router.push("/candidate/app");
    }
  }, [isAuthenticated, userRole, router]);

  const validateForm = () => {
    const { errors, isValid } = validateSigninForm(email, password);
    setFormErrors(errors);
    return isValid;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    dispatch(signIn());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value));
    // Clear error when user starts typing
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value));
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome Back to CoFounds
          </CardTitle>
          <CardDescription>
            Sign in to your candidate account to continue your job search
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <EmailInput 
              value={email} 
              onChange={handleEmailChange} 
              disabled={isLoading} 
              error={formErrors.email}
            />

            <PasswordInput 
              value={password} 
              onChange={handlePasswordChange} 
              disabled={isLoading}
              forgotPasswordLink={true}
              error={formErrors.password}
            />

            <AuthButton 
              isLoading={isLoading} 
              loadingText="Signing in..."
            >
              Sign In
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
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}