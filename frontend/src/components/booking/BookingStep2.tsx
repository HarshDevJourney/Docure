import React from "react";
import {
    Calendar,
    Clock,
    Video,
    ChevronLeft,
    Loader,
    Lock,
    ArrowRight,
    CheckCircle2,
    FileText,
    AlertCircle,
    Check,
    Activity,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { BookingFormData, Doctor } from "./../../lib/types";

interface BookingStep2Props {
    formData: BookingFormData;
    setFormData: (data: BookingFormData) => void;
    handleBookingSubmit: (e: React.FormEvent) => Promise<void>;
    loading: boolean;
    doctor: Doctor;
    selectedDateDisplay: string;
    formatTime: (time: string) => string;
    formatFees: (fees: number) => string;
    setStep: (step: number) => void;
}

const BookingStep2: React.FC<BookingStep2Props> = ({
    formData,
    setFormData,
    handleBookingSubmit,
    loading,
    doctor,
    selectedDateDisplay,
    formatTime,
    formatFees,
    setStep,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleBookingSubmit(e);
    };

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
                <div className='w-8 sm:w-12 md:w-16 h-0.5 bg-blue-600'></div>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-md'>
                        2
                    </div>
                    <span className='text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap'>
                        Details
                    </span>
                </div>
                <div className='w-8 sm:w-12 md:w-16 h-0.5 bg-gray-300'></div>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs sm:text-sm font-semibold'>
                        3
                    </div>
                    <span className='text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap'>
                        Payment
                    </span>
                </div>
            </div>

            {/* Booking Summary */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200'>
                <CardHeader className='pb-3 sm:pb-4 space-y-0.5 sm:space-y-1'>
                    <CardTitle className='text-gray-900 text-base sm:text-lg'>Booking Summary</CardTitle>
                    <p className='text-xs text-gray-600'>Review your appointment details</p>
                </CardHeader>
                <CardContent className='pb-4 sm:pb-5'>
                    <div className='space-y-3 sm:space-y-4'>
                        <div className='flex items-center justify-between gap-2 sm:gap-3'>
                            <div className='flex items-center gap-2 sm:gap-2.5 text-gray-700'>
                                <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0'>
                                    <Calendar size={16} className='text-blue-600' />
                                </div>
                                <span className='font-medium text-xs sm:text-sm whitespace-nowrap'>Date & Time</span>
                            </div>
                            <span className='font-semibold text-gray-900 text-xs sm:text-sm text-right leading-tight max-w-[150px] sm:max-w-none'>
                                {selectedDateDisplay}
                                <br />
                                {formatTime(formData.time)}
                            </span>
                        </div>
                        <div className='flex items-center justify-between gap-2 sm:gap-3'>
                            <div className='flex items-center gap-2 sm:gap-2.5 text-gray-700'>
                                <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0'>
                                    <Video size={16} className='text-blue-600' />
                                </div>
                                <span className='font-medium text-xs sm:text-sm whitespace-nowrap'>Consultation Type</span>
                            </div>
                            <span className='font-semibold text-gray-900 capitalize text-xs sm:text-sm'>
                                {formData.appointmentType}
                            </span>
                        </div>
                        <div className='flex items-center justify-between pt-3 sm:pt-4 border-t-2 border-blue-200 gap-2 sm:gap-3'>
                            <span className='font-semibold text-gray-700 text-sm sm:text-base'>Total Amount</span>
                            <span className='text-lg sm:text-xl lg:text-2xl font-bold text-blue-600'>
                                {formatFees(doctor.fees)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Patient Details Form */}
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
                {/* Symptoms Section */}
                <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white border-l-4 border-l-blue-500'>
                    <CardHeader className='pb-3 sm:pb-4 space-y-0.5 sm:space-y-1'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <div className='w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center'>
                                    <Activity size={18} className='text-blue-600' />
                                </div>
                                <div>
                                    <CardTitle className='text-gray-900 text-base sm:text-lg'>Chief Complaint *</CardTitle>
                                    <p className='text-xs text-gray-600'>
                                        Describe your main symptoms or reason for consultation
                                    </p>
                                </div>
                            </div>
                            {formData.symptoms.trim() && (
                                <div className='flex items-center gap-1 text-xs text-green-600 font-semibold'>
                                    <CheckCircle2 size={14} />
                                    <span className='hidden sm:inline'>Filled</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className='pb-4 sm:pb-5'>
                        <div className='space-y-3'>
                            <Textarea
                                value={formData.symptoms}
                                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                placeholder='Example: Persistent headache for 3 days, moderate severity, worse in the morning...'
                                className='min-h-20 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm resize-none placeholder:text-gray-400 placeholder:text-sm leading-relaxed'
                            />
                            <div className='flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                                <AlertCircle size={16} className='text-blue-600 flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='text-xs font-semibold text-blue-800 mb-1'>Tips for describing symptoms:</p>
                                    <ul className='text-xs text-blue-700 space-y-1'>
                                        <li>• Mention duration (how long have you had symptoms?)</li>
                                        <li>• Describe severity (mild, moderate, severe)</li>
                                        <li>• Note any triggers or relieving factors</li>
                                        <li>• List all symptoms even if they seem unrelated</li>
                                    </ul>
                                </div>
                            </div>
                            {formData.symptoms.trim() && (
                                <div className='flex items-center gap-2 text-xs text-gray-600'>
                                    <div className='flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                                        <div 
                                            className={`h-full rounded-full transition-all duration-300 ${
                                                formData.symptoms.length > 50 ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                            style={{ width: `${Math.min(100, (formData.symptoms.length / 200) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span>{formData.symptoms.length}/200 characters</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Medical History Section */}
                <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white border-l-4 border-l-purple-500'>
                    <CardHeader className='pb-3 sm:pb-4 space-y-0.5 sm:space-y-1'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <div className='w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center'>
                                    <FileText size={18} className='text-purple-600' />
                                </div>
                                <div>
                                    <CardTitle className='text-gray-900 text-base sm:text-lg'>Medical History</CardTitle>
                                    <p className='text-xs text-gray-600'>
                                        Past conditions, medications, allergies (optional but recommended)
                                    </p>
                                </div>
                            </div>
                            {formData.medicalHistory.trim() && (
                                <div className='flex items-center gap-1 text-xs text-green-600 font-semibold'>
                                    <CheckCircle2 size={14} />
                                    <span className='hidden sm:inline'>Filled</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className='pb-4 sm:pb-5'>
                        <div className='space-y-3'>
                            <Textarea
                                value={formData.medicalHistory}
                                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                                placeholder='Example: Diabetes (Type 2, diagnosed 2020), Currently taking Metformin 500mg twice daily, Allergic to Penicillin, Previous appendectomy in 2018...'
                                className='min-h-28 rounded-lg sm:rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm resize-none placeholder:text-gray-400 placeholder:text-sm leading-relaxed'
                            />
                            <div className='flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100'>
                                <AlertCircle size={16} className='text-purple-600 flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='text-xs font-semibold text-purple-800 mb-1'>Include if applicable:</p>
                                    <ul className='text-xs text-purple-700 space-y-1'>
                                        <li>• Chronic conditions (diabetes, hypertension, asthma, etc.)</li>
                                        <li>• Current medications with dosages</li>
                                        <li>• Known allergies (medications, food, environmental)</li>
                                        <li>• Previous surgeries or hospitalizations</li>
                                        <li>• Family history of relevant conditions</li>
                                        <li>• Any ongoing treatments or therapies</li>
                                    </ul>
                                </div>
                            </div>
                            {formData.medicalHistory.trim() && (
                                <div className='flex items-center gap-2 text-xs text-gray-600'>
                                    <div className='flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                                        <div 
                                            className={`h-full bg-purple-500 rounded-full transition-all duration-300`}
                                            style={{ width: `${Math.min(100, (formData.medicalHistory.length / 400) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span>{formData.medicalHistory.length}/400 characters</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
                    <Button
                        type='button'
                        onClick={() => setStep(1)}
                        variant='outline'
                        className='w-full sm:flex-1 h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold border-2 border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all'
                    >
                        <span className='flex items-center justify-center gap-1.5 sm:gap-2'>
                            <ChevronLeft size={16} />
                            Back
                        </span>
                    </Button>
                    <Button
                        type='submit'
                        disabled={loading || !formData.symptoms.trim()}
                        className={`w-full sm:flex-1 h-11 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all hover:shadow-md sm:hover:shadow-lg active:scale-[0.98] shadow-sm sm:shadow-md ${
                            !formData.symptoms.trim() 
                                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? (
                            <div className='flex items-center justify-center gap-1.5 sm:gap-2'>
                                <Loader size={16} className='animate-spin' />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center gap-1.5 sm:gap-2 text-white'>
                                <ArrowRight size={16} />
                                <span>Proceed to Payment</span>
                            </div>
                        )}
                    </Button>
                </div>

                {/* Payment Disabled Info */}
                {!formData.symptoms.trim() && (
                    <div className='flex items-center justify-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
                        <AlertCircle size={16} className='text-yellow-600' />
                        <p className='text-xs text-yellow-800 font-medium'>
                            Please describe your symptoms to proceed to payment
                        </p>
                    </div>
                )}

                {/* Security Badge */}
                <div className='flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 py-1.5 sm:py-2'>
                    <Lock size={14} className='text-blue-600' />
                    <span>Your information is secure and encrypted</span>
                </div>
            </form>
        </div>
    );
};

export default BookingStep2;