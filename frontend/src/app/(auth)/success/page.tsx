"use client";

import { userAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const AuthSuccess = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = userAuthStore();

    useEffect(() => {
        const token = searchParams.get("token");
        const type = searchParams.get("type");
        const userParam = searchParams.get("user");
        const isNewUser = searchParams.get("isNewUser") === "true";

        if (token && type && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                setUser({ ...user, type }, token);
                toast.success("Google authentication successful");

                // New users always go to onboarding
                if (isNewUser) {
                    router.push(`/onboarding/${type}`);
                } else if (!user.isVerified) {
                    // Existing users who aren't verified go to onboarding
                    router.push(`/onboarding/${type}`);
                } else {
                    // Existing verified users go to dashboard
                    router.push(`/${type}/dashboard`);
                }
            } catch (error) {
                toast.error("Failed to process authentication");
                router.push("/login/patient");
            }
        } else {
            toast.error("Invalid authentication response");
            router.push("/login/patient");
        }
    }, [searchParams, setUser, router]);

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                <p className='mt-4 text-lg'>Authenticating...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
