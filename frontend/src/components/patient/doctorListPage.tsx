"use client";

import { DoctorFilters } from "@/lib/types";
import { useDoctorState } from "@/store/doctorStore";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Header } from "../landing/Header";
import DoctorListSearchBox from "./DoctorListSearchBox";
import DoctorProfileCard from "./doctorProfileCard";
import { Stethoscope } from "lucide-react";

const DoctorListPage = () => {
    const searchParam = useSearchParams();
    const router = useRouter();
    const categoryParam = searchParam.get("category");

    // Local fee inputs (uncontrolled until Apply is clicked)
    const [minFees, setMinFees] = useState("");
    const [maxFees, setMaxFees] = useState("");

    const [filters, setFilters] = useState<DoctorFilters>({
        search: "",
        specialization: "",
        category: categoryParam || "",
        city: "",
        sortBy: "experience",
        sortOrder: "desc",
        minFees: "",
        maxFees: "",
    });

    const { doctors, loading, fetchDoctors } = useDoctorState();

    // Sync category from URL param on mount
    useEffect(() => {
        if (categoryParam) {
            setFilters((prev) => ({ ...prev, category: categoryParam }));
        }
    }, [categoryParam]);

    // Fetch ALL doctors once on mount — filtering is done client-side
    useEffect(() => {
        fetchDoctors({});
    }, [fetchDoctors]);

    const handleFilterChange = useCallback((key: keyof DoctorFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    // Apply fees pushes local min/max into filters
    const handleApplyFees = useCallback(() => {
        setFilters((prev) => ({
            ...prev,
            minFees: minFees,
            maxFees: maxFees,
        }));
    }, [minFees, maxFees]);

    // Toggle sort order asc <-> desc
    const handleToggleSortOrder = useCallback(() => {
        setFilters((prev) => ({
            ...prev,
            sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            search: "",
            specialization: "",
            category: "",
            city: "",
            sortBy: "experience",
            sortOrder: "desc",
            minFees: "",
            maxFees: "",
        });
        setMinFees("");
        setMaxFees("");
    }, []);

    // ─── CLIENT-SIDE FILTERING + SORTING ───────────────────────────
    const filteredDoctors = useMemo(() => {
        let result = [...doctors];

        // 1. Search by name
        if (filters.search.trim()) {
            const q = filters.search.trim().toLowerCase();
            result = result.filter((d) => d.name?.toLowerCase().includes(q));
        }

        // 2. Specialization — match against doctor.specialization
        if (filters.specialization) {
            const spec = filters.specialization.toLowerCase();
            result = result.filter((d) =>
                d.specialization?.toLowerCase().includes(spec)
            );
        }

        // 3. City — match against doctor.hospitalInfo.cityName
        //    (hospitalInfo.cityName is the field saved during onboarding)
        if (filters.city) {
            const city = filters.city.toLowerCase();
            result = result.filter((d) =>
                d.hospitalInfo?.cityName?.toLowerCase().includes(city)
            );
        }

        // 4. Category — doctor.category is an array of strings
        if (filters.category) {
            const cat = filters.category.toLowerCase();
            result = result.filter(
                (d) =>
                    Array.isArray(d.category) &&
                    d.category.some((c: string) => c.toLowerCase().includes(cat))
            );
        }

        // 5. Min fees
        if (filters.minFees !== "") {
            const min = Number(filters.minFees);
            result = result.filter((d) => (d.fees ?? 0) >= min);
        }

        // 6. Max fees
        if (filters.maxFees !== "") {
            const max = Number(filters.maxFees);
            result = result.filter((d) => (d.fees ?? 0) <= max);
        }

        // 7. Sort
        result.sort((a, b) => {
            const valA = filters.sortBy === "fees" ? (a.fees ?? 0) : (a.experience ?? 0);
            const valB = filters.sortBy === "fees" ? (b.fees ?? 0) : (b.experience ?? 0);
            return filters.sortOrder === "asc" ? valA - valB : valB - valA;
        });

        return result;
    }, [doctors, filters]);
    // ────────────────────────────────────────────────────────────────

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

            <DoctorListSearchBox
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                minFees={minFees}
                maxFees={maxFees}
                onMinFeesChange={setMinFees}
                onMaxFeesChange={setMaxFees}
                onApplyFees={handleApplyFees}
                sortOrder={filters.sortOrder}
                onToggleSortOrder={handleToggleSortOrder}
            />

            {/* Doctors List */}
            <div className='max-w-5xl mx-auto mt-8 px-2 sm:px-4 w-full'>
                {loading ? (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <>
                        <div className='flex justify-between items-center mb-6 px-2'>
                            <p className='text-gray-600'>
                                Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
                                {filteredDoctors.length !== doctors.length && (
                                    <span className='text-gray-400'> of {doctors.length}</span>
                                )}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 gap-4 sm:gap-6 w-full'>
                            {filteredDoctors.map((doctor) => (
                                <div key={doctor._id} className='w-full max-w-full overflow-hidden'>
                                    <DoctorProfileCard
                                        doctor={doctor}
                                        onViewProfile={(doctor) => {
                                            router.push(`/doctor/${doctor._id}`);
                                        }}
                                        onBookAppointment={(doctor) => {
                                            router.push(`/doctor/${doctor._id}/book`);
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
                        <p className='text-gray-500 mb-4'>
                            {doctors.length === 0
                                ? "No doctors are available at the moment."
                                : "No doctors match your current filters. Try broadening your search."}
                        </p>
                        {doctors.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className='text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors'
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorListPage;