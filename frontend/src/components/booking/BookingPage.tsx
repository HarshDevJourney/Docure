"use client";

import React, { useState } from "react";
import { Doctor, BookingFormData } from "./../../lib/types";
import DoctorCard from "./DoctorCard";
import BookingStep1 from "./BookingStep1";
import BookingStep2 from "./BookingStep2";
import PaymentStep from "./PaymentStep";

// Razorpay script loading function
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const BookingPage: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
    const [formData, setFormData] = useState<BookingFormData>({
        appointmentType: "video",
        date: "",
        time: "",
        symptoms: "",
        medicalHistory: "",
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [step, setStep] = useState(1);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (day: number, month: Date) => {
        const dateObj = new Date(month.getFullYear(), month.getMonth(), day);

        const y = dateObj.getFullYear();
        const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const d = dateObj.getDate().toString().padStart(2, "0");

        return `${y}-${m}-${d}`;
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatFees = (fees: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(fees);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const handleDateSelect = (day: number) => {
        const selectedDate = formatDate(day, currentMonth);
        setFormData({ ...formData, date: selectedDate, time: "" });
    };

    const handleSlotSelect = (slot: string) => {
        setFormData({ ...formData, time: slot });
    };

    const handleNextStep = () => {
        if (formData.date && formData.time) {
            setStep(2);
        }
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.symptoms.trim()) {
            alert("Please describe your symptoms before proceeding to payment.");
            return;
        }
        console.log(formData)
        setStep(3); // Move to payment step
    };

    const handlePayment = async () => {
        setPaymentLoading(true);
        
        try {
            const isScriptLoaded = await loadRazorpayScript();
            
            if (!isScriptLoaded) {
                alert("Failed to load payment gateway. Please try again.");
                setPaymentLoading(false);
                return;
            }

            // Calculate fees
            const consultationFee = doctor.fees;
            const platformFee = 49;
            const gst = Math.round((consultationFee + platformFee) * 0.18);
            const totalAmount = consultationFee + platformFee + gst;

            const paymentData = {
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                notes: {
                    doctorId: doctor._id,
                    doctorName: doctor.name,
                    appointmentType: formData.appointmentType,
                    appointmentDate: formData.date,
                    appointmentTime: formData.time,
                    symptoms: formData.symptoms,
                },
            };

            // Mock order creation
            const orderResponse = await createRazorpayOrder(paymentData);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: "MediConnect Healthcare",
                description: `Consultation with Dr. ${doctor.name}`,
                image: "https://example.com/your-logo.png",
                order_id: orderResponse.id,
                handler: async function (response: any) {
                    console.log("Payment successful:", response);
                    
                    const verificationResponse = await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verificationResponse.success) {
                        alert("Payment successful! Your appointment has been confirmed.");
                    } else {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    contact: "9999999999",
                },
                notes: paymentData.notes,
                theme: {
                    color: "#3B82F6",
                },
                modal: {
                    ondismiss: function() {
                        setPaymentLoading(false);
                    },
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
            
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setPaymentLoading(false);
        }
    };

    // Mock function to create Razorpay order
    const createRazorpayOrder = async (paymentData: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: `order_${Date.now()}`,
            amount: paymentData.amount,
            currency: paymentData.currency,
        };
    };

    // Mock function to verify payment
    const verifyPayment = async (paymentData: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    };

    const selectedDateObj = formData.date
    ? (() => {
        const [year, month, day] = formData.date.split("-").map(Number);
        return new Date(year, month - 1, day); // LOCAL date
        })()
    : null;

    const selectedDateDisplay = selectedDateObj
    ? selectedDateObj.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        })
    : "No date selected";

    // Calculate fees
    const consultationFee = doctor.fees;
    const platformFee = doctor.fees / 10;
    const gst = Math.round((consultationFee + platformFee) * 0.18);
    const totalAmount = consultationFee + platformFee + gst;

    
    const docTiming = doctor.dailyTimeRange
    const docAvailability = doctor.availabilityRange
    const consultationSpan = doctor.slotDurationMinutes


    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 mt-12'>
            {/* Fixed Header */}
            <div className='fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-t border-gray-200 shadow-sm mt-16'>
                <div className='max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0'>
                        <div>
                            <h1 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5'>
                                Book Your Appointment
                            </h1>
                            <p className='text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none'>
                                Complete the form below to schedule your consultation
                            </p>
                        </div>
                        
                        {/* Progress Badge */}
                        <div className='flex items-center gap-2 self-start sm:self-center'>
                            <div className='flex items-center gap-2 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-200'>
                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                    step === 1 ? 'bg-blue-600 animate-pulse' : 
                                    step === 2 ? 'bg-green-500' : 'bg-green-500'
                                }`}></div>
                                <span className='text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap'>
                                    Step {step} of 3
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div className='pt-16 sm:pt-20 lg:pt-24'></div>

            <div className='max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8'>
                <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 sm:gap-6'>
                    {/* Left Column - Doctor Card */}
                    <div className='lg:col-span-3'>
                        <div className='max-w-md mx-auto lg:max-w-none'>
                            <DoctorCard doctor={doctor} formatFees={formatFees} />
                        </div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className='lg:col-span-4'>
                        <div className='max-w-2xl mx-auto lg:max-w-none'>
                            {step === 1 ? (
                                <BookingStep1
                                    formData={formData}
                                    setFormData={setFormData}
                                    docTiming={docTiming}
                                    docAvailability={docAvailability}
                                    consultationSpan={consultationSpan}
                                    currentMonth={currentMonth}
                                    setCurrentMonth={setCurrentMonth}
                                    renderCalendar={renderCalendar}
                                    handleDateSelect={handleDateSelect}
                                    handleSlotSelect={handleSlotSelect}
                                    handleNextStep={handleNextStep}
                                    formatTime={formatTime}
                                    selectedDateDisplay={selectedDateDisplay}
                                />
                            ) : step === 2 ? (
                                <BookingStep2
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleBookingSubmit={handleBookingSubmit}
                                    loading={loading}
                                    doctor={doctor}
                                    selectedDateDisplay={selectedDateDisplay}
                                    formatTime={formatTime}
                                    formatFees={formatFees}
                                    setStep={setStep}
                                />
                            ) : (
                                <PaymentStep
                                    doctor={doctor}
                                    formData={formData}
                                    selectedDateDisplay={selectedDateDisplay}
                                    formatTime={formatTime}
                                    formatFees={formatFees}
                                    consultationFee={consultationFee}
                                    platformFee={platformFee}
                                    gst={gst}
                                    totalAmount={totalAmount}
                                    handlePayment={handlePayment}
                                    paymentLoading={paymentLoading}
                                    setStep={setStep}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;