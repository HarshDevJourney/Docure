"use client";

import React, { Suspense } from "react";
import DoctorFullProfile from "@/components/patient/DoctorFullProfile";
import { Loader } from "lucide-react";

const DoctorProfilePage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-screen">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            }
        >
            <DoctorFullProfile />
        </Suspense>
    );
};

export default DoctorProfilePage;
