import React from "react";
import {
    Calendar,
    Clock,
    Video,
    Phone,
    ChevronLeft,
    Loader,
    Lock,
    Check,
    CreditCard,
    Shield,
    IndianRupee,
    Receipt,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BookingFormData, Doctor } from "./../../lib/types";

interface PaymentStepProps {
    doctor: Doctor;
    formData: BookingFormData;
    selectedDateDisplay: string;
    formatTime: (time: string) => string;
    formatFees: (fees: number) => string;
    consultationFee: number;
    platformFee: number;
    gst: number;
    totalAmount: number;
    handlePayment: () => Promise<void>;
    paymentLoading: boolean;
    setStep: (step: number) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
    doctor,
    formData,
    selectedDateDisplay,
    formatTime,
    formatFees,
    consultationFee,
    platformFee,
    gst,
    totalAmount,
    handlePayment,
    paymentLoading,
    setStep,
}) => {
    return (
        <div className='space-y-4 sm:space-y-5'>
            {/* Progress Indicator */}
            <div className='flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4'>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-md'>
                        <Check size={14} />
                    </div>
                    <span className='text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap'>
                        Date & Time
                    </span>
                </div>
                <div className='w-8 sm:w-12 md:w-16 h-0.5 bg-green-500'></div>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-md'>
                        <Check size={14} />
                    </div>
                    <span className='text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap'>
                        Details
                    </span>
                </div>
                <div className='w-8 sm:w-12 md:w-16 h-0.5 bg-blue-600'></div>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-md'>
                        3
                    </div>
                    <span className='text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap'>
                        Payment
                    </span>
                </div>
            </div>

            {/* Payment Header */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200'>
                <CardHeader className='pb-3 sm:pb-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center'>
                                <CreditCard size={20} className='text-white' />
                            </div>
                            <div>
                                <CardTitle className='text-gray-900 text-lg sm:text-xl'>Complete Payment</CardTitle>
                                <p className='text-xs sm:text-sm text-gray-600'>Secure payment powered by Razorpay</p>
                            </div>
                        </div>
                        <Badge className='bg-green-100 text-green-800 border-green-200'>
                            <Shield size={12} className='mr-1' />
                            Secure
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Appointment Details */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white'>
                <CardHeader className='pb-3 sm:pb-4'>
                    <CardTitle className='flex items-center gap-2 text-gray-900 text-base sm:text-lg'>
                        <Receipt size={18} className='text-blue-600' />
                        Appointment Details
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Doctor Info */}
                    <div className='flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                        <Avatar className='w-10 h-10 sm:w-12 sm:h-12 border-2 border-white'>
                            <AvatarImage src={doctor.profileImage} />
                            <AvatarFallback className='bg-blue-100 text-blue-600'>
                                {doctor.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h3 className='font-bold text-gray-900 text-sm sm:text-base'>{doctor.name}</h3>
                            <p className='text-xs sm:text-sm text-gray-600'>{doctor.specialization}</p>
                            <p className='text-xs text-gray-500'>{doctor.qualification}</p>
                        </div>
                        <Badge variant='outline' className='bg-blue-100 text-blue-700 border-blue-200'>
                            {doctor.experience} yrs exp
                        </Badge>
                    </div>

                    {/* Appointment Details */}
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between py-2 border-b border-gray-100'>
                            <div className='flex items-center gap-2 text-gray-700'>
                                <Calendar size={14} className='text-blue-600' />
                                <span className='text-xs sm:text-sm'>Date</span>
                            </div>
                            <span className='font-semibold text-gray-900 text-xs sm:text-sm'>
                                {selectedDateDisplay}
                            </span>
                        </div>
                        <div className='flex items-center justify-between py-2 border-b border-gray-100'>
                            <div className='flex items-center gap-2 text-gray-700'>
                                <Clock size={14} className='text-blue-600' />
                                <span className='text-xs sm:text-sm'>Time</span>
                            </div>
                            <span className='font-semibold text-gray-900 text-xs sm:text-sm'>
                                {formatTime(formData.time)}
                            </span>
                        </div>
                        <div className='flex items-center justify-between py-2 border-b border-gray-100'>
                            <div className='flex items-center gap-2 text-gray-700'>
                                {formData.appointmentType === 'video' ? 
                                    <Video size={14} className='text-blue-600' /> : 
                                    <Phone size={14} className='text-blue-600' />
                                }
                                <span className='text-xs sm:text-sm'>Consultation Type</span>
                            </div>
                            <span className='font-semibold text-gray-900 capitalize text-xs sm:text-sm'>
                                {formData.appointmentType} Call
                            </span>
                        </div>
                        <div className='flex items-center justify-between py-2 border-b border-gray-100'>
                            <div className='flex items-center gap-2 text-gray-700'>
                                <Clock size={14} className='text-blue-600' />
                                <span className='text-xs sm:text-sm'>Duration</span>
                            </div>
                            <span className='font-semibold text-gray-900 text-xs sm:text-sm'>
                                {doctor.slotDurationMinutes} minutes
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Breakdown */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white'>
                <CardHeader className='pb-3 sm:pb-4'>
                    <CardTitle className='flex items-center gap-2 text-gray-900 text-base sm:text-lg'>
                        <IndianRupee size={18} className='text-blue-600' />
                        Payment Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <div className='flex items-center justify-between py-2'>
                        <span className='text-sm text-gray-600'>Doctor Consultation Fee</span>
                        <span className='font-medium text-gray-900'>{formatFees(consultationFee)}</span>
                    </div>
                    <div className='flex items-center justify-between py-2 border-t border-gray-100'>
                        <span className='text-sm text-gray-600'>Platform Fee</span>
                        <span className='font-medium text-gray-900'>{formatFees(platformFee)}</span>
                    </div>
                    <div className='flex items-center justify-between py-2 border-t border-gray-100'>
                        <span className='text-sm text-gray-600'>GST (18%)</span>
                        <span className='font-medium text-gray-900'>{formatFees(gst)}</span>
                    </div>
                    <div className='flex items-center justify-between py-3 border-t border-gray-200'>
                        <span className='text-base font-bold text-gray-900'>Total Amount</span>
                        <span className='text-lg sm:text-xl font-bold text-blue-600'>{formatFees(totalAmount)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Security & Refund Policy */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-green-50 border-2 border-green-100'>
                <CardContent className='p-4 sm:p-5'>
                    <div className='space-y-3'>
                        <div className='flex items-start gap-3'>
                            <Shield size={18} className='text-green-600 flex-shrink-0 mt-0.5' />
                            <div>
                                <h4 className='font-semibold text-green-800 text-sm mb-1'>100% Secure Payment</h4>
                                <p className='text-xs text-green-700'>
                                    Your payment is secured with bank-level encryption. We never store your card details.
                                </p>
                            </div>
                        </div>
                        <div className='flex items-start gap-3'>
                            <Clock size={18} className='text-green-600 flex-shrink-0 mt-0.5' />
                            <div>
                                <h4 className='font-semibold text-green-800 text-sm mb-1'>Easy Refund Policy</h4>
                                <p className='text-xs text-green-700'>
                                    Full refund if cancelled 24 hours before appointment. Partial refund for later cancellations.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Options */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white'>
                <CardHeader className='pb-3 sm:pb-4'>
                    <CardTitle className='text-gray-900 text-base sm:text-lg'>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between p-4 border-2 border-blue-200 bg-blue-50 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center'>
                                    <CreditCard size={20} className='text-blue-600' />
                                </div>
                                <div>
                                    <p className='font-semibold text-gray-900'>Credit/Debit Cards</p>
                                    <p className='text-xs text-gray-600'>Visa, Mastercard, RuPay, Amex</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-1'>
                                <div className='w-6 h-4 bg-blue-500 rounded-sm'></div>
                                <div className='w-6 h-4 bg-yellow-500 rounded-sm'></div>
                                <div className='w-6 h-4 bg-red-500 rounded-sm'></div>
                                <div className='w-6 h-4 bg-purple-500 rounded-sm'></div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                                    <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none'>
                                        <path d='M6 12H18M12 6V18' stroke='#4B5563' strokeWidth='2' strokeLinecap='round'/>
                                    </svg>
                                </div>
                                <div>
                                    <p className='font-semibold text-gray-900'>UPI</p>
                                    <p className='text-xs text-gray-600'>Google Pay, PhonePe, Paytm</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                                    <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none'>
                                        <path d='M12 2L2 7L12 12L22 7L12 2Z' stroke='#4B5563' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                                        <path d='M2 17L12 22L22 17' stroke='#4B5563' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                                        <path d='M2 12L12 17L22 12' stroke='#4B5563' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                                    </svg>
                                </div>
                                <div>
                                    <p className='font-semibold text-gray-900'>Net Banking</p>
                                    <p className='text-xs text-gray-600'>All major Indian banks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='space-y-3'>
                <Button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className='w-full h-12 sm:h-14 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all hover:shadow-lg active:scale-[0.98] shadow-md'
                >
                    {paymentLoading ? (
                        <div className='flex items-center justify-center gap-2'>
                            <Loader size={20} className='animate-spin' />
                            <span>Processing Payment...</span>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center gap-2'>
                            <CreditCard size={20} />
                            <span>Pay {formatFees(totalAmount)}</span>
                        </div>
                    )}
                </Button>

                <Button
                    type='button'
                    onClick={() => setStep(2)}
                    variant='outline'
                    className='w-full h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold border-2 border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all'
                >
                    <span className='flex items-center justify-center gap-1.5 sm:gap-2'>
                        <ChevronLeft size={16} />
                        Back to Details
                    </span>
                </Button>
            </div>

            {/* Payment Security Info */}
            <div className='flex flex-col items-center gap-2 text-center text-xs text-gray-500 p-3'>
                <div className='flex items-center gap-2'>
                    <Lock size={12} className='text-blue-600' />
                    <span>256-bit SSL secured payment</span>
                </div>
                <p>By proceeding, you agree to our Terms & Conditions and Privacy Policy</p>
            </div>
        </div>
    );
};

export default PaymentStep;