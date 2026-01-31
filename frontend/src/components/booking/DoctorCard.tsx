import React from "react";
import { Star, Award, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Doctor } from "./../../lib/types";

interface DoctorCardProps {
    doctor: Doctor;
    formatFees: (fees: number) => string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, formatFees }) => {
    return (
        <Card className='border-0 shadow-lg sm:shadow-xl bg-white rounded-xl sm:rounded-2xl overflow-hidden lg:sticky lg:top-24'>
            {/* Doctor Card Header */}
            <div className='h-16 sm:h-20 lg:h-24 bg-gradient-to-r from-blue-600 to-blue-700'></div>

            <CardContent className='px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6'>
                {/* Doctor Avatar */}
                <div className='flex justify-center -mt-8 sm:-mt-10 lg:-mt-12 mb-4 sm:mb-5'>
                    <Avatar className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-white shadow-md sm:shadow-lg'>
                        <AvatarImage
                            src={
                                doctor.profileImage ||
                                "https://images.unsplash.com/photo-1637121267710-3bab9c365538?w=500&q=80"
                            }
                            alt={doctor.name}
                        />
                        <AvatarFallback className='bg-blue-600 text-white text-sm sm:text-base lg:text-lg'>
                            {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Doctor Info */}
                <div className='text-center mb-4 sm:mb-5'>
                    <h2 className='text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 leading-tight truncate'>
                        {doctor.name}
                    </h2>
                    <p className='text-blue-600 font-semibold text-xs sm:text-sm'>
                        {doctor.qualification}
                    </p>
                    <p className='text-gray-600 text-xs sm:text-sm mt-1 truncate'>
                        {doctor.specialization}
                    </p>
                </div>

                {/* Rating & Reviews */}
                <div className='flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-200'>
                    <div className='flex items-center gap-0.5 sm:gap-1'>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className='fill-yellow-400 text-yellow-400 sm:w-3.5 sm:h-3.5'
                            />
                        ))}
                    </div>
                    <span className='text-xs text-gray-600 font-medium'>
                        4.8 (1247 reviews)
                    </span>
                </div>

                {/* Quick Stats */}
                <div className='space-y-3 sm:space-y-4 mb-4 sm:mb-5'>
                    <div className='flex items-start gap-2 sm:gap-3'>
                        <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                            <Award className='text-blue-600' size={16} />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <p className='text-xs text-gray-500 font-semibold uppercase'>
                                Experience
                            </p>
                            <p className='text-sm text-gray-900 font-semibold mt-0.5'>
                                {doctor.experience} years
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-2 sm:gap-3'>
                        <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                            <MapPin className='text-blue-600' size={16} />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <p className='text-xs text-gray-500 font-semibold uppercase'>
                                Hospital
                            </p>
                            <p className='text-sm text-gray-900 font-semibold mt-0.5 leading-tight'>
                                {doctor.hospitalInfo.name}
                            </p>
                            <p className='text-xs text-gray-600 mt-0.5 truncate'>
                                {doctor.hospitalInfo.city}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-2 sm:gap-3'>
                        <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                            <Clock className='text-blue-600' size={16} />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <p className='text-xs text-gray-500 font-semibold uppercase'>
                                Consultation Fee
                            </p>
                            <p className='text-sm text-gray-900 font-semibold mt-0.5'>
                                {formatFees(doctor.fees)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Specialties */}
                <div className='mb-4 sm:mb-5'>
                    <p className='text-xs text-gray-500 font-semibold uppercase mb-2'>
                        Specialities
                    </p>
                    <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                        {doctor.category.map((cat) => (
                            <Badge
                                key={cat}
                                variant='secondary'
                                className='bg-blue-100 text-blue-700 text-xs px-2 sm:px-2.5 py-1'
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* About */}
                <div className='p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl'>
                    <p className='text-xs text-gray-500 font-semibold uppercase mb-1.5 sm:mb-2'>
                        About Doctor
                    </p>
                    <p className='text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3 sm:line-clamp-4'>
                        {doctor.about}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DoctorCard;