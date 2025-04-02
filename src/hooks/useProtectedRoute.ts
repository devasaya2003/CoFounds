"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice";

export default function useProtectedRoute(requiredRole: string = "any") {
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {      
      if (isAuthenticated && (requiredRole === "any" || userRole === requiredRole)) {
        setLoading(false);
        return;
      }
      
      try {        
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        
        if (data.isAuthenticated) {          
          if (data.user && data.token) {
            dispatch(setToken(data.token));
          }
                    
          if (requiredRole !== "any" && data.role !== requiredRole) {            
            if (data.role === "candidate") {
              router.push("/candidate/app");
            } else if (data.role === "recruiter") {
              router.push("/recruiter/app");
            } else {
              router.push("/auth/recruiter-sign-in");
            }
          }
          setLoading(false);
          return;
        }
                
        router.push("/auth/recruiter-sign-in");
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/auth/recruiter-sign-in");
      }
    };

    checkAuth();
  }, [isAuthenticated, userRole, requiredRole, router, dispatch]);
  
  return { isAuthenticated, isLoading: loading };
}