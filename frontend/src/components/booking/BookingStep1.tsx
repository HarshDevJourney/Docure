import React from "react";
import {
    Calendar,
    Clock,
    Video,
    Phone,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Info,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookingFormData, AvailabilityRange, TimeRange } from "./../../lib/types";
import { useAppointmentStore } from "@/store/appointmentStore";

interface BookingStep1Props {
    formData: BookingFormData;
    setFormData: (data: BookingFormData) => void;
    docTiming: TimeRange[];
    docAvailability: AvailabilityRange;
    consultationSpan: number;
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    renderCalendar: () => (number | null)[];
    handleDateSelect: (day: number) => void;
    handleSlotSelect: (slot: string) => void;
    handleNextStep: () => void;
    formatTime: (time: string) => string;
    selectedDateDisplay: string;
}

const BookingStep1: React.FC<BookingStep1Props> = ({
    formData,
    setFormData,
    docTiming,
    docAvailability,
    consultationSpan,
    currentMonth,
    setCurrentMonth,
    renderCalendar,
    handleDateSelect,
    handleSlotSelect,
    handleNextStep,
    formatTime,
    selectedDateDisplay,
}) => {
    const days = renderCalendar();
    const monthName = currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPastDate = (day: number) => {
        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        dateToCheck.setHours(0, 0, 0, 0);
        return dateToCheck < today;
    };

    const isDateAvailable = (day: number) => {
        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        dateToCheck.setHours(0, 0, 0, 0);

        if (docAvailability) {
            const startDate = new Date(docAvailability.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(docAvailability.endDate);
            endDate.setHours(0, 0, 0, 0);

            if (dateToCheck < startDate || dateToCheck > endDate) return false;

            const dayOfWeek = dateToCheck.getDay();
            if (docAvailability.excludedWeekdays?.map(Number).includes(dayOfWeek)) return false;
        }

        return true;
    };

    const getAvailableSlotsForDate = () => {
        if (!formData.date || !docTiming || docTiming.length === 0) return [];

        const slots: string[] = [];

        docTiming.forEach(timing => {
            const [startHour, startMin] = timing.start.split(':').map(Number);
            const [endHour, endMin] = timing.end.split(':').map(Number);

            let currentTime = startHour * 60 + startMin;
            const endTime = endHour * 60 + endMin;

            while (currentTime + consultationSpan <= endTime) {
                const hours = Math.floor(currentTime / 60);
                const mins = currentTime % 60;
                const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
                if (!slots.includes(timeString)) slots.push(timeString);
                currentTime += consultationSpan;
            }
        });

        return slots.sort();
    };

    const { bookedSlot } = useAppointmentStore();

    // ✅ Normalize booked slots to "HH:mm" regardless of what format API returns
    const booked = bookedSlot.map(slot => {
        const slotStart = slot.slotStart;
        if (!slotStart) return '';

        // ISO datetime string e.g. "2024-01-15T11:00:00.000Z"
        if (typeof slotStart === 'string' && slotStart.includes('T')) {
            const date = new Date(slotStart);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }

        // Already "HH:mm" or "HH:mm:ss"
        if (typeof slotStart === 'string' && slotStart.includes(':')) {
            return slotStart.slice(0, 5);
        }

        // Date object
        if (slotStart instanceof Date) {
            return `${slotStart.getHours().toString().padStart(2, '0')}:${slotStart.getMinutes().toString().padStart(2, '0')}`;
        }

        return '';
    }).filter(Boolean);

    const availableSlots = getAvailableSlotsForDate();
    const availableSlotsCount = availableSlots.filter(slot => !booked.includes(slot)).length;

    const isSlotInPast = (slot: string) => {
        if (!formData.date) return false;

        const selectedDate = new Date(formData.date);
        const selectedDay = new Date(selectedDate);
        selectedDay.setHours(0, 0, 0, 0);

        const todayCheck = new Date();
        todayCheck.setHours(0, 0, 0, 0);

        if (selectedDay.getTime() !== todayCheck.getTime()) return false;

        const [hour, minute] = slot.split(":").map(Number);
        const slotDateTime = new Date(selectedDate);
        slotDateTime.setHours(hour, minute, 0, 0);

        return slotDateTime <= new Date();
    };

    const getUniqueDatesFromTiming = () => {
        if (!docTiming || docTiming.length === 0) return [];
        return docTiming.slice(0, 5).map((timing, idx) => ({
            id: idx,
            start: timing.start,
            end: timing.end,
        }));
    };

    const upcomingDates = getUniqueDatesFromTiming();

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Progress Indicator */}
            <div className='flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4'>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-md'>1</div>
                    <span className='text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap'>Date & Time</span>
                </div>
                <div className='w-8 sm:w-12 md:w-16 h-0.5 bg-gray-300'></div>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs sm:text-sm font-semibold'>2</div>
                    <span className='text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap'>Details</span>
                </div>
                <div className='w-8 sm:w-12 md:w-16 h-0.5 bg-gray-300'></div>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                    <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs sm:text-sm font-semibold'>3</div>
                    <span className='text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap'>Payment</span>
                </div>
            </div>

            {/* Doctor Availability Info Card */}
            {((docTiming && docTiming.length > 0) || docAvailability) && (
                <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
                    <CardContent className='p-4 sm:p-5'>
                        <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md'>
                                <Info size={20} className='text-white' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='font-bold text-gray-900 text-sm sm:text-base mb-3'>Doctor's Availability Schedule</h3>

                                {consultationSpan && (
                                    <div className='flex items-center gap-2 text-xs sm:text-sm mb-3 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2'>
                                        <Clock size={16} className='text-blue-600 flex-shrink-0' />
                                        <span className='text-gray-700'>Each session: <span className='font-bold text-blue-700'>{consultationSpan} minutes</span></span>
                                    </div>
                                )}

                                {docAvailability && (
                                    <div className='space-y-2 mb-3'>
                                        <div className='flex items-center gap-2 text-xs sm:text-sm bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2'>
                                            <Calendar size={16} className='text-blue-600 flex-shrink-0' />
                                            <span className='text-gray-700'>
                                                Booking period: <span className='font-bold text-blue-700'>
                                                    {new Date(docAvailability.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                                                    {new Date(docAvailability.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </span>
                                        </div>

                                        {docAvailability.excludedWeekdays && docAvailability.excludedWeekdays.length > 0 && (
                                            <div className='flex items-start gap-2 text-xs sm:text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2'>
                                                <AlertCircle size={16} className='text-amber-600 mt-0.5 flex-shrink-0' />
                                                <div>
                                                    <span className='text-amber-900 font-semibold'>Unavailable on: </span>
                                                    <span className='text-amber-800'>
                                                        {docAvailability.excludedWeekdays.map(day => {
                                                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                                            return dayNames[day];
                                                        }).join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {upcomingDates.length > 0 && (
                                    <div className='mt-3'>
                                        <p className='text-xs font-semibold text-gray-600 mb-2'>Available Time Slots:</p>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                            {upcomingDates.map((timeRange) => (
                                                <div key={timeRange.id} className='flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200'>
                                                    <div className='flex items-center gap-2'>
                                                        <Clock size={14} className='text-blue-600' />
                                                        <span className='text-xs text-gray-700 font-medium'>
                                                            {formatTime(timeRange.start)} - {formatTime(timeRange.end)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Appointment Type Selection */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white'>
                <CardHeader className='pb-3 sm:pb-4 space-y-0.5 sm:space-y-1'>
                    <CardTitle className='flex items-center gap-2 text-gray-900 text-base sm:text-lg'>
                        <Video size={18} className='text-blue-600 flex-shrink-0' />
                        <span>Select Appointment Type</span>
                    </CardTitle>
                    <p className='text-xs text-gray-500'>Choose your preferred consultation method</p>
                </CardHeader>
                <CardContent className='pb-4 sm:pb-5'>
                    <div className='grid grid-cols-2 gap-2 sm:gap-3'>
                        {[
                            { id: "video", icon: Video, label: "Video Call", description: "Face-to-face consultation" },
                            { id: "phone", icon: Phone, label: "Phone Call", description: "Voice only consultation" },
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setFormData({ ...formData, appointmentType: type.id as "video" | "phone" })}
                                className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                                    formData.appointmentType === type.id
                                        ? "border-blue-600 bg-blue-50 shadow-sm sm:shadow-md"
                                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                                }`}
                            >
                                <div className='flex flex-col items-center gap-2 sm:gap-3 text-center'>
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${formData.appointmentType === type.id ? "bg-blue-600" : "bg-gray-100"}`}>
                                        <type.icon size={18} className={formData.appointmentType === type.id ? "text-white" : "text-gray-400"} />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-gray-900 text-xs sm:text-sm mb-0.5'>{type.label}</p>
                                        <p className='text-xs text-gray-600 leading-tight'>{type.description}</p>
                                    </div>
                                </div>
                                {formData.appointmentType === type.id && (
                                    <CheckCircle2 size={16} className='text-blue-600 absolute top-2 right-2 sm:top-3 sm:right-3' />
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white'>
                <CardHeader className='pb-3 sm:pb-4 space-y-0.5 sm:space-y-1'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                        <div>
                            <CardTitle className='flex items-center gap-2 text-gray-900 text-base sm:text-lg'>
                                <Calendar size={18} className='text-blue-600 flex-shrink-0' />
                                <span>Select Date</span>
                            </CardTitle>
                            <p className='text-xs text-gray-500 mt-0.5 sm:mt-1'>Pick your appointment date</p>
                        </div>
                        <div className='flex items-center gap-2 self-start sm:self-center'>
                            <button onClick={handlePrevMonth} className='p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition active:scale-95'>
                                <ChevronLeft size={16} className='text-gray-600' />
                            </button>
                            <span className='text-sm font-semibold text-gray-700 w-24 sm:w-32 text-center'>{monthName}</span>
                            <button onClick={handleNextMonth} className='p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition active:scale-95'>
                                <ChevronRight size={16} className='text-gray-600' />
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='pb-4 sm:pb-5'>
                    <div className='grid grid-cols-7 gap-1.5 sm:gap-2 mb-3 sm:mb-4'>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                            <div key={idx} className='text-center text-xs font-semibold text-gray-600 py-1.5 sm:py-2'>
                                <span className='hidden sm:inline'>{day}</span>
                                <span className='sm:hidden'>{day[0]}</span>
                            </div>
                        ))}
                    </div>
                    <div className='grid grid-cols-7 gap-1.5 sm:gap-2'>
                        {days.map((day, index) => {
                            const isSelected = day && formData.date === `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                            const isPast = day && isPastDate(day);
                            const isAvailable = day && isDateAvailable(day);

                            return (
                                <button
                                    key={index}
                                    onClick={() => day && !isPast && isAvailable && handleDateSelect(day)}
                                    disabled={!day || !!isPast || !isAvailable}
                                    className={`h-8 sm:h-10 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 relative ${
                                        !day ? "invisible"
                                        : isPast || !isAvailable ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                        : isSelected ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md sm:shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border hover:border-blue-200"
                                    }`}
                                >
                                    {day}
                                    {isSelected && (
                                        <div className='absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full border border-white'></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Time Slot Selection */}
            {formData.date && (
                <Card className='border-0 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl bg-white animate-in fade-in slide-in-from-bottom-4 duration-300'>
                    <CardHeader className='pb-3 sm:pb-4 space-y-0.5 sm:space-y-1'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                            <div>
                                <CardTitle className='flex items-center gap-2 text-gray-900 text-base sm:text-lg'>
                                    <Clock size={18} className='text-blue-600 flex-shrink-0' />
                                    <span>Select Time Slot</span>
                                </CardTitle>
                                <p className='text-xs text-gray-500 mt-0.5 sm:mt-1'>
                                    <span className='font-semibold text-blue-600'>{availableSlotsCount}</span> slot{availableSlotsCount !== 1 ? 's' : ''} available
                                </p>
                            </div>
                            <span className='text-xs sm:text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-3 py-1.5 rounded-lg inline-block self-start sm:self-center'>
                                📅 {selectedDateDisplay}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className='pb-4 sm:pb-5'>
                        {availableSlots.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-12 text-center'>
                                <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
                                    <AlertCircle size={32} className='text-gray-400' />
                                </div>
                                <p className='text-base font-semibold text-gray-700 mb-1'>No Slots Available</p>
                                <p className='text-sm text-gray-500'>Doctor has no available time on this date</p>
                            </div>
                        ) : (
                            <>
                                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5'>
                                    {availableSlots.map((slot) => {
                                        const isBooked = booked.includes(slot);
                                        const isPastTime = isSlotInPast(slot);
                                        const isSelected = formData.time === slot;
                                        const isDisabled = isBooked || isPastTime;

                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => !isDisabled && handleSlotSelect(slot)}
                                                disabled={isDisabled}
                                                className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                                                    isBooked
                                                        ? "bg-red-50 text-red-400 border-2 border-red-200 cursor-not-allowed opacity-60"
                                                        : isPastTime
                                                        ? "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-70"
                                                        : isSelected
                                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg border-2 border-blue-600 scale-105"
                                                        : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200 hover:border-blue-300 hover:scale-105"
                                                }`}
                                            >
                                                <div className='flex flex-col items-center gap-1'>
                                                    <Clock
                                                        size={14}
                                                        className={
                                                            isBooked ? 'text-red-400'
                                                            : isPastTime ? 'text-gray-400'
                                                            : isSelected ? 'text-white'
                                                            : 'text-gray-500'
                                                        }
                                                    />
                                                    <span className='text-sm sm:text-base font-bold'>{formatTime(slot)}</span>
                                                    {isBooked && <span className='text-xs font-medium'>Booked</span>}
                                                    {isPastTime && !isBooked && <span className='text-xs font-medium'>Past</span>}
                                                </div>
                                                {isSelected && (
                                                    <div className='absolute -top-2 -right-2'>
                                                        <CheckCircle2 size={20} className='text-green-400 bg-white rounded-full' />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className='flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200'>
                                    <Info size={16} className='text-blue-600 flex-shrink-0 mt-0.5' />
                                    <div className='flex-1'>
                                        <p className='text-xs sm:text-sm text-blue-900 leading-relaxed mb-2'>
                                            <span className='font-bold'>Tip:</span> Booked slots are unavailable. Select any available time to continue.
                                        </p>
                                        <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-xs'>
                                            <div className='flex items-center gap-1.5'>
                                                <div className='w-4 h-4 rounded bg-gray-50 border-2 border-gray-200'></div>
                                                <span className='text-gray-700 font-medium'>Available</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <div className='w-4 h-4 rounded bg-red-50 border-2 border-red-200'></div>
                                                <span className='text-gray-700 font-medium'>Booked</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <div className='w-4 h-4 rounded bg-gray-100 border-2 border-gray-200'></div>
                                                <span className='text-gray-700 font-medium'>Past</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <div className='w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-blue-700'></div>
                                                <span className='text-gray-700 font-medium'>Selected</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Next Button */}
            <Button
                onClick={handleNextStep}
                disabled={!formData.date || !formData.time}
                className='w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl active:scale-[0.98] shadow-lg'
            >
                <span className='flex items-center justify-center gap-2 text-white'>
                    Continue to Details
                    <ArrowRight size={20} className='text-white' />
                </span>
            </Button>
        </div>
    );
};

export default BookingStep1;