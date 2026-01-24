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
    Phone,
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

    // Mock data for additional features (in real app, this would come from API)
    const mockData = {
        rating: 4.8,
        totalReviews: 1247,
        languages: ["English", "Hindi"],
        avgConsultationTime: doctor.slotDurationMinutes || 30,
        avgWaitingTime: "15-20 mins",
        nextAvailable: "Today, 2:30 PM",
        totalPatients: 2500,
        satisfaction: 96,
    };

    return (
        <div className='group w-full [perspective:1200px]'>
            <div
                className={`relative w-full h-[400px] transition-transform duration-700 [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
            >
                {/* Front Side - Horizontal Layout */}
                <Card className='absolute w-full h-full [backface-visibility:hidden] border-0 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 bg-white overflow-hidden rounded-3xl'>
                    <CardContent className='p-0 h-full flex'>
                        {/* Left Side - Header with gradient */}
                        <div className='relative bg-gradient-to-br from-blue-600 to-blue-700 w-2/5 text-white overflow-hidden flex-shrink-0'>
                            {/* Animated Background Pattern */}
                            <div className='absolute inset-0 opacity-10'>
                                <div className='absolute top-4 right-8 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse'></div>
                                <div className='absolute bottom-6 left-6 w-16 h-16 bg-white/15 rounded-full blur-lg'></div>
                                <div className='absolute top-1/2 right-1/4 w-8 h-8 bg-white/10 rounded-full'></div>
                            </div>

                            {/* Decorative grid pattern */}
                            <div className='absolute inset-0 opacity-5' style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}></div>

                            <div className='relative h-full flex flex-col justify-between p-6'>
                                <div>
                                    <div className='relative group/avatar mb-4'>
                                        <div className='absolute -inset-1 bg-blue-400 rounded-full opacity-75 blur group-hover/avatar:opacity-100 transition-opacity duration-300'></div>
                                        <Avatar className='relative w-24 h-24 border-4 border-white shadow-2xl ring-4 ring-white/40 mx-auto'>
                                            <AvatarImage
                                                src={doctor.profileImage}
                                                alt={doctor.name}
                                                className='object-cover'
                                            />
                                            <AvatarFallback className='bg-blue-500 text-white font-bold text-2xl'>
                                                {getInitials(doctor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {doctor.isVerified && (
                                            <div className='absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1.5 shadow-lg ring-2 ring-white'>
                                                <CheckCircle className='w-4 h-4 text-white' />
                                            </div>
                                        )}
                                    </div>

                                    <div className='text-center'>
                                        <h3 className='font-bold text-xl mb-1 tracking-tight'>
                                            {doctor.name}
                                        </h3>
                                        <p className='text-blue-100 text-sm flex items-center justify-center gap-1.5 mb-3 font-medium'>
                                            <Stethoscope className='w-4 h-4' />
                                            {doctor.specialization}
                                        </p>

                                        {/* Rating and Experience */}
                                        <div className='flex items-center justify-center gap-2 mb-3'>
                                            <div className='flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full'>
                                                <Star className='w-4 h-4 text-yellow-300 fill-current' />
                                                <span className='text-sm font-bold'>
                                                    {mockData.rating}
                                                </span>
                                                <span className='text-xs text-blue-200 font-medium'>
                                                    ({mockData.totalReviews.toLocaleString()})
                                                </span>
                                            </div>
                                            {doctor.experience && (
                                                <Badge className='bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 border-white/30 font-medium'>
                                                    <Calendar className='w-3 h-3 mr-1' />
                                                    {doctor.experience} yrs
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Languages */}
                                        <div className='flex flex-wrap justify-center gap-1.5 mb-4'>
                                            {mockData.languages.map((lang, index) => (
                                                <Badge
                                                    key={index}
                                                    className='bg-white/15 backdrop-blur-sm text-white text-xs px-2 py-0.5 border-white/20 font-medium'
                                                >
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Flip indicator */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFlipped(!isFlipped);
                                    }}
                                    className='w-full text-white/80 text-xs flex items-center justify-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 font-medium hover:bg-black/30 transition-colors'
                                >
                                    <RotateCcw className='w-3.5 h-3.5' />
                                    <span>Flip for Details</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Main Content */}
                        <div className='flex-1 p-5 flex flex-col justify-between overflow-hidden'>
                            <div className='space-y-3 flex-1'>
                                {/* Hospital Info */}
                                {doctor.hospitalInfo && (
                                    <div className='bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 border border-gray-200/50 shadow-sm'>
                                        <div className='flex items-start gap-2.5'>
                                            <div className='bg-blue-600 p-2 rounded-lg shadow-md flex-shrink-0'>
                                                <MapPin className='w-4 h-4 text-white' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-bold text-gray-900 text-xs mb-0.5'>
                                                    {doctor.hospitalInfo.name}
                                                </p>
                                                <p className='text-gray-600 text-[10px] leading-tight'>
                                                    {doctor.hospitalInfo.address}, {doctor.hospitalInfo.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Categories */}
                                {doctor.category && doctor.category.length > 0 && (
                                    <div className='flex flex-wrap gap-1.5'>
                                        {doctor.category.slice(0, 2).map((cat, index) => (
                                            <Badge
                                                key={index}
                                                className='bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-[10px] font-semibold'
                                            >
                                                {cat}
                                            </Badge>
                                        ))}
                                        {doctor.category.length > 2 && (
                                            <Badge className='bg-gray-100 text-gray-700 border-gray-300/50 px-2 py-1 text-[10px] font-medium'>
                                                +{doctor.category.length - 2}
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Fees and Availability */}
                                <div className='bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl p-3 border-2 border-emerald-200/50'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <div>
                                            <span className='text-xl font-extrabold text-emerald-700'>
                                                {formatFees(doctor.fees)}
                                            </span>
                                            <p className='text-[10px] text-emerald-600 font-semibold'>
                                                per consultation
                                            </p>
                                        </div>
                                        {doctor.dailyTimeRanges && doctor.dailyTimeRanges.length > 0 && (
                                            <div className='text-right bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-emerald-200/50'>
                                                <div className='flex items-center gap-1 text-[10px] text-emerald-700 font-bold'>
                                                    <Clock className='w-3 h-3' />
                                                    <span>Available</span>
                                                </div>
                                                <p className='text-[10px] text-emerald-600 font-semibold'>
                                                    {formatTime(doctor.dailyTimeRanges[0].start)} - {formatTime(doctor.dailyTimeRanges[0].end)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className='grid grid-cols-3 gap-1.5'>
                                    <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 text-center border border-blue-200/50'>
                                        <Users className='w-3.5 h-3.5 text-blue-600 mx-auto mb-1' />
                                        <p className='text-[10px] font-extrabold text-blue-700'>
                                            {mockData.totalPatients.toLocaleString()}+
                                        </p>
                                        <p className='text-[9px] text-blue-600 font-medium'>Patients</p>
                                    </div>
                                    <div className='bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg p-2 text-center border border-emerald-200/50'>
                                        <Heart className='w-3.5 h-3.5 text-emerald-600 fill-current mx-auto mb-1' />
                                        <p className='text-[10px] font-extrabold text-emerald-700'>
                                            {mockData.satisfaction}%
                                        </p>
                                        <p className='text-[9px] text-emerald-600 font-medium'>Satisfied</p>
                                    </div>
                                    <div className='bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg p-2 text-center border border-purple-200/50'>
                                        <Timer className='w-3.5 h-3.5 text-purple-600 mx-auto mb-1' />
                                        <p className='text-[10px] font-extrabold text-purple-700'>
                                            {mockData.avgConsultationTime}m
                                        </p>
                                        <p className='text-[9px] text-purple-600 font-medium'>Avg</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBookAppointment?.(doctor);
                                }}
                            >
                                <Calendar className='w-4 h-4 mr-2' />
                                Book Appointment
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Enhanced Back Side - Horizontal Layout */}
                <Card className='absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] border-0 shadow-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden rounded-3xl'>
                    <CardContent className='p-0 h-full flex'>
                        {/* Left Side - Header */}
                        <div className='relative w-2/5 overflow-hidden flex-shrink-0'>
                            {/* Animated Background Pattern */}
                            <div className='absolute inset-0 opacity-10'>
                                <div className='absolute top-2 right-6 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse'></div>
                                <div className='absolute bottom-4 left-8 w-12 h-12 bg-white/15 rounded-full blur-lg'></div>
                                <div className='absolute top-1/3 left-1/4 w-6 h-6 bg-white/10 rounded-full'></div>
                            </div>

                            {/* Decorative grid pattern */}
                            <div className='absolute inset-0 opacity-5' style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}></div>

                            <div className='relative h-full flex flex-col justify-between p-6'>
                                <div>
                                    <div className='flex items-center justify-between mb-4'>
                                        <div>
                                            <h3 className='font-bold text-lg mb-1 tracking-tight'>
                                                Dr. {doctor.name.split(" ")[0]}
                                            </h3>
                                            <p className='text-blue-200 text-xs font-medium'>
                                                {doctor.specialization}
                                            </p>
                                        </div>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all duration-300'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsFlipped(false);
                                            }}
                                        >
                                            <RotateCcw className='w-4 h-4' />
                                        </Button>
                                    </div>

                                    {/* Key Details Grid */}
                                    <div className='grid grid-cols-2 gap-2 mb-4'>
                                        {doctor.qualification && (
                                            <div className='bg-white/15 backdrop-blur-sm rounded-lg p-2.5 border border-white/20'>
                                                <div className='bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-lg p-1 w-fit mb-1'>
                                                    <GraduationCap className='w-3.5 h-3.5 text-blue-200' />
                                                </div>
                                                <p className='font-semibold text-[9px] text-blue-200 mb-0.5 uppercase'>Qualification</p>
                                                <p className='text-white text-[10px] font-medium line-clamp-2'>{doctor.qualification}</p>
                                            </div>
                                        )}

                                        <div className='bg-white/15 backdrop-blur-sm rounded-lg p-2.5 border border-white/20'>
                                            <div className='bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-lg p-1 w-fit mb-1'>
                                                <Mail className='w-3.5 h-3.5 text-purple-200' />
                                            </div>
                                            <p className='font-semibold text-[9px] text-purple-200 mb-0.5 uppercase'>Email</p>
                                            <p className='text-white text-[9px] font-medium truncate'>{doctor.email}</p>
                                        </div>

                                        {doctor.experience && (
                                            <div className='bg-white/15 backdrop-blur-sm rounded-lg p-2.5 border border-white/20'>
                                                <div className='bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-lg p-1 w-fit mb-1'>
                                                    <Award className='w-3.5 h-3.5 text-amber-200' />
                                                </div>
                                                <p className='font-semibold text-[9px] text-amber-200 mb-0.5 uppercase'>Experience</p>
                                                <p className='text-white text-xs font-bold'>{doctor.experience} yrs</p>
                                            </div>
                                        )}

                                        <div className='bg-white/15 backdrop-blur-sm rounded-lg p-2.5 border border-white/20'>
                                            <div className='bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-lg p-1 w-fit mb-1'>
                                                <Users className='w-3.5 h-3.5 text-emerald-200' />
                                            </div>
                                            <p className='font-semibold text-[9px] text-emerald-200 mb-0.5 uppercase'>Patients</p>
                                            <p className='text-white text-xs font-bold'>
                                                {mockData.totalPatients.toLocaleString()}+
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFlipped(false);
                                    }}
                                    className='w-full text-white/80 text-xs flex items-center justify-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 font-medium hover:bg-black/30 transition-colors'
                                >
                                    <RotateCcw className='w-3.5 h-3.5' />
                                    <span>Flip Back</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className='flex-1 p-5 flex flex-col justify-between overflow-hidden'>
                            <div className='space-y-2.5 flex-1'>
                                {/* About Section */}
                                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20'>
                                    <h4 className='font-bold mb-1.5 text-blue-100 flex items-center gap-1.5 text-[10px] uppercase'>
                                        <MessageCircle className='w-3 h-3' />
                                        About
                                    </h4>
                                    <p className='text-[10px] text-white/95 leading-relaxed font-medium line-clamp-3'>
                                        {doctor.about ||
                                            "Experienced healthcare professional dedicated to providing quality medical care."}
                                    </p>
                                </div>

                                {/* Appointment Details */}
                                <div className='grid grid-cols-2 gap-2'>
                                    <div className='bg-white/15 backdrop-blur-sm rounded-lg p-2.5 border border-white/20'>
                                        <div className='bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-lg p-1 w-fit mb-1'>
                                            <Timer className='w-3.5 h-3.5 text-orange-200' />
                                        </div>
                                        <p className='font-semibold text-[9px] text-orange-200 mb-0.5 uppercase'>Waiting</p>
                                        <p className='text-white font-bold text-[10px]'>
                                            {mockData.avgWaitingTime}
                                        </p>
                                    </div>

                                    <div className='bg-white/15 backdrop-blur-sm rounded-lg p-2.5 border border-white/20'>
                                        <div className='bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-lg p-1 w-fit mb-1'>
                                            <Clock className='w-3.5 h-3.5 text-emerald-200' />
                                        </div>
                                        <p className='font-semibold text-[9px] text-emerald-200 mb-0.5 uppercase'>Consult</p>
                                        <p className='text-white font-bold text-[10px]'>
                                            {mockData.avgConsultationTime}m
                                        </p>
                                    </div>
                                </div>

                                {/* Schedule */}
                                {doctor.dailyTimeRanges && doctor.dailyTimeRanges.length > 0 && (
                                    <div className='bg-white/15 backdrop-blur-sm rounded-lg p-2.5 border border-white/20'>
                                        <h5 className='font-bold text-[9px] text-blue-200 mb-1.5 uppercase'>Schedule</h5>
                                        <div className='flex items-center gap-1.5 text-[10px] mb-1 bg-white/10 rounded-lg px-2 py-1'>
                                            <Clock className='w-3 h-3 text-blue-300' />
                                            <span className='font-semibold'>
                                                {formatTime(doctor.dailyTimeRanges[0].start)} - {formatTime(doctor.dailyTimeRanges[0].end)}
                                            </span>
                                        </div>
                                        <p className='text-[9px] text-white/80 font-medium'>
                                            {doctor.slotDurationMinutes || 30} min slots
                                        </p>
                                    </div>
                                )}

                                {/* Satisfaction */}
                                <div className='bg-gradient-to-br from-emerald-500/25 via-green-500/20 to-teal-500/25 rounded-lg p-2.5 border-2 border-emerald-400/40'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-bold text-[10px] text-emerald-100 mb-0.5'>Satisfaction</p>
                                            <p className='text-[9px] text-emerald-200'>{mockData.totalReviews.toLocaleString()} reviews</p>
                                        </div>
                                        <div className='text-right bg-white/20 rounded-lg px-2 py-1 border border-white/30'>
                                            <p className='text-base font-extrabold text-emerald-100'>{mockData.satisfaction}%</p>
                                            <div className='flex items-center justify-end gap-0.5'>
                                                <Star className='w-2.5 h-2.5 text-yellow-300 fill-current' />
                                                <span className='text-[10px] text-emerald-100 font-bold'>{mockData.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='space-y-2'>
                                <Button
                                    className='w-full bg-white text-blue-700 hover:bg-gray-50 font-bold py-2 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-xs'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewProfile?.(doctor);
                                    }}
                                >
                                    <Users className='w-3.5 h-3.5 mr-1.5' />
                                    View Profile
                                </Button>
                                <Button
                                    variant='outline'
                                    className='w-full border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70 font-bold py-2 rounded-xl backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-xs'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onBookAppointment?.(doctor);
                                    }}
                                >
                                    <Calendar className='w-3.5 h-3.5 mr-1.5' />
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DoctorProfileCard;
