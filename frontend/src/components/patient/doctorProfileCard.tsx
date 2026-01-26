import React, { useState } from "react";
import { Doctor } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    MapPin,
    Star,
    Clock,
    Award,
    Stethoscope,
    GraduationCap,
    Calendar,
    Mail,
    RotateCcw,
    Users,
    MessageCircle,
    Heart,
    Timer,
    CheckCircle,
} from "lucide-react";
import { Button } from "../ui/button";

interface DoctorProfileCardProps {
    doctor: Doctor;
    onViewProfile?: (doctor: Doctor) => void;
    onBookAppointment?: (doctor: Doctor) => void;
}

const DoctorProfileCard: React.FC<DoctorProfileCardProps> = ({
    doctor,
    onViewProfile,
    onBookAppointment,
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatFees = (fees: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(fees);
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Data with fallbacks for API
    const mockData = {
        rating: doctor.rating || 4.8,
        totalReviews: doctor.totalReviews || 1247,
        languages: doctor.languages || ["English", "Hindi"],
        avgConsultationTime: doctor.slotDurationMinutes || 30,
        avgWaitingTime: doctor.avgWaitingTime || "15-20 mins",
        totalPatients: doctor.totalPatients || 2500,
        satisfaction: doctor.satisfaction || 96,
    };

    return (
        <div className='w-[95%] max-w-[340px] md:max-w-3xl mx-auto [perspective:1500px]'>
            <div
                className={`relative transition-all duration-700 [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
            >
                {/* ==================== FRONT SIDE ==================== */}
                <Card className='[backface-visibility:hidden] border border-blue-200 shadow-xl bg-white rounded-2xl overflow-hidden'>
                    <CardContent className='p-0'>
                        <div className='flex flex-col md:flex-row'>
                            {/* LEFT - Profile */}
                            <div className='md:w-[38%] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4 sm:p-6 flex flex-col items-center justify-between text-white relative overflow-hidden'>
                                {/* Decorative background */}
                                <div className='absolute inset-0 opacity-10'>
                                    <div className='absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-2xl'></div>
                                    <div className='absolute -bottom-8 -left-8 w-24 h-24 bg-white rounded-full blur-xl'></div>
                                </div>

                                <div className='relative z-10 w-full space-y-3 sm:space-y-4'>
                                    {/* Avatar */}
                                    <div className='flex justify-center'>
                                        <div className='relative'>
                                            <Avatar className='w-20 h-20 border-4 border-white/30 shadow-xl'>
                                                <AvatarImage
                                                    src={doctor.profileImage}
                                                    alt={doctor.name}
                                                    className='object-cover'
                                                />
                                                <AvatarFallback className='bg-blue-800 text-white font-bold text-xl'>
                                                    {getInitials(doctor.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {doctor.isVerified && (
                                                <div className='absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg border-2 border-white'>
                                                    <CheckCircle className='w-3.5 h-3.5 text-white' />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name & Specialization */}
                                    <div className='text-center space-y-1'>
                                        <h3 className='font-bold text-base sm:text-lg leading-tight'>
                                            {doctor.name}
                                        </h3>
                                        <div className='flex items-center justify-center gap-1.5 text-blue-100'>
                                            <Stethoscope className='w-3.5 h-3.5' />
                                            <p className='text-xs sm:text-sm'>
                                                {doctor.specialization}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating & Experience */}
                                    <div className='flex items-center justify-center gap-2 flex-wrap'>
                                        <div className='bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5'>
                                            <Star className='w-3.5 h-3.5 text-yellow-300 fill-yellow-300' />
                                            <span className='font-semibold text-sm'>{mockData.rating}</span>
                                            <span className='text-xs text-blue-100'>
                                                ({mockData.totalReviews.toLocaleString()})
                                            </span>
                                        </div>
                                        {doctor.experience && (
                                            <Badge className='bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs px-2.5 py-0.5'>
                                                {doctor.experience} yrs
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Languages */}
                                    <div className='flex justify-center gap-1.5 flex-wrap'>
                                        {mockData.languages.map((lang, index) => (
                                            <span
                                                key={index}
                                                className='text-xs bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20'
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>

                                    {/* View Details Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsFlipped(true);
                                        }}
                                        className='w-full bg-white text-blue-700 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg text-sm'
                                    >
                                        <RotateCcw className='w-4 h-4' />
                                        View Details
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT - Information */}
                            <div className='flex-1 p-4 sm:p-6 space-y-3 sm:space-y-4'>
                                {/* Hospital */}
                                {doctor.hospitalInfo && (
                                    <div className='bg-blue-50 rounded-xl p-3 sm:p-3.5 border border-blue-200'>
                                        <div className='flex items-start gap-2.5 sm:gap-3'>
                                            <div className='bg-blue-600 p-2 rounded-lg shadow flex-shrink-0'>
                                                <MapPin className='w-4 h-4 text-white' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-semibold text-gray-900 text-sm mb-0.5'>
                                                    {doctor.hospitalInfo.name}
                                                </p>
                                                <p className='text-gray-600 text-xs'>
                                                    {doctor.hospitalInfo.address}, {doctor.hospitalInfo.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Categories */}
                                {doctor.category && doctor.category.length > 0 && (
                                    <div className='flex flex-wrap gap-1.5'>
                                        {doctor.category.slice(0, 4).map((cat, index) => (
                                            <Badge
                                                key={index}
                                                className='bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs'
                                            >
                                                {cat}
                                            </Badge>
                                        ))}
                                        {doctor.category.length > 4 && (
                                            <Badge className='bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs'>
                                                +{doctor.category.length - 4}
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Fees & Availability */}
                                <div className='grid grid-cols-2 gap-2.5 sm:gap-3'>
                                    <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 sm:p-4 text-white shadow-md'>
                                        <div className='text-xs text-blue-100 mb-1'>Consultation</div>
                                        <div className='text-xl sm:text-2xl font-bold'>{formatFees(doctor.fees)}</div>
                                    </div>

                                    {doctor.dailyTimeRanges && doctor.dailyTimeRanges.length > 0 && (
                                        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 sm:p-4 text-white shadow-md'>
                                            <div className='flex items-center gap-1 text-xs text-green-100 mb-1'>
                                                <Clock className='w-3 h-3' />
                                                Available
                                            </div>
                                            <div className='text-lg sm:text-xl font-bold'>
                                                {formatTime(doctor.dailyTimeRanges[0].start)}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className='grid grid-cols-3 gap-2 sm:gap-2.5'>
                                    <div className='bg-white border border-blue-100 rounded-xl p-2.5 sm:p-3 text-center shadow-sm'>
                                        <Users className='w-4 h-4 text-blue-600 mx-auto mb-1' />
                                        <div className='text-sm sm:text-base font-bold text-gray-900'>
                                            {mockData.totalPatients.toLocaleString()}+
                                        </div>
                                        <div className='text-[10px] sm:text-xs text-gray-600'>Patients</div>
                                    </div>
                                    <div className='bg-white border border-red-100 rounded-xl p-2.5 sm:p-3 text-center shadow-sm'>
                                        <Heart className='w-4 h-4 text-red-500 fill-red-500 mx-auto mb-1' />
                                        <div className='text-sm sm:text-base font-bold text-gray-900'>
                                            {mockData.satisfaction}%
                                        </div>
                                        <div className='text-[10px] sm:text-xs text-gray-600'>Happy</div>
                                    </div>
                                    <div className='bg-white border border-purple-100 rounded-xl p-2.5 sm:p-3 text-center shadow-sm'>
                                        <Timer className='w-4 h-4 text-purple-600 mx-auto mb-1' />
                                        <div className='text-sm sm:text-base font-bold text-gray-900'>
                                            {mockData.avgConsultationTime}m
                                        </div>
                                        <div className='text-[10px] sm:text-xs text-gray-600'>Time</div>
                                    </div>
                                </div>

                                {/* Book Button */}
                                <Button
                                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onBookAppointment?.(doctor);
                                    }}
                                >
                                    <Calendar className='w-4 h-4 mr-2' />
                                    Book Appointment
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ==================== BACK SIDE ==================== */}
                <Card className='absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-2xl overflow-hidden'>
                    <CardContent className='p-0 h-full'>
                        <div className='flex flex-col md:flex-row h-full'>
                            {/* LEFT - Quick Info */}
                            <div className='md:w-[38%] p-4 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-blue-700 to-blue-800 relative overflow-hidden border-r border-white/10'>
                                {/* Background Pattern */}
                                <div className='absolute inset-0 opacity-5'>
                                    <div className='absolute top-8 right-8 w-24 h-24 bg-white rounded-full blur-2xl'></div>
                                    <div className='absolute bottom-8 left-8 w-20 h-20 bg-white rounded-full blur-xl'></div>
                                </div>

                                <div className='relative z-10 space-y-3 sm:space-y-4'>
                                    {/* Header */}
                                    <div className='flex items-start justify-between'>
                                        <div>
                                            <h3 className='font-bold text-base sm:text-lg mb-0.5'>
                                                Dr. {doctor.name.split(" ")[doctor.name.split(" ").length - 1]}
                                            </h3>
                                            <p className='text-blue-200 text-xs'>{doctor.specialization}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsFlipped(false);
                                            }}
                                            className='bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all backdrop-blur-sm border border-white/20'
                                        >
                                            <RotateCcw className='w-4 h-4' />
                                        </button>
                                    </div>

                                    {/* Info Cards */}
                                    <div className='space-y-2 sm:space-y-2.5'>
                                        {doctor.qualification && (
                                            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white/20'>
                                                <div className='flex items-center gap-2 mb-1.5'>
                                                    <GraduationCap className='w-4 h-4 text-blue-300' />
                                                    <span className='text-xs font-semibold text-blue-200 uppercase'>
                                                        Qualification
                                                    </span>
                                                </div>
                                                <p className='text-sm font-medium'>{doctor.qualification}</p>
                                            </div>
                                        )}

                                        {doctor.experience && (
                                            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white/20'>
                                                <div className='flex items-center gap-2 mb-1.5'>
                                                    <Award className='w-4 h-4 text-amber-300' />
                                                    <span className='text-xs font-semibold text-amber-200 uppercase'>
                                                        Experience
                                                    </span>
                                                </div>
                                                <p className='text-lg sm:text-xl font-bold'>{doctor.experience} Years</p>
                                            </div>
                                        )}

                                        <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white/20'>
                                            <div className='flex items-center gap-2 mb-1.5'>
                                                <Mail className='w-4 h-4 text-purple-300' />
                                                <span className='text-xs font-semibold text-purple-200 uppercase'>
                                                    Email
                                                </span>
                                            </div>
                                            <p className='text-sm font-medium truncate'>{doctor.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFlipped(false);
                                    }}
                                    className='relative z-10 w-full bg-white text-blue-700 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg text-sm mt-4 sm:mt-0'
                                >
                                    <RotateCcw className='w-4 h-4' />
                                    Back
                                </button>
                            </div>

                            {/* RIGHT - Detailed Info */}
                            <div className='flex-1 p-4 sm:p-6 space-y-3 sm:space-y-3.5 flex flex-col'>
                                {/* About */}
                                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <MessageCircle className='w-4 h-4 text-blue-200' />
                                        <h4 className='font-bold text-sm uppercase'>About</h4>
                                    </div>
                                    <p className='text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-3'>
                                        {doctor.about ||
                                            "Experienced healthcare professional committed to delivering exceptional patient care with expertise and compassion."}
                                    </p>
                                </div>

                                {/* Practice Details */}
                                <div className='grid grid-cols-2 gap-2.5 sm:gap-3'>
                                    <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white/20'>
                                        <Timer className='w-4 h-4 text-orange-300 mb-1.5' />
                                        <span className='text-xs text-orange-200 block mb-1'>Waiting</span>
                                        <p className='text-base sm:text-lg font-bold'>{mockData.avgWaitingTime}</p>
                                    </div>

                                    <div className='bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-white/20'>
                                        <Clock className='w-4 h-4 text-emerald-300 mb-1.5' />
                                        <span className='text-xs text-emerald-200 block mb-1'>Consult</span>
                                        <p className='text-base sm:text-lg font-bold'>{mockData.avgConsultationTime}m</p>
                                    </div>
                                </div>

                                {/* Schedule */}
                                {doctor.dailyTimeRanges && doctor.dailyTimeRanges.length > 0 && (
                                    <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20'>
                                        <h5 className='font-bold text-xs uppercase mb-2 text-blue-200'>
                                            Schedule
                                        </h5>
                                        <div className='bg-white/10 rounded-lg p-2.5 sm:p-3 border border-white/10 flex items-center justify-between'>
                                            <div>
                                                <p className='text-lg sm:text-xl font-bold'>
                                                    {formatTime(doctor.dailyTimeRanges[0].start)}
                                                </p>
                                                <p className='text-xs text-white/60'>Start</p>
                                            </div>
                                            <div className='text-white/40'>→</div>
                                            <div className='text-right'>
                                                <p className='text-lg sm:text-xl font-bold'>
                                                    {formatTime(doctor.dailyTimeRanges[0].end)}
                                                </p>
                                                <p className='text-xs text-white/60'>End</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Satisfaction */}
                                <div className='bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl p-3 sm:p-4 border-2 border-green-400/50 flex-1'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <h5 className='font-bold text-sm uppercase mb-0.5'>Satisfaction</h5>
                                            <p className='text-xs text-white/80'>
                                                {mockData.totalReviews.toLocaleString()} reviews
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <div className='text-2xl sm:text-3xl font-extrabold'>{mockData.satisfaction}%</div>
                                            <div className='flex items-center justify-end gap-1'>
                                                <Star className='w-4 h-4 text-yellow-300 fill-yellow-300' />
                                                <span className='text-sm font-bold'>{mockData.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='grid grid-cols-2 gap-2.5 sm:gap-3'>
                                    <Button
                                        className='bg-white text-blue-700 hover:bg-blue-50 font-semibold py-2.5 rounded-xl text-sm'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewProfile?.(doctor);
                                        }}
                                    >
                                        Profile
                                    </Button>
                                    <Button
                                        className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl text-sm'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onBookAppointment?.(doctor);
                                        }}
                                    >
                                        <Calendar className='w-4 h-4 mr-1.5' />
                                        Book
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DoctorProfileCard;