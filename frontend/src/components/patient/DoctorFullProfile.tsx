"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Doctor } from "@/lib/types";
import { Header } from "../landing/Header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import {
    MapPin,
    Star,
    Clock,
    Award,
    Stethoscope,
    GraduationCap,
    Calendar,
    Mail,
    Phone,
    Users,
    MessageCircle,
    Heart,
    Timer,
    CheckCircle,
    ArrowLeft,
    Building2,
    Globe,
    Shield,
    ThumbsUp,
    Camera,
    FileText,
    TrendingUp,
    Activity,
    Zap,
    Award as AwardIcon,
    BookOpen,
    UserCheck,
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    MapPin as MapPinIcon,
    Phone as PhoneIcon,
    Mail as MailIcon,
    Star as StarIcon,
    Heart as HeartIcon,
    MessageSquare,
    Share2,
    Bookmark,
    ExternalLink,
} from "lucide-react";
import { useDoctorState } from "@/store/doctorStore";

const DoctorFullProfile: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const doctorId = params?.id as string;
    const { doctors, fetchDoctors } = useDoctorState();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (doctors.length === 0) {
            fetchDoctors({});
        }
    }, [doctors.length, fetchDoctors]);

    useEffect(() => {
        if (doctors.length > 0 && doctorId) {
            const foundDoctor = doctors.find((d) => d._id === doctorId);
            if (foundDoctor) {
                setDoctor(foundDoctor);
                setLoading(false);
            } else {
                // If not found in store, try fetching single doctor
                fetchDoctors({}).then(() => {
                    const found = doctors.find((d) => d._id === doctorId);
                    if (found) {
                        setDoctor(found);
                    }
                    setLoading(false);
                });
            }
        }
    }, [doctors, doctorId, fetchDoctors]);

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

    // Enhanced mock data
    const mockData = {
        rating: 4.8,
        totalReviews: 1247,
        languages: ["English", "Hindi", "Gujarati"],
        avgConsultationTime: doctor?.slotDurationMinutes || 30,
        avgWaitingTime: "15-20 mins",
        nextAvailable: "Today, 2:30 PM",
        totalPatients: 2500,
        satisfaction: 96,
        responseTime: "Usually responds in 2 hours",
        experience: doctor?.experience || 8,
        awards: ["Best Doctor 2023", "Patient Choice Award", "Excellence in Healthcare"],
        certifications: ["MBBS", "MD Internal Medicine", "Board Certified"],
        specialAchievements: [
            "Published 15+ research papers",
            "Led 50+ successful surgeries",
            "Mentored 20+ medical students",
        ],
        patientReviews: [
            {
                id: 1,
                name: "Rajesh Kumar",
                rating: 5,
                date: "2024-01-15",
                comment: "Excellent doctor! Very thorough and caring. Highly recommended.",
                helpful: 12,
            },
            {
                id: 2,
                name: "Priya Sharma",
                rating: 5,
                date: "2024-01-10",
                comment: "Dr. Smith is amazing. She took time to explain everything clearly.",
                helpful: 8,
            },
            {
                id: 3,
                name: "Amit Patel",
                rating: 4,
                date: "2024-01-08",
                comment:
                    "Good experience overall. Waiting time was a bit long but doctor was excellent.",
                helpful: 5,
            },
        ],
        gallery: [
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
            "/api/placeholder/300/200",
        ],
    };

    const tabTriggerClass = `
        flex items-center justify-center
        gap-1.5 sm:gap-2
        rounded-lg sm:rounded-xl
        font-semibold
        px-3 sm:px-6
        py-2 sm:py-3
        text-xs sm:text-sm
        transition-all duration-300
        data-[state=active]:bg-blue-600
        data-[state=active]:text-white
        data-[state=active]:shadow-lg
        `;


    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
                <Header showDashboardNav />
                <div className='flex justify-center items-center min-h-[80vh]'>
                    <div className='relative'>
                        <div className='animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600'></div>
                        <div
                            className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin'
                            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
                <Header showDashboardNav />
                <div className='flex flex-col justify-center items-center min-h-[80vh] px-4'>
                    <div className='text-center'>
                        <div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <Stethoscope className='w-12 h-12 text-red-600' />
                        </div>
                        <h2 className='text-3xl font-bold text-gray-800 mb-4'>Doctor Not Found</h2>
                        <p className='text-gray-600 mb-8 max-w-md'>
                            We couldnt find the doctor you are looking for. They may have been
                            removed or the link might be incorrect.
                        </p>
                        <Button
                            onClick={() => router.push("/doctor-list")}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg'
                        >
                            <ArrowLeft className='w-5 h-5 mr-2' />
                            Back to Doctor List
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
            <Header showDashboardNav />

            {/* Enhanced Hero Section */}
            <div className='relative bg-gradient-to-br from-blue-600 to-blue-700 text-white mt-8 overflow-hidden'>
                {/* Animated Background with Grid Pattern */}
                <div className='absolute inset-0'>
                    <div className='absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse'></div>
                    <div
                        className='absolute bottom-20 left-20 w-80 h-80 bg-white/8 rounded-full blur-2xl animate-pulse'
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-xl animate-pulse'
                        style={{ animationDelay: "2s" }}
                    ></div>
                    {/* Grid Pattern Overlay */}
                    <div 
                        className='absolute inset-0 opacity-5'
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }}
                    ></div>
                </div>

                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16'>
                    <Button
                        variant='ghost'
                        className='mb-6 lg:mb-8 text-white hover:bg-white/20 rounded-xl px-4 py-2.5 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40'
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className='w-5 h-5 mr-2' />
                        Back to Search
                    </Button>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center'>
                        {/* Doctor Info */}
                        <div className='space-y-6'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
                                <div className='relative group'>
                                    <div className='absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full opacity-60 blur-2xl group-hover:opacity-80 transition-opacity duration-500 animate-pulse'></div>
                                    <div className='relative'>
                                        <Avatar className='relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-4 border-white shadow-2xl ring-4 ring-white/50 transition-transform duration-300 group-hover:scale-105'>
                                            <AvatarImage
                                                src={doctor.profileImage}
                                                alt={doctor.name}
                                                className='object-cover'
                                            />
                                            <AvatarFallback className='bg-blue-500 text-white font-bold text-2xl sm:text-3xl'>
                                                {getInitials(doctor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {doctor.isVerified && (
                                            <div className='absolute -bottom-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-2.5 sm:p-3 shadow-xl ring-4 ring-white animate-bounce'>
                                                <CheckCircle className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight'>
                                            {doctor.name}
                                        </h1>
                                    </div>
                                    <p className='text-blue-100 text-lg sm:text-xl flex items-center gap-2 mb-4 font-medium'>
                                        <Stethoscope className='w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0' />
                                        <span className='truncate'>{doctor.specialization}</span>
                                    </p>

                                    {/* Rating and Experience */}
                                    <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-4'>
                                        <div className='flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20'>
                                            <Star className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-current flex-shrink-0' />
                                            <span className='text-base sm:text-lg font-bold'>
                                                {mockData.rating}
                                            </span>
                                            <span className='text-xs sm:text-sm text-blue-200'>
                                                ({mockData.totalReviews.toLocaleString()})
                                            </span>
                                        </div>
                                        <Badge className='bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-white/30 font-medium'>
                                            <Calendar className='w-3 h-3 sm:w-4 sm:h-4 mr-1.5' />
                                            {mockData.experience} yrs
                                        </Badge>
                                        <Badge className='bg-emerald-500/20 backdrop-blur-sm text-emerald-200 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-emerald-400/30 font-medium'>
                                            <Shield className='w-3 h-3 sm:w-4 sm:h-4 mr-1.5' />
                                            Verified
                                        </Badge>
                                    </div>

                                    {/* Languages */}
                                    <div className='flex flex-wrap gap-2'>
                                        {mockData.languages.map((lang, index) => (
                                            <Badge
                                                key={index}
                                                className='bg-white/15 backdrop-blur-sm text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1 border-white/20 font-medium'
                                            >
                                                <Globe className='w-3 h-3 mr-1' />
                                                {lang}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons & Quick Info */}
                        <div className='space-y-4 sm:space-y-6'>
                            {/* Key Stats */}
                            <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                                <div className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300'>
                                    <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                        <Users className='w-5 h-5 sm:w-6 sm:h-6 text-blue-300' />
                                        <span className='text-xs sm:text-sm font-medium text-blue-200'>
                                            Patients
                                        </span>
                                    </div>
                                    <p className='text-xl sm:text-2xl font-bold'>
                                        {mockData.totalPatients.toLocaleString()}+
                                    </p>
                                </div>
                                <div className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300'>
                                    <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                        <Heart className='w-5 h-5 sm:w-6 sm:h-6 text-red-300 fill-current' />
                                        <span className='text-xs sm:text-sm font-medium text-red-200'>
                                            Satisfaction
                                        </span>
                                    </div>
                                    <p className='text-xl sm:text-2xl font-bold'>{mockData.satisfaction}%</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='space-y-3 sm:space-y-4'>
                                <Button
                                    size='lg'
                                    className='w-full bg-white text-indigo-700 hover:bg-gray-50 font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base sm:text-lg transform hover:scale-[1.02] active:scale-[0.98]'
                                    onClick={() => {
                                        router.push(`/patient/booking/${doctor._id}`);
                                    }}
                                >
                                    <Calendar className='w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3' />
                                    Book Appointment
                                    <span className='ml-2 text-xs sm:text-sm font-normal text-blue-600'>
                                        • {formatFees(doctor.fees)}
                                    </span>
                                </Button>

                                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                                    <Button
                                        variant='outline'
                                        size='lg'
                                        className='border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
                                    >
                                        <MessageSquare className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2' />
                                        Message
                                    </Button>
                                    <Button
                                        variant='outline'
                                        size='lg'
                                        className='border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
                                    >
                                        <Share2 className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2' />
                                        Share
                                    </Button>
                                </div>
                            </div>

                            {/* Next Available */}
                            <div className='bg-emerald-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-emerald-400/30 hover:bg-emerald-500/25 transition-all duration-300'>
                                <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                    <Clock className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-300' />
                                    <span className='text-xs sm:text-sm font-medium text-emerald-200'>
                                        Next Available
                                    </span>
                                </div>
                                <p className='text-base sm:text-lg font-bold text-white'>
                                    {mockData.nextAvailable}
                                </p>
                                <p className='text-xs sm:text-sm text-emerald-200'>
                                    Avg. waiting: {mockData.avgWaitingTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Tabs */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                    <TabsList
                        className="
                        w-full
                        grid grid-cols-2
                        sm:flex sm:w-fit
                        gap-2
                        bg-white
                        border border-gray-200
                        rounded-xl sm:rounded-2xl
                        p-1.5
                        shadow-lg
                        mb-6 sm:mb-8
                        "
                    >
                        <TabsTrigger value="overview" className={tabTriggerClass}>
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Overview</span>
                        <span className="sm:hidden">Info</span>
                        </TabsTrigger>

                        <TabsTrigger value="reviews" className={tabTriggerClass}>
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Reviews
                        </TabsTrigger>

                        <TabsTrigger value="gallery" className={tabTriggerClass}>
                        <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Gallery
                        </TabsTrigger>

                        <TabsTrigger value="location" className={tabTriggerClass}>
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Location
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value='overview' className='space-y-6 sm:space-y-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
                            {/* Main Content */}
                            <div className='lg:col-span-2 space-y-6 sm:space-y-8'>
                                {/* About Section */}
                                <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                    <CardHeader className='pb-4'>
                                        <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                            <div className='bg-blue-600 p-2 rounded-lg'>
                                                <MessageCircle className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
                                            </div>
                                            About Doctor
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='pt-0'>
                                        <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-6'>
                                            {doctor.about ||
                                                "Experienced healthcare professional dedicated to providing quality medical care and personalized treatment plans tailored to each patient's unique needs. With years of expertise in the field, committed to delivering compassionate and comprehensive healthcare services."}
                                        </p>

                                        {/* Key Highlights */}
                                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
                                            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow duration-300'>
                                                <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                                    <Award className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                                                    <span className='font-semibold text-blue-900 text-sm sm:text-base'>
                                                        Experience
                                                    </span>
                                                </div>
                                                <p className='text-blue-700 text-sm sm:text-base'>
                                                    {mockData.experience} years in practice
                                                </p>
                                            </div>
                                            <div className='bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200 hover:shadow-md transition-shadow duration-300'>
                                                <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                                    <Heart className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 fill-current' />
                                                    <span className='font-semibold text-emerald-900 text-sm sm:text-base'>
                                                        Patients
                                                    </span>
                                                </div>
                                                <p className='text-emerald-700 text-sm sm:text-base'>
                                                    {mockData.totalPatients.toLocaleString()}+
                                                    treated
                                                </p>
                                            </div>
                                            <div className='bg-blue-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow duration-300'>
                                                <div className='flex items-center gap-2 sm:gap-3 mb-2'>
                                                    <Zap className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                                                    <span className='font-semibold text-blue-900 text-sm sm:text-base'>
                                                        Response
                                                    </span>
                                                </div>
                                                <p className='text-blue-700 text-sm sm:text-base'>
                                                    {mockData.responseTime}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Specializations & Categories */}
                                {doctor.category && doctor.category.length > 0 && (
                                    <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                        <CardHeader className='pb-4'>
                                            <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                            <div className='bg-blue-600 p-2 rounded-lg'>
                                                <Stethoscope className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
                                            </div>
                                                Specializations & Categories
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className='pt-0'>
                                            <div className='flex flex-wrap gap-2 sm:gap-3'>
                                                {doctor.category.map((cat, index) => (
                                                    <Badge
                                                        key={index}
                                                        className='bg-blue-50 text-blue-700 border border-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300'
                                                    >
                                                        {cat}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Certifications & Awards */}
                                <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                    <CardHeader className='pb-4'>
                                        <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                            <div className='bg-blue-600 p-2 rounded-lg'>
                                                <AwardIcon className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
                                            </div>
                                            Certifications & Achievements
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='pt-0'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                                            <div>
                                                <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base'>
                                                    <BookOpen className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                                                    Certifications
                                                </h4>
                                                <div className='space-y-2'>
                                                    {mockData.certifications.map((cert, index) => (
                                                        <div
                                                            key={index}
                                                            className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-300'
                                                        >
                                                            <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0' />
                                                            <span className='text-blue-800 font-medium text-sm sm:text-base'>
                                                                {cert}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base'>
                                                    <Award className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600' />
                                                    Awards & Recognition
                                                </h4>
                                                <div className='space-y-2'>
                                                    {mockData.awards.map((award, index) => (
                                                        <div
                                                            key={index}
                                                            className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors duration-300'
                                                        >
                                                            <Award className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0' />
                                                            <span className='text-purple-800 font-medium text-sm sm:text-base'>
                                                                {award}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Availability Schedule */}
                                {doctor.dailyTimeRange && doctor.dailyTimeRange.length > 0 && (
                                    <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                        <CardHeader className='pb-4'>
                                            <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                                <div className='bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg'>
                                                    <Clock className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
                                                </div>
                                                Availability Schedule
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className='pt-0'>
                                            <div className='space-y-3 sm:space-y-4'>
                                                {doctor.dailyTimeRange.map((range, index) => (
                                                    <div
                                                        key={index}
                                                        className='bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-300'
                                                    >
                                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3'>
                                                            <div className='flex items-center gap-2 sm:gap-3'>
                                                                <div className='bg-emerald-100 p-2 rounded-full'>
                                                                    <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-emerald-600' />
                                                                </div>
                                                                <div>
                                                                    <span className='font-bold text-gray-900 text-base sm:text-lg'>
                                                                        {formatTime(range.start)} -{" "}
                                                                        {formatTime(range.end)}
                                                                    </span>
                                                                    <p className='text-emerald-700 text-xs sm:text-sm'>
                                                                        Daily Schedule
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge className='bg-emerald-100 text-emerald-700 border-emerald-300 px-3 sm:px-4 py-1.5 sm:py-2 w-fit'>
                                                                <CheckCircle className='w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2' />
                                                                Available
                                                            </Badge>
                                                        </div>
                                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm'>
                                                            <div className='flex items-center gap-2'>
                                                                <Timer className='w-4 h-4 text-emerald-600 flex-shrink-0' />
                                                                <span className='text-gray-700'>
                                                                    Slot: {doctor.slotDurationMinutes || 30} mins
                                                                </span>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <Users className='w-4 h-4 text-emerald-600 flex-shrink-0' />
                                                                <span className='text-gray-700'>
                                                                    Avg. Waiting: {mockData.avgWaitingTime}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className='space-y-4 sm:space-y-6'>
                                {/* Fees Card */}
                                <Card className='shadow-xl border-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:shadow-2xl transition-shadow duration-300'>
                                    <CardContent className='p-4 sm:p-6'>
                                        <div className='text-center'>
                                            <div className='bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200 mb-4'>
                                                <h3 className='text-base sm:text-lg font-bold text-emerald-900 mb-2'>
                                                    Consultation Fee
                                                </h3>
                                                <span className='text-3xl sm:text-4xl font-extrabold text-emerald-700'>
                                                    {formatFees(doctor.fees)}
                                                </span>
                                                <p className='text-emerald-600 font-semibold mt-1 text-sm sm:text-base'>
                                                    per consultation
                                                </p>
                                            </div>
                                            <Button
                                                className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]'
                                                onClick={() =>
                                                    router.push(`/patient/booking/${doctor._id}`) 
                                                }
                                            >
                                                <Calendar className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                                                Book Now
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                    <CardHeader className='pb-4'>
                                        <CardTitle className='text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2'>
                                            <div className='bg-blue-600 p-1.5 rounded-lg'>
                                                <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                                            </div>
                                            Quick Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='pt-0 space-y-3 sm:space-y-4'>
                                        <div className='flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors duration-300'>
                                            <div className='flex items-center gap-2 sm:gap-3'>
                                                <Users className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                                                <span className='font-medium text-gray-700 text-sm sm:text-base'>
                                                    Total Patients
                                                </span>
                                            </div>
                                            <span className='font-bold text-blue-700 text-base sm:text-lg'>
                                                {mockData.totalPatients.toLocaleString()}+
                                            </span>
                                        </div>
                                        <div className='flex items-center justify-between p-3 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors duration-300'>
                                            <div className='flex items-center gap-2 sm:gap-3'>
                                                <Heart className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 fill-current' />
                                                <span className='font-medium text-gray-700 text-sm sm:text-base'>
                                                    Satisfaction
                                                </span>
                                            </div>
                                            <span className='font-bold text-emerald-700 text-base sm:text-lg'>
                                                {mockData.satisfaction}%
                                            </span>
                                        </div>
                                        <div className='flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors duration-300'>
                                            <div className='flex items-center gap-2 sm:gap-3'>
                                                <Timer className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600' />
                                                <span className='font-medium text-gray-700 text-sm sm:text-base'>
                                                    Avg Consultation
                                                </span>
                                            </div>
                                            <span className='font-bold text-blue-700 text-base sm:text-lg'>
                                                {mockData.avgConsultationTime} mins
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact Information */}
                                <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                    <CardHeader className='pb-4'>
                                        <CardTitle className='text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2'>
                                            <div className='bg-blue-600 p-1.5 rounded-lg'>
                                                <Phone className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                                            </div>
                                            Contact Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='pt-0 space-y-3'>
                                        <div className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-300'>
                                            <Mail className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0' />
                                            <span className='text-xs sm:text-sm text-gray-700 break-all'>
                                                {doctor.email}
                                            </span>
                                        </div>
                                        {doctor.qualification && (
                                            <div className='flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-300'>
                                                <GraduationCap className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0' />
                                                <span className='text-xs sm:text-sm text-gray-700'>
                                                    {doctor.qualification}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Patient Satisfaction */}
                                <Card className='shadow-xl border-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 hover:shadow-2xl transition-shadow duration-300'>
                                    <CardContent className='p-4 sm:p-6'>
                                        <div className='text-center'>
                                            <h3 className='text-base sm:text-lg font-bold text-emerald-900 mb-3 sm:mb-4'>
                                                Patient Satisfaction
                                            </h3>
                                            <div className='flex items-center justify-center gap-2 mb-2 sm:mb-3'>
                                                <Star className='w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current' />
                                                <span className='text-2xl sm:text-3xl font-extrabold text-emerald-700'>
                                                    {mockData.rating}
                                                </span>
                                            </div>
                                            <p className='text-emerald-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base'>
                                                Based on {mockData.totalReviews.toLocaleString()}{" "}
                                                reviews
                                            </p>
                                            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-emerald-200'>
                                                <div className='flex items-center justify-between mb-2'>
                                                    <span className='text-xs sm:text-sm font-medium text-emerald-700'>
                                                        Satisfaction Rate
                                                    </span>
                                                    <span className='text-xs sm:text-sm font-bold text-emerald-700'>
                                                        {mockData.satisfaction}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={mockData.satisfaction}
                                                    className='h-2 bg-emerald-100'
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Reviews Tab */}
                    <TabsContent value='reviews' className='space-y-6'>
                        <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                            <CardHeader>
                                <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                    <div className='bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg'>
                                        <Star className='w-5 h-5 sm:w-7 sm:h-7 text-white fill-current' />
                                    </div>
                                    Patient Reviews ({mockData.totalReviews.toLocaleString()})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4 sm:space-y-6'>
                                {mockData.patientReviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className='border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0 last:pb-0 hover:bg-gray-50/50 rounded-lg p-3 sm:p-4 transition-colors duration-300'
                                    >
                                        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3'>
                                            <div className='flex items-center gap-3'>
                                                <Avatar className='w-10 h-10 sm:w-12 sm:h-12'>
                                                    <AvatarFallback className='bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 font-semibold'>
                                                        {review.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className='font-semibold text-gray-900 text-sm sm:text-base'>
                                                        {review.name}
                                                    </p>
                                                    <p className='text-xs sm:text-sm text-gray-500'>
                                                        {review.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className='text-gray-700 mb-3 text-sm sm:text-base leading-relaxed'>{review.comment}</p>
                                        <div className='flex items-center gap-4'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 h-auto rounded-lg transition-colors duration-300'
                                            >
                                                <ThumbsUp className='w-4 h-4 mr-1.5' />
                                                <span className='text-xs sm:text-sm'>Helpful ({review.helpful})</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Gallery Tab */}
                    <TabsContent value='gallery' className='space-y-6'>
                        <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                            <CardHeader>
                                <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                    <div className='bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg'>
                                        <Camera className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
                                    </div>
                                    Clinic Gallery
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'>
                                    {mockData.gallery.map((image, index) => (
                                        <div key={index} className='relative group cursor-pointer'>
                                            <div className='aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300'>
                                                <img
                                                    src={image}
                                                    alt={`Clinic ${index + 1}`}
                                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                                />
                                            </div>
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/80 transition-all duration-300 rounded-xl flex items-end justify-center pb-2'>
                                                <ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Location Tab */}
                    <TabsContent value='location' className='space-y-6'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                            <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                <CardHeader>
                                    <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                            <div className='bg-blue-600 p-2 rounded-lg'>
                                                <MapPin className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
                                            </div>
                                        Hospital Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {doctor.hospitalInfo && (
                                        <div className='space-y-4'>
                                            <div className='flex items-start gap-3 sm:gap-4'>
                                                <div className='bg-blue-600 p-2.5 sm:p-3 rounded-xl shadow-md'>
                                                    <Building2 className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-bold text-gray-900 text-lg sm:text-xl mb-1'>
                                                        {doctor.hospitalInfo.name}
                                                    </p>
                                                    <p className='text-gray-600 text-base sm:text-lg'>
                                                        {doctor.hospitalInfo.address},{" "}
                                                        {doctor.hospitalInfo.city}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200'>
                                                <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>
                                                    <strong className='text-gray-900'>Address:</strong>{" "}
                                                    {doctor.hospitalInfo.address}
                                                    <br />
                                                    <strong className='text-gray-900'>City:</strong>{" "}
                                                    {doctor.hospitalInfo.city}
                                                    <br />
                                                    <strong className='text-gray-900'>State:</strong> Gujarat, India
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className='shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300'>
                                <CardHeader>
                                    <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3'>
                                            <div className='bg-blue-600 p-2 rounded-lg'>
                                                <MapPin className='w-5 h-5 sm:w-7 sm:h-7 text-white' />
                                            </div>
                                        How to Reach
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-3 sm:space-y-4'>
                                    <div className='space-y-2 sm:space-y-3'>
                                        <div className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-300'>
                                            <div className='bg-blue-100 p-1.5 sm:p-2 rounded-full'>
                                                <MapPin className='w-3 h-3 sm:w-4 sm:h-4 text-blue-600' />
                                            </div>
                                            <div>
                                                <p className='font-medium text-blue-900 text-sm sm:text-base'>
                                                    Nearest Landmark
                                                </p>
                                                <p className='text-xs sm:text-sm text-blue-700'>
                                                    City Center Mall, 2km away
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors duration-300'>
                                            <div className='bg-green-100 p-1.5 sm:p-2 rounded-full'>
                                                <Activity className='w-3 h-3 sm:w-4 sm:h-4 text-green-600' />
                                            </div>
                                            <div>
                                                <p className='font-medium text-green-900 text-sm sm:text-base'>
                                                    Parking Available
                                                </p>
                                                <p className='text-xs sm:text-sm text-green-700'>
                                                    Free parking for patients
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-300'>
                                            <div className='bg-blue-100 p-1.5 sm:p-2 rounded-full'>
                                                <Clock className='w-3 h-3 sm:w-4 sm:h-4 text-blue-600' />
                                            </div>
                                            <div>
                                                <p className='font-medium text-blue-900 text-sm sm:text-base'>
                                                    Best Time to Visit
                                                </p>
                                                <p className='text-xs sm:text-sm text-blue-700'>
                                                    Morning hours (9 AM - 11 AM)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DoctorFullProfile;
