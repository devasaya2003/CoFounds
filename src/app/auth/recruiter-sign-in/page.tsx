"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinCommunity } from "@/app/utils/joinCommunity";

export default function RecruiterSignIn() {
  const dispatch = useAppDispatch();
  const { email, password, isLoading, error, isAuthenticated, userRole, token } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    console.log("Page loaded, token in localStorage:", storedToken ? "exists" : "none");
    
    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {    
    if (isAuthenticated && userRole === "recruiter") {
      router.push("/recruiter/app");
    }
  }, [isAuthenticated, userRole, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signIn());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Login To Your Cofounds Recruiter Dashboard
          </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
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
            />

            <PasswordInput 
              value={password} 
              onChange={handlePasswordChange} 
              disabled={isLoading}
              forgotPasswordLink={true}
            />

            <AuthButton 
              isLoading={isLoading} 
              loadingText="Signing in..."
            >
              Sign In
            </AuthButton>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t pt-4">
          <div className="text-center text-sm">
            <p>Don&apos;t have a recruiter email ID?</p>
            <Button
              variant="link"
              onClick={JoinCommunity}
              className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm"
            >
              Contact us!
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={JoinCommunity}
            className="w-full flex items-center justify-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Join Our WhatsApp Community
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}