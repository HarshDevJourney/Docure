import { healthcareCategories } from "@/lib/constant";
import Link from "next/link";
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowBigDown, ArrowDown, ArrowUpDown, Search, Stethoscope } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const cities = ["fjkbkj", "giboi"];

const specializations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Neurologist",
    "Gynecologist",
    "Psychiatrist",
    "ENT Specialist",
];

const DoctorListSearchBox = () => {
    return (
        <div className='max-w-5xl px-4 mx-auto text-center mt-8 md:mt-14'>
            {/* Main Container Box */}
            <div className='relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
                {/* Subtle Background Pattern */}
                <div className='absolute inset-0 opacity-[0.02]'>
                    <div className='absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl'></div>
                    <div className='absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full blur-2xl'></div>
                </div>
                
                <div className='relative p-4 sm:p-6 space-y-4'>
                    {/* MAIN SEARCH ROW */}
                    <div className='flex flex-col sm:flex-row sm:h-12 border border-gray-200 rounded-xl overflow-hidden w-full shadow-sm hover:shadow-md transition-shadow duration-200 bg-white'>
                        {/* Speciality */}
                        <div className='w-full sm:w-auto flex justify-center items-center sm:justify-start px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50/50 sm:bg-transparent'>
                            <Select>
                                <SelectTrigger className='w-full sm:w-auto border-none shadow-none focus:ring-2 focus:ring-blue-500/20 focus-visible:ring-2 focus-visible:ring-blue-500/20 h-10 font-semibold text-blue-700 flex items-center gap-2 bg-transparent hover:bg-gray-50 transition-colors'>
                                    <Stethoscope className='text-blue-600 w-4 h-4' />
                                    <SelectValue placeholder='Speciality' />
                                </SelectTrigger>
                                <SelectContent>
                                    {specializations.map((spec) => (
                                        <SelectItem key={spec} value={spec.toLowerCase()}>
                                            {spec}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Input */}
                        <div className='flex items-center w-full sm:h-full h-12 px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50/30 sm:bg-transparent'>
                            <Search className='text-gray-400 w-5 h-5 mr-3 shrink-0' />
                            <input
                                type='text'
                                placeholder='Search Doctor By Name'
                                className='w-full outline-none sm:text-start text-center text-gray-700 font-medium bg-transparent placeholder-gray-400 text-sm focus:text-gray-900 transition-colors'
                            />
                        </div>

                        {/* Button */}
                        <Button className='w-auto sm:w-32 md:w-40 h-12 sm:h-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-none sm:rounded-r-xl transition-all duration-200 shadow-sm hover:shadow-md'>
                            <Search className='w-4 h-4 mr-2' />
                            Search
                        </Button>
                    </div>

                    {/* FILTER ROW */}
                    <div className='w-full flex flex-col sm:flex-row sm:h-12 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white'>
                        {/* FILTER CARD */}
                        <div className='flex-1 px-4 py-3 sm:py-0 border-r border-gray-200 sm:h-full bg-gray-50/30'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full sm:h-full'>
                                {/* City */}
                                <div className='grid grid-cols-[auto_1fr] items-center gap-3 sm:border-r sm:border-gray-200 sm:pr-4'>
                                    <label className='text-sm font-semibold text-gray-600 whitespace-nowrap'>
                                        City
                                    </label>
                                    <Select>
                                        <SelectTrigger className='h-9 w-full border border-gray-200 shadow-none focus:ring-2 focus:ring-blue-500/20 focus-visible:ring-2 focus-visible:ring-blue-500/20 px-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'>
                                            <SelectValue placeholder='Select city' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city} value={city.toLowerCase()}>
                                                    {city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Fees */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='grid grid-cols-[auto_1fr] items-center gap-3'>
                                        <label className='text-sm font-semibold text-gray-600 whitespace-nowrap'>
                                            Min ₹
                                        </label>
                                        <input
                                            type='number'
                                            placeholder='0'
                                            className='w-full bg-white border border-gray-200 rounded-md outline-none text-sm font-medium text-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200'
                                        />
                                    </div>
                                    <div className='grid grid-cols-[auto_1fr] items-center gap-3'>
                                        <label className='text-sm font-semibold text-gray-600 whitespace-nowrap'>
                                            Max ₹
                                        </label>
                                        <input
                                            type='number'
                                            placeholder='10000'
                                            className='w-full bg-white border border-gray-200 rounded-md outline-none text-sm font-medium text-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* APPLY BUTTON */}
                        <div className='w-auto sm:w-32 md:w-40 h-12 sm:h-auto'>
                            <Button className='w-full h-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold rounded-none sm:rounded-r-xl transition-all duration-200 shadow-sm hover:shadow-md'>
                                Apply Filters
                            </Button>
                        </div>
                    </div>

                    {/* CATEGORY ROW - Compact Horizontal Scroll */}
                    <div className='w-full pt-2 border-t border-gray-100'>
                        <div className='flex items-center gap-2 mb-3'>
                            <div className='bg-blue-50 p-1.5 rounded-lg'>
                                <Stethoscope className='w-3.5 h-3.5 text-blue-600' />
                            </div>
                            <span className='text-xs sm:text-sm font-semibold text-gray-700'>Browse Categories</span>
                        </div>
                        <div className='overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1'>
                            <div className='flex gap-2 min-w-max'>
                                {healthcareCategories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={category.href}
                                        className='group flex-shrink-0'
                                    >
                                        <div
                                            className={`
                                                flex items-center gap-1.5 sm:gap-2
                                                min-w-[100px] sm:min-w-[115px]
                                                h-9 sm:h-10
                                                px-2.5 sm:px-3
                                                rounded-lg
                                                ${category.color}
                                                shadow-sm hover:shadow-md
                                                transition-all duration-300
                                                transform hover:scale-105
                                                cursor-pointer
                                                relative overflow-hidden
                                                border border-white/20
                                            `}
                                        >
                                            {/* Hover Overlay */}
                                            <div className='absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300'></div>
                                            
                                            {/* Icon */}
                                            <div className='relative z-10 flex-shrink-0'>
                                                <svg
                                                    className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white'
                                                    fill='currentColor'
                                                    viewBox='0 0 24 24'
                                                    aria-hidden='true'
                                                >
                                                    <path d={category.icon} />
                                                </svg>
                                            </div>
                                            
                                            {/* Title */}
                                            <span className='relative z-10 text-white font-semibold text-[10px] sm:text-xs whitespace-nowrap'>
                                                {category.title}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* SORT ROW */}
            <div className='flex items-center gap-3 h-12 mt-20 border border-gray-200 rounded-xl px-4 w-full shadow-sm hover:shadow-md transition-shadow duration-200 bg-white'>
                <span className='text-sm font-semibold text-gray-600 whitespace-nowrap flex items-center gap-2'>
                    <ArrowUpDown className='w-4 h-4 text-gray-400' />
                    Sort by
                </span>
                <Tabs defaultValue='fees' className='flex-1'>
                    <TabsList className='h-9 bg-gray-100'>
                        <TabsTrigger value='fees' className='text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm'>
                            Fees
                        </TabsTrigger>
                        <TabsTrigger value='experience' className='text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm'>
                            Experience
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button variant='outline' className='h-9 w-9 flex items-center justify-center border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200'>
                    <ArrowUpDown className='w-4 h-4' />
                </Button>
            </div>
        </div>
    );
};

export default DoctorListSearchBox;
