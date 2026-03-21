"use client";

import React, { useState } from "react";
import { Doctor, BookingFormData } from "./../../lib/types";
import DoctorCard from "./DoctorCard";
import BookingStep1 from "./BookingStep1";
import BookingStep2 from "./BookingStep2";
import PaymentStep from "./PaymentStep";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useRouter } from "next/navigation";
import { httpService } from "@/service/httpService";
import { userAuthStore } from "@/store/authStore";
import { toast } from "sonner";

declare global {
    interface Window {
      Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type PaymentStatus = 'idle' | 'processing' | 'success' | 'fail';

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

    const router = useRouter()

    // Calculate fees
    const consultationFee = doctor.fees;
    const platformFee = doctor.fees * 0.1;
    const gst = Math.round((consultationFee + platformFee) * 0.18);
    const totalAmount = consultationFee + platformFee + gst;

    const docTiming = doctor.dailyTimeRange
    const docAvailability = doctor.availabilityRange
    const consultationSpan = doctor.slotDurationMinutes

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [patientName, setPatientName] = useState('')
    const [appointmentID, setAppointmentID] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
    const [step, setStep] = useState(1);
    const { bookAppointment, fetchBookedSlot } = useAppointmentStore()
    const { user } = userAuthStore()

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

    const calSlotEnd = (start : string, duration : number) => {
        const [hours, minutes] = start.split(":").map(Number);

        const totalMinutes = hours * 60 + minutes + duration;

        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;

        return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
    }

    const handleDateSelect = (day: number) => {
        const selectedDate = formatDate(day, currentMonth);
        setFormData({ ...formData, date: selectedDate, time: "" });
        fetchBookedSlot(doctor._id, selectedDate);
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
        
        setLoading(true)
        try {
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

          const booking = await bookAppointment({
            doctorID: doctor._id,
            date: formData.date,
            slotStart: formData.time,
            slotEnd: calSlotEnd(formData.time, doctor.slotDurationMinutes),
            consultationType: formData.appointmentType,
            symptoms: formData.symptoms,
            medicalHistory: formData.medicalHistory,
            paymentDetails: {
              doctorFees: consultationFee,
              platformFees: platformFee,
              totalFees: totalAmount,
              paymentStatus: "Pending",
            },
            paymentExpiresAt: expiresAt,
          });

          if (booking && booking._id) {
            setAppointmentID(booking._id);
            setPatientName(booking.patientID.name);
            setStep(3);
          } else {
            toast.error("Failed to create appointment. Please try again.");
            await new Promise((resolve) => setTimeout(resolve, 3000));
            router.push("/patient/dashboard");
          }
        } catch (error: unknown) {
          alert(error instanceof Error ? error.message : "Something went wrong");
        } finally {
          setLoading(false);
        }
        
    };

    const handlePayment = async () => {
        if (!appointmentID) return;
        setPaymentLoading(true);
        setPaymentStatus('processing')

        toast.loading("Opening payment window...")
        
        try {
            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                alert("Razorpay failed to load");
                return;
            }

            const orderResponse = await httpService.postWithAuth('payment/create-order', { appointmentID })

            if(!orderResponse.success){
                throw new Error(orderResponse.message || 'Failed to create Payment Order')
            }

            const { orderID, amount, currency, key_id } = orderResponse.data
            
            const options = {
              key: key_id,
              amount: amount * 100,
              currency,
              order_id: orderID,
              name: "Docure",
              description: "Doctor Consultation",

              handler: async (response: RazorpayResponse) => {
                try {
                  const verifyRes = await httpService.postWithAuth("payment/verify-payment", {
                    appointmentID,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  });

                  if (verifyRes.success) {
                    setPaymentStatus("success");
                    toast.success("Payment successful 🎉");
                    router.push("/patient/dashboard");
                  } else {
                    throw new Error("Verification failed");
                  }
                } catch (err) {
                  toast.error("Payment verification failed. You can retry.");
                }
              },

              prefill: {
                name: patientName,
                email: user?.email,
                phone: user?.phone,
              },
              notes: {
                appointmentID,
                patientName,
              },

              theme: { color: "#2563eb" },
              modal: {
                ondismiss: () => {
                  setPaymentStatus("idle");
                  toast("Payment window closed. You can pay within 1hr.", {
                    action: {
                      label: "Retry",
                      onClick: () => handlePayment(), // Allow retry
                    },
                  });
                },
              },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
 
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment failed. Please try again.");
            setPaymentStatus('fail')
        } finally {
            setPaymentLoading(false);
        }
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