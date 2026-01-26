"use client";

import { DoctorFilters } from "@/lib/types";
import { useDoctorState } from "@/store/doctorStore";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Header } from "../landing/Header";
import DoctorListSearchBox from "./DoctorListSearchBox";
import DoctorProfileCard from "./doctorProfileCard";
import { Stethoscope } from "lucide-react";

const DoctorListPage = () => {
    const searchParam = useSearchParams();
    const router = useRouter();
    const categoryParam = searchParam.get("category");
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<DoctorFilters>({
        search: "",
        specialization: "",
        category: "",
        city: "",
        sortBy: "experience",
        sortOrder: "desc",
    });

    const { doctors, loading, fetchDoctors } = useDoctorState();

    useEffect(() => {
        fetchDoctors(filters);
    }, [fetchDoctors, filters]);

    const handleFilterChange = (key: keyof DoctorFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            specialization: "",
            category: categoryParam || "",
            city: "",
            sortBy: "experience",
            sortOrder: "desc",
        });
    };

    return (
        <div className='w-full bg-gradient-to-b from-blue-50 to-white py-8 sm:py-10 overflow-x-hidden'>
            <Header showDashboardNav />
            
            <div className='max-w-4xl mx-auto text-center mt-18 md:mt-24 px-4'>
                <h1 className='text-blue-600 font-bold text-3xl sm:text-4xl md:text-6xl'>
                    Your Care Starts Here
                </h1>
                <p className='text-gray-500 md:text-xl font-semibold md:my-2'>
                    Find the right doctor for your health needs
                </p>
            </div>

            <DoctorListSearchBox />

            {/* Doctors List */}
            <div className='max-w-5xl mx-auto mt-8 px-2 sm:px-4 w-full'>
                {loading ? (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                    </div>
                ) : doctors.length > 0 ? (
                    <>
                        <div className='flex justify-between items-center mb-6 px-2'>
                            <p className='text-gray-600'>
                                Showing {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 gap-4 sm:gap-6 w-full'>
                            {doctors.map((doctor) => (
                                <div key={doctor._id} className='w-full max-w-full overflow-hidden'>
                                    <DoctorProfileCard
                                        doctor={doctor}
                                        onViewProfile={(doctor) => {
                                            router.push(`/doctor/${doctor._id}`);
                                        }}
                                        onBookAppointment={(doctor) => {
                                            // Navigate to booking page
                                            console.log("Book appointment:", doctor._id);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 mb-4'>
                            <Stethoscope className='w-16 h-16 mx-auto' />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-600 mb-2'>
                            No doctors found
                        </h3>
                        <p className='text-gray-500'>Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorListPage;
