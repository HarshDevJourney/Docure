"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AuthErrorContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.error(decodeURIComponent(message));
    } else {
      toast.error("Authentication failed");
    }
  }, [searchParams]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-red-600 mb-4'>Authentication Failed</h1>
        <p className='text-gray-600 mb-6'>
          There was an error during Google authentication. Please try again.
        </p>
        <Button
          className='bg-blue-600 text-white font-semibold'
          variant={"secondary"}
          onClick={() => router.push("/login/patient")}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

const AuthError = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
};

export default AuthError;
