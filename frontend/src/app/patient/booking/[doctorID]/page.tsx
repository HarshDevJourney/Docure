"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Doctor } from "@/lib/types";
import { Header } from "@/components/landing/Header";
import BookingPage from "@/components/booking/BookingPage";
import { Loader } from "lucide-react";
import { useDoctorState } from "@/store/doctorStore";

export default function DoctorBookingPage() {
    const params = useParams();
    const router = useRouter();
    const doctorId = params?.doctorID as string;
    const { doctors, fetchDoctors } = useDoctorState();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDoctor = async () => {
            try {
                if (doctors.length === 0) {
                    await fetchDoctors({});
                }

                const foundDoctor = doctors.find((d) => d._id === doctorId);
                if (foundDoctor) {
                    setDoctor(foundDoctor as Doctor);
                } else {
                    // If not found, redirect to doctor list
                    router.push("/doctor-list");
                }
            } catch (error) {
                console.error("Error loading doctor:", error);
                router.push("/doctor-list");
            } finally {
                setLoading(false);
            }
        };

        loadDoctor();
    }, [doctorId, doctors, fetchDoctors, router]);

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center'>
                <Loader size={48} className='text-blue-600 animate-spin mb-4' />
                <p className='text-gray-600 font-medium'>Loading doctor information...</p>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center'>
                <p className='text-gray-600 font-medium'>Doctor not found</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
            <Header showDashboardNav/>
            <BookingPage doctor={doctor} />
        </div>
    );
}
