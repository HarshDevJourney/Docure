"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppointmentStore, Appointment } from "@/store/appointmentStore";
import { userAuthStore } from "@/store/authStore";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type TabKey = "upcoming" | "past";
type TabCnt = { upcoming: number; past: number };

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const formatDate = (s: string) => {
    const d = new Date(s);
    return isNaN(d.getTime())
        ? "N/A"
        : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
};

const formatRelative = (s: string) => {
    const diff = Math.ceil((new Date(s).getTime() - Date.now()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff > 1) return `In ${diff} days`;
    if (diff === -1) return "Yesterday";
    return `${Math.abs(diff)} days ago`;
};

const formatTime = (s: string): string => {
    if (!s) return "N/A";
    const d = new Date(s);
    if (!isNaN(d.getTime()))
        return d.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    return s;
};

const splitTime = (s: string): [string, string] => {
    const formatted = formatTime(s);
    const parts = formatted.split(" ");
    return [parts[0] ?? formatted, parts[1] ?? ""];
};

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */
const VideoIcon = ({ className }: { className?: string }) => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M23 7l-7 5 7 5V7z' />
        <rect x='1' y='5' width='15' height='14' rx='2' ry='2' />
    </svg>
);
const AudioIcon = ({ className }: { className?: string }) => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
        <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
        <line x1='12' y1='19' x2='12' y2='23' />
        <line x1='8' y1='23' x2='16' y2='23' />
    </svg>
);
const CalIcon = ({ className }: { className?: string }) => (
    <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <rect x='3' y='4' width='18' height='18' rx='2' />
        <line x1='16' y1='2' x2='16' y2='6' />
        <line x1='8' y1='2' x2='8' y2='6' />
        <line x1='3' y1='10' x2='21' y2='10' />
    </svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
    <svg
        width='12'
        height='12'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        className={className}
    >
        <circle cx='12' cy='12' r='10' />
        <polyline points='12 6 12 12 16 14' />
    </svg>
);
const CheckIcon = ({ className }: { className?: string }) => (
    <svg
        width='10'
        height='10'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <polyline points='20 6 9 17 4 12' />
    </svg>
);
const FileIcon = ({ className }: { className?: string }) => (
    <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
        <polyline points='14 2 14 8 20 8' />
        <line x1='16' y1='13' x2='8' y2='13' />
        <line x1='16' y1='17' x2='8' y2='17' />
    </svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
        <circle cx='12' cy='12' r='3' />
    </svg>
);
const NoteIcon = ({ className }: { className?: string }) => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
        <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
    </svg>
);
const RepeatIcon = ({ className }: { className?: string }) => (
    <svg
        width='10'
        height='10'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <polyline points='17 1 21 5 17 9' />
        <path d='M3 11V9a4 4 0 0 1 4-4h14' />
        <polyline points='7 23 3 19 7 15' />
        <path d='M21 13v2a4 4 0 0 1-4 4H3' />
    </svg>
);
const ArrowLeft = ({ className }: { className?: string }) => (
    <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M19 12H5M12 5l-7 7 7 7' />
    </svg>
);
const SearchIcon = ({ className }: { className?: string }) => (
    <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <circle cx='11' cy='11' r='8' />
        <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
);
const ChevronDown = ({ className }: { className?: string }) => (
    <svg
        width='10'
        height='10'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        className={className}
    >
        <polyline points='6 9 12 15 18 9' />
    </svg>
);
const LightningIcon = ({ className }: { className?: string }) => (
    <svg width='11' height='11' viewBox='0 0 24 24' fill='currentColor' className={className}>
        <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
    </svg>
);
const StarIcon = ({ className }: { className?: string }) => (
    <svg width='12' height='12' viewBox='0 0 24 24' fill='currentColor' className={className}>
        <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
);
const XIcon = ({ className }: { className?: string }) => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <line x1='18' y1='6' x2='6' y2='18' />
        <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
);
const StethIcon = ({ className }: { className?: string }) => (
    <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3' />
        <path d='M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4' />
        <circle cx='20' cy='10' r='2' />
    </svg>
);
const DownloadIcon = ({ className }: { className?: string }) => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <polyline points='7 10 12 15 17 10' />
        <line x1='12' y1='15' x2='12' y2='3' />
    </svg>
);
const InfoIcon = ({ className }: { className?: string }) => (
    <svg
        width='12'
        height='12'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <circle cx='12' cy='12' r='10' />
        <line x1='12' y1='8' x2='12' y2='12' />
        <line x1='12' y1='16' x2='12.01' y2='16' />
    </svg>
);
const LiveIcon = ({ className }: { className?: string }) => (
    <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' className={className}>
        <circle cx='12' cy='12' r='8' />
        <circle cx='12' cy='12' r='3' fill='white' />
    </svg>
);
const UserIcon = ({ className }: { className?: string }) => (
    <svg
        width='13'
        height='13'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
    >
        <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
        <circle cx='12' cy='7' r='4' />
    </svg>
);

/* ─────────────────────────────────────────────────────────
   ELAPSED TIMER HOOK
───────────────────────────────────────────────────────── */
const useElapsed = (startISO: string) => {
    const [elapsed, setElapsed] = useState("");
    useEffect(() => {
        const calc = () => {
            const diff = Math.max(
                0,
                Math.floor((Date.now() - new Date(startISO).getTime()) / 1000),
            );
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            setElapsed(
                h > 0
                    ? `${h}h ${String(m).padStart(2, "0")}m`
                    : `${m}:${String(s).padStart(2, "0")}`,
            );
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [startISO]);
    return elapsed;
};

/* ─────────────────────────────────────────────────────────
   NOTES EXPAND (read-only for patient)
───────────────────────────────────────────────────────── */
const NotesSection = ({ notes }: { notes: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className='mt-2'>
            <button
                onClick={() => setOpen((o) => !o)}
                className='flex items-center gap-1 text-[11px] text-blue-600 font-semibold hover:text-blue-700 transition-colors'
            >
                <NoteIcon className='text-blue-500' />
                {open ? "Hide" : "View"} doctor's notes
                <ChevronDown
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className='mt-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-slate-600 leading-relaxed'>
                    {notes}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   PRESCRIPTION VIEWER (patient can only view/download)
───────────────────────────────────────────────────────── */
const PrescriptionViewer = ({ apt }: { apt: Appointment }) => {
    const rx = apt?.pescription;
    if (!rx)
        return (
            <div className='mt-3 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/40 px-3.5 py-2.5'>
                <InfoIcon className='text-blue-300 shrink-0' />
                <p className='text-[11px] text-blue-400 font-medium'>
                    Prescription not yet uploaded by the doctor.
                </p>
            </div>
        );
    return (
        <div className='mt-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white overflow-hidden'>
            <div className='flex items-center gap-3 px-3.5 py-3'>
                <div className='w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0'>
                    <FileIcon className='text-blue-600' />
                </div>
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5 mb-0.5'>
                        <span className='inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-1.5 py-0.5'>
                            <CheckIcon className='text-blue-600' /> Prescription Ready
                        </span>
                    </div>
                    <p className='text-xs font-semibold text-slate-700 truncate'>{rx.fileName}</p>
                </div>
                <div className='flex items-center gap-1.5 shrink-0'>
                    <a
                        href={rx.fileType === 'pdf' ? `https://docs.google.com/gview?url=${encodeURIComponent(rx.fileUrl)}&embedded=true` : rx.fileUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 transition-colors shadow-sm'
                    >
                        <EyeIcon className='text-blue-600' /> View
                    </a>
                    <a
                        href={rx.fileUrl}
                        download
                        className='flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors shadow-sm'
                    >
                        <DownloadIcon className='text-white' /> Save
                    </a>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   CANCEL MODAL
───────────────────────────────────────────────────────── */
interface CancelModalProps {
    onConfirm: () => void;
    onClose: () => void;
}
const CancelModal: React.FC<CancelModalProps> = ({ onConfirm, onClose }) => (
    <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4'
        onClick={onClose}
    >
        <div
            className='bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6'
            onClick={(e) => e.stopPropagation()}
        >
            <div className='w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4'>
                <XIcon className='text-rose-500' />
            </div>
            <h3 className='text-sm font-black text-slate-800 text-center mb-1'>
                Cancel Appointment?
            </h3>
            <p className='text-xs text-slate-400 text-center mb-5 leading-relaxed'>
                This action cannot be undone. The doctor will be notified of the cancellation.
            </p>
            <div className='flex gap-2'>
                <button
                    onClick={onClose}
                    className='flex-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 text-xs font-bold text-slate-600 transition-all'
                >
                    Keep it
                </button>
                <button
                    onClick={onConfirm}
                    className='flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 py-2 text-xs font-bold text-white shadow-md shadow-rose-100 transition-all'
                >
                    Yes, Cancel
                </button>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────────────────── */
interface StarRatingProps {
    onRate: (rating: number) => void;
    existing?: number;
}
const StarRating: React.FC<StarRatingProps> = ({ onRate, existing }) => {
    const [hover, setHover] = useState(0);
    const [selected, setSelected] = useState(existing ?? 0);
    if (selected > 0)
        return (
            <div className='flex items-center gap-1 mt-2'>
                {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i <= selected ? "text-amber-400" : "text-slate-200"}`}
                    />
                ))}
                <span className='text-[11px] text-slate-400 ml-1 font-medium'>Your rating</span>
            </div>
        );
    return (
        <div className='flex items-center gap-1 mt-2'>
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => {
                        setSelected(i);
                        onRate(i);
                    }}
                    className='p-0.5 transition-transform hover:scale-110 active:scale-95'
                >
                    <StarIcon
                        className={`w-4 h-4 transition-colors ${i <= (hover || selected) ? "text-amber-400" : "text-slate-200"}`}
                    />
                </button>
            ))}
            <span className='text-[11px] text-slate-400 ml-1 font-medium'>Rate this visit</span>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   DOCTOR AVATAR GRADIENTS
───────────────────────────────────────────────────────── */
const avatarGradients: Record<string, string> = {
    "bg-blue-500": "from-blue-400 to-blue-600",
    "bg-rose-500": "from-rose-400 to-rose-600",
    "bg-amber-500": "from-amber-400 to-amber-600",
    "bg-emerald-500": "from-emerald-400 to-emerald-600",
    "bg-purple-500": "from-purple-400 to-purple-600",
    "bg-teal-500": "from-teal-400 to-teal-600",
};

/* ─────────────────────────────────────────────────────────
   UPCOMING CARD (patient view)
───────────────────────────────────────────────────────── */
interface UpcomingCardProps {
    apt: Appointment;
    onJoin: (id: string) => void;
    onCancel: (id: string) => void;
    canJoinCall: boolean;
    onDoctorProfile: (id: string) => void;
}
const UpcomingCard: React.FC<UpcomingCardProps> = ({
    apt,
    onJoin,
    onCancel,
    canJoinCall,
    onDoctorProfile,
}) => {
    const [showCancel, setShowCancel] = useState(false);
    const isLive = apt.status === "Progress";
    const isScheduled = apt.status === "Scheduled";
    const isVideo = apt.consultationType === "video";
    const relDate = formatRelative(apt.date);
    const isToday = relDate === "Today";
    const paid = apt.paymentDetails?.paymentStatus === "Paid";
    const grad = avatarGradients[apt.doctorID?.avatarColor] ?? "from-blue-400 to-blue-600";
    const [startTime, startPeriod] = splitTime(apt.slotStart);
    const [endTime, endPeriod] = splitTime(apt.slotEnd);

    return (
        <>
            {showCancel && (
                <CancelModal
                    onConfirm={() => {
                        onCancel(apt._id);
                        setShowCancel(false);
                    }}
                    onClose={() => setShowCancel(false)}
                />
            )}

            <div
                className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                    isLive
                        ? "border-blue-300 bg-gradient-to-br from-blue-50/80 via-blue-50/40 to-white shadow-lg shadow-blue-200/60 ring-2 ring-blue-400/40"
                        : "border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-white shadow-md shadow-blue-100/60 ring-1 ring-blue-200/40"
                }`}
            >
                {/* Animated glow for ongoing meeting */}
                <div className='absolute inset-0 pointer-events-none'>
                    {isLive && (
                        <>
                            <div className='absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse' />
                            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-300/5 to-blue-500/0 pointer-events-none' />
                        </>
                    )}
                    {!isLive && (
                        <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent' />
                    )}
                </div>

                <div className='flex'>
                    {/* ── Time Sidebar ── */}
                    <div
                        className={`flex flex-col items-center justify-between px-3 py-4 border-r min-w-[72px] ${
                            isLive
                                ? "border-blue-300 bg-gradient-to-b from-blue-100/60 to-blue-50/40"
                                : "border-blue-100 bg-blue-50/60"
                        }`}
                    >
                        <div className='flex flex-col items-center gap-1.5'>
                            <div
                                className={`w-2 h-2 rounded-full ${isLive ? "bg-blue-600 animate-pulse" : "bg-blue-500"}`}
                            />
                            <span
                                className={`text-[9px] font-bold tracking-wider uppercase ${isLive ? "text-blue-700" : "text-blue-500"}`}
                            >
                                {isLive ? "LIVE" : isToday ? "TODAY" : relDate.toUpperCase()}
                            </span>
                        </div>
                        <div className='flex flex-col items-center gap-0.5 mt-3'>
                            <span
                                className={`text-[15px] font-black tabular-nums leading-none ${isLive ? "text-blue-800" : "text-blue-700"}`}
                            >
                                {startTime}
                            </span>
                            <span
                                className={`text-[9px] font-bold uppercase ${isLive ? "text-blue-600" : "text-blue-400"}`}
                            >
                                {startPeriod}
                            </span>
                            <div
                                className={`w-px h-3 ${isLive ? "bg-blue-300" : "bg-blue-100"} my-0.5`}
                            />
                            <span className='text-[10px] font-semibold text-slate-400 tabular-nums'>
                                {endTime}
                            </span>
                            <span className='text-[9px] text-slate-300 uppercase'>{endPeriod}</span>
                        </div>
                        <div
                            className={`mt-3 w-7 h-7 rounded-xl flex items-center justify-center ${isVideo ? "bg-blue-200 text-blue-600" : "bg-blue-100 text-blue-500"}`}
                        >
                            {isVideo ? <VideoIcon /> : <AudioIcon />}
                        </div>
                    </div>

                    {/* ── Main Content ── */}
                    <div className='flex-1 min-w-0 p-4'>
                        <div className='flex items-start justify-between gap-3 mb-3'>
                            <div className='flex items-center gap-2.5'>
                                {/* Doctor avatar */}
                                <button
                                    onClick={() => onDoctorProfile(apt.doctorID?._id)}
                                    className='shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-transform hover:scale-105 active:scale-95'
                                >
                                    <div
                                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-black shadow-md ring-2 ring-white`}
                                    >
                                        {apt.doctorID?.avatar ??
                                            apt.doctorID?.name?.slice(0, 2).toUpperCase()}
                                    </div>
                                </button>
                                <div>
                                    <div className='flex items-center gap-1.5 flex-wrap'>
                                        <button
                                            onClick={() => onDoctorProfile(apt.doctorID?._id)}
                                            className='text-[14px] font-bold text-slate-800 hover:text-blue-600 hover:underline underline-offset-2 transition-colors leading-tight'
                                        >
                                            {apt.doctorID?.name}
                                        </button>
                                        {apt.isFollowUp && (
                                            <span className='inline-flex items-center gap-0.5 rounded-full bg-violet-50 border border-violet-200 px-1.5 py-0.5 text-[9px] font-bold text-violet-600 uppercase tracking-wide'>
                                                <RepeatIcon /> Follow-up
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-[11px] text-blue-500 font-semibold mt-0.5'>
                                        {apt.doctorID?.specialization ?? "General Physician"}
                                    </p>
                                </div>
                            </div>
                            <div className='shrink-0'>
                                {paid ? (
                                    <span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700'>
                                        <CheckIcon className='text-emerald-500' /> ₹
                                        {apt.paymentDetails?.totalFees} Paid
                                    </span>
                                ) : (
                                    <span className='inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700'>
                                        ₹{apt.paymentDetails?.totalFees}{" "}
                                        <span className='opacity-70'>pending</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {apt.symptoms && (
                            <div
                                className={`rounded-xl px-3 py-2 mb-3 ${isLive ? "bg-blue-100/60 border border-blue-200 shadow-sm shadow-blue-100" : "bg-blue-50/60 border border-blue-100"}`}
                            >
                                <p
                                    className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isLive ? "text-blue-600" : "text-blue-400"}`}
                                >
                                    Your Complaint
                                </p>
                                <p className='text-xs text-slate-600 leading-relaxed line-clamp-2'>
                                    {apt.symptoms}
                                </p>
                            </div>
                        )}

                        {/* Meeting Ongoing Badge - Prominent positioning */}
                        {isLive && (
                            <div className='mb-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-blue-200 animate-pulse'>
                                <span className='w-2 h-2 rounded-full bg-white animate-pulse' />
                                Meeting Ongoing Now
                            </div>
                        )}

                        <div className='flex items-center gap-1.5 flex-wrap mb-3'>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                    isLive
                                        ? "bg-blue-600 text-white border-blue-700 shadow-sm shadow-blue-200"
                                        : "bg-blue-600 text-white border-blue-700 shadow-sm shadow-blue-200"
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-white animate-pulse" : "bg-blue-200"}`}
                                />
                                {isLive ? "In Progress" : "Scheduled"}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${isVideo ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-blue-50/40 text-blue-400 border-blue-100"}`}
                            >
                                {isVideo ? (
                                    <VideoIcon className='text-blue-500' />
                                ) : (
                                    <AudioIcon className='text-blue-400' />
                                )}
                                {isVideo ? "Video Call" : "Audio Call"}
                            </span>
                            {!isToday && (
                                <span className='inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/40 px-2.5 py-1 text-[10px] font-bold text-blue-500'>
                                    <CalIcon className='text-blue-400' />
                                    {formatDate(apt.date)}
                                </span>
                            )}
                        </div>

                        <div className='flex items-center gap-2 flex-wrap'>
                            <button
                                onClick={() => onJoin(apt._id)}
                                disabled={!canJoinCall && !isLive}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                                    isLive
                                        ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                }`}
                            >
                                {isLive ? (
                                    <>
                                        <LightningIcon className='text-white' /> Rejoin Consultation
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width='10'
                                            height='10'
                                            viewBox='0 0 24 24'
                                            fill='currentColor'
                                        >
                                            <polygon points='5 3 19 12 5 21 5 3' />
                                        </svg>{" "}
                                        Join Consultation
                                    </>
                                )}
                            </button>

                            {isScheduled && (
                                <button
                                    onClick={() => setShowCancel(true)}
                                    className='flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 transition-all duration-150'
                                >
                                    <XIcon className='text-rose-500' /> Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ─────────────────────────────────────────────────────────
   PAST CARD (patient view)
───────────────────────────────────────────────────────── */
interface PastCardProps {
    apt: Appointment;
    onRate: (id: string, rating: number) => void;
    onDoctorProfile: (id: string) => void;
}
const PastCard: React.FC<PastCardProps> = ({ apt, onRate, onDoctorProfile }) => {
    const statusMeta = {
        Scheduled: {
            dot: "bg-blue-500",
            pill: "bg-blue-50 text-blue-700 border-blue-200",
            label: "Scheduled",
        },
        Progress: {
            dot: "bg-emerald-500",
            pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
            label: "In Progress",
        },
        Completed: {
            dot: "bg-blue-500",
            pill: "bg-blue-50 text-blue-700 border-blue-200",
            label: "Completed",
        },
        Cancelled: {
            dot: "bg-rose-500",
            pill: "bg-rose-50 text-rose-700 border-rose-200",
            label: "Cancelled",
        },
    }[apt.status];

    const accentBar = {
        Scheduled: "bg-blue-400",
        Progress: "bg-emerald-500",
        Completed: "bg-blue-500",
        Cancelled: "bg-rose-400",
    }[apt.status];
    const isVideo = apt.consultationType === "video";
    const paid = apt.paymentDetails?.paymentStatus === "Paid";
    const relDate = formatRelative(apt.date);
    const grad = avatarGradients[apt.doctorID?.avatarColor] ?? "from-blue-400 to-blue-600";

    return (
        <div className='relative rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200'>
            <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${accentBar}`} />
            <div className='absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-400/60 via-blue-300/40 to-transparent' />

            <div className='px-5 py-4'>
                {/* Doctor info row */}
                <div className='flex items-start gap-3 mb-3'>
                    <button
                        onClick={() => onDoctorProfile(apt.doctorID?._id)}
                        className='shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-transform hover:scale-105 active:scale-95'
                    >
                        <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-black ring-2 ring-white shadow-sm`}
                        >
                            {apt.doctorID?.avatar ?? apt.doctorID?.name?.slice(0, 2).toUpperCase()}
                        </div>
                    </button>
                    <div className='flex-1 min-w-0'>
                        <div className='flex flex-wrap items-center gap-2 mb-0.5'>
                            <button
                                onClick={() => onDoctorProfile(apt.doctorID?._id)}
                                className='text-sm font-bold text-slate-800 hover:text-blue-600 hover:underline underline-offset-2 transition-colors leading-tight'
                            >
                                {apt.doctorID?.name}
                            </button>
                            <span className='text-[11px] text-blue-500 font-semibold'>
                                {apt.doctorID?.specialization ?? "General Physician"}
                            </span>
                        </div>
                        <div className='flex items-center gap-1 text-[11px] text-slate-400'>
                            <StethIcon className='text-blue-300' />
                            {apt.doctorID?.hospital ??
                                apt.doctorID?.clinic ??
                                "Docure Health Clinic"}
                        </div>
                    </div>
                    <div className='shrink-0'>
                        {paid ? (
                            <span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700'>
                                <CheckIcon className='text-emerald-500' /> ₹
                                {apt.paymentDetails?.totalFees} Paid
                            </span>
                        ) : (
                            <span className='inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700'>
                                ₹{apt.paymentDetails?.totalFees} Pending
                            </span>
                        )}
                    </div>
                </div>

                <div className='h-px bg-blue-50 mb-3' />

                {/* Metadata chips */}
                <div className='flex flex-wrap items-center gap-1.5 mb-3'>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusMeta.pill}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                        {statusMeta.label}
                    </span>
                    <span className='inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/60 px-2 py-0.5 text-[11px] font-semibold text-blue-500'>
                        <ClockIcon className='text-blue-400' />
                        {relDate}
                    </span>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${isVideo ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-blue-50/40 text-blue-400 border-blue-100"}`}
                    >
                        {isVideo ? (
                            <VideoIcon className='text-blue-500' />
                        ) : (
                            <AudioIcon className='text-blue-400' />
                        )}
                        {isVideo ? "Video" : "Audio"}
                    </span>
                </div>

                {/* Date & time */}
                <p className='text-xs font-semibold text-slate-700'>
                    {formatDate(apt.date)}
                    <span className='mx-1.5 text-blue-200'>·</span>
                    <span className='font-normal text-slate-500'>
                        {formatTime(apt.slotStart)} – {formatTime(apt.slotEnd)}
                    </span>
                </p>

                {apt.symptoms && (
                    <p className='mt-0.5 text-xs text-slate-400 line-clamp-2'>{apt.symptoms}</p>
                )}

                {/* Doctor's notes (read-only) */}
                {apt.status === "Completed" && apt.notes && <NotesSection notes={apt.notes} />}

                {/* Prescription viewer */}
                {apt.status === "Completed" && <PrescriptionViewer apt={apt} />}

                {/* Follow-up badge */}
                {apt.isFollowUp && (
                    <div className='mt-2 inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2 py-1 text-[11px] font-bold text-violet-600'>
                        <RepeatIcon /> Follow-up Visit
                    </div>
                )}

                {/* Star rating for completed */}
                {apt.status === "Completed" && (
                    <StarRating
                        onRate={(rating) => onRate(apt._id, rating)}
                        existing={apt.rating}
                    />
                )}

                {/* Footer actions */}
                <div className='flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-blue-50'>
                    {apt.status === "Completed" && (
                        <button className='flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-150'>
                            <RepeatIcon className='text-blue-500' /> Book Follow-up
                        </button>
                    )}
                    {apt.status === "Cancelled" && (
                        <>
                            <span className='text-[10px] font-semibold uppercase tracking-wider text-rose-300'>
                                Cancelled
                            </span>
                            <button className='ml-auto flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-150'>
                                <CalIcon className='text-blue-500' /> Rebook
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   SINGLE LIVE CARD (patient view)
───────────────────────────────────────────────────────── */
const LiveConsultationCard = ({
    apt,
    onJoin,
    onDoctorProfile,
}: {
    apt: Appointment;
    onJoin: (id: string) => void;
    onDoctorProfile: (id: string) => void;
}) => {
    const grad = avatarGradients[apt.doctorID?.avatarColor] ?? "from-blue-400 to-blue-600";
    const isVideo = apt.consultationType === "video";
    const elapsed = useElapsed(apt.slotStart);
    const paid = apt.paymentDetails?.paymentStatus === "Paid";

    return (
        <div className='group relative rounded-[20px] overflow-hidden shadow-lg shadow-blue-200/50'>
            {/* Animated gradient bg */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 animate-gradient-x' />

            {/* Decorative orbs */}
            <div className='absolute -top-20 -right-20 w-72 h-72 bg-white/[0.07] rounded-full blur-2xl' />
            <div className='absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-400/10 rounded-full blur-2xl' />
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-32 bg-white/[0.03] rounded-full blur-3xl rotate-12' />

            {/* Content */}
            <div className='relative p-5 sm:p-6'>
                {/* Top row: live badge + timer */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <span className='relative flex h-2.5 w-2.5'>
                            <span className='absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping' />
                            <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30' />
                        </span>
                        <span className='text-[11px] font-black uppercase tracking-[0.15em] text-emerald-300'>
                            Live Consultation
                        </span>
                    </div>

                    <div className='flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1'>
                        <ClockIcon className='text-white/70' />
                        <span className='text-xs font-bold text-white tabular-nums'>{elapsed}</span>
                    </div>
                </div>

                {/* Doctor row */}
                <div className='flex items-center gap-4 mb-4'>
                    <button
                        onClick={() => onDoctorProfile(apt.doctorID?._id)}
                        className='shrink-0 relative focus:outline-none focus:ring-2 focus:ring-white/40 rounded-full'
                    >
                        <div
                            className={`w-14 h-14 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[17px] font-black shadow-xl ring-[3px] ring-white/25 transition-transform group-hover:scale-105 duration-200`}
                        >
                            {apt.doctorID?.avatar ?? apt.doctorID?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <span className='absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-[2.5px] border-indigo-600 flex items-center justify-center'>
                            <span className='w-1.5 h-1.5 bg-white rounded-full animate-pulse' />
                        </span>
                    </button>

                    <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            <button
                                onClick={() => onDoctorProfile(apt.doctorID?._id)}
                                className='text-[17px] font-black text-white hover:text-blue-200 transition-colors truncate'
                            >
                                {apt.doctorID?.name}
                            </button>
                            {apt.isFollowUp && (
                                <span className='inline-flex items-center gap-0.5 rounded-full bg-violet-400/20 border border-violet-300/30 px-1.5 py-0.5 text-[9px] font-bold text-violet-200 uppercase tracking-wide'>
                                    <RepeatIcon /> Follow-up
                                </span>
                            )}
                        </div>
                        <p className='text-blue-200 text-xs font-semibold mt-0.5'>
                            {apt.doctorID?.specialization ?? "General Physician"}
                        </p>
                        <div className='flex items-center gap-2 mt-1 flex-wrap'>
                            <span className='flex items-center gap-1 text-white/60 text-xs'>
                                <StethIcon className='text-white/50' />{" "}
                                {apt.doctorID?.hospital ?? apt.doctorID?.clinic ?? "Docure Health"}
                            </span>
                        </div>
                    </div>

                    {/* Payment chip */}
                    <div className='shrink-0 hidden sm:block'>
                        {paid ? (
                            <span className='inline-flex items-center gap-1 rounded-full bg-emerald-400/15 border border-emerald-400/25 px-2.5 py-1 text-[10px] font-bold text-emerald-300'>
                                <CheckIcon className='text-emerald-400' /> ₹
                                {apt.paymentDetails?.totalFees}
                            </span>
                        ) : (
                            <span className='inline-flex items-center gap-1 rounded-full bg-amber-400/15 border border-amber-400/25 px-2.5 py-1 text-[10px] font-bold text-amber-300'>
                                ₹{apt.paymentDetails?.totalFees}{" "}
                                <span className='opacity-70'>pending</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Info pills row */}
                <div className='flex flex-wrap items-center gap-2 mb-4'>
                    <div
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${
                            isVideo
                                ? "bg-blue-400/15 border-blue-400/25 text-blue-200"
                                : "bg-white/10 border-white/15 text-white/80"
                        }`}
                    >
                        {isVideo ? (
                            <VideoIcon className='text-blue-300' />
                        ) : (
                            <AudioIcon className='text-white/60' />
                        )}
                        {isVideo ? "Video Call" : "Audio Call"}
                    </div>
                    <div className='inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold text-white/80 uppercase tracking-wider'>
                        <ClockIcon className='text-white/50' />
                        {formatTime(apt.slotStart)} – {formatTime(apt.slotEnd)}
                    </div>
                    <div className='inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold text-white/80 uppercase tracking-wider'>
                        <CalIcon className='text-white/50' />
                        {formatDate(apt.date)}
                    </div>
                </div>

                {/* Symptoms */}
                {apt.symptoms && (
                    <div className='rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/15 px-4 py-2.5 mb-4'>
                        <p className='text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 mb-1'>
                            Your Complaint
                        </p>
                        <p className='text-[13px] text-white/90 font-medium leading-relaxed line-clamp-2'>
                            {apt.symptoms}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className='flex items-center gap-2.5'>
                    <button
                        onClick={() => onJoin(apt._id)}
                        className='flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-[13px] font-extrabold shadow-lg shadow-black/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                    >
                        <LightningIcon className='w-3.5 h-3.5 text-blue-600' />
                        Rejoin Consultation
                        <svg
                            width='13'
                            height='13'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2.5'
                            className='ml-0.5 transition-transform group-hover:translate-x-0.5'
                        >
                            <path d='M5 12h14M12 5l7 7-7 7' />
                        </svg>
                    </button>

                    <button
                        onClick={() => onDoctorProfile(apt.doctorID?._id)}
                        className='flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200'
                    >
                        <UserIcon className='text-white/70' />
                        Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   CURRENT CONSULTATION SECTION (patient view)
───────────────────────────────────────────────────────── */
const CurrentConsultationSection = ({
    currentConsultations,
    onJoin,
    onDoctorProfile,
}: {
    currentConsultations: Appointment[];
    onJoin: (id: string) => void;
    onDoctorProfile: (id: string) => void;
}) => {
    if (currentConsultations.length === 0) return null;

    return (
        <div className='mb-6 animate-fadeIn'>
            <div className='flex items-center gap-2.5 mb-4'>
                <div className='relative w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200'>
                    <span className='absolute inset-0 rounded-lg bg-emerald-400 animate-ping opacity-20' />
                    <LiveIcon className='relative text-white w-3.5 h-3.5' />
                </div>
                <h2 className='text-sm font-black uppercase tracking-wider text-slate-800'>
                    Active Now
                    <span className='ml-2 inline-flex items-center justify-center bg-emerald-500 text-white text-[10px] font-black rounded-full w-5 h-5 shadow-sm shadow-emerald-200'>
                        {currentConsultations.length}
                    </span>
                </h2>
                <div className='flex-1 h-px bg-gradient-to-r from-emerald-200 via-blue-100 to-transparent' />
            </div>

            <div className='grid gap-4'>
                {currentConsultations.map((apt) => (
                    <LiveConsultationCard
                        key={apt._id}
                        apt={apt}
                        onJoin={onJoin}
                        onDoctorProfile={onDoctorProfile}
                    />
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   TODAY STRIP (patient POV)
───────────────────────────────────────────────────────── */
const TodayStrip = ({ apts }: { apts: Appointment[] }) => {
    const todayApts = apts.filter((a) => formatRelative(a.date) === "Today");
    const live = todayApts.find((a) => a.status === "Progress");

    return (
        <div className='rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 p-4 mb-5 text-white overflow-hidden relative'>
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute top-0 right-0 w-48 h-48 rounded-full bg-white -translate-y-16 translate-x-16' />
                <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white translate-y-12' />
            </div>
            <div className='relative flex items-center justify-between flex-wrap gap-3'>
                <div>
                    <div className='flex items-center gap-2 mb-1'>
                        <CalIcon className='text-blue-200' />
                        <span className='text-xs font-bold uppercase tracking-widest text-blue-200'>
                            Your Schedule Today
                        </span>
                    </div>
                    <p className='text-xl font-black text-white'>
                        {new Date().toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                    <p className='text-xs text-blue-200 mt-0.5'>
                        {todayApts.length} appointment{todayApts.length !== 1 ? "s" : ""} today
                    </p>
                </div>
                <div className='flex items-center gap-3'>
                    {live && (
                        <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20'>
                            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                            <span className='text-xs font-bold text-white'>
                                In session with Dr. {live.doctorID?.name?.split(" ").pop()}
                            </span>
                        </div>
                    )}
                    <div className='text-right'>
                        <p className='text-2xl font-black tabular-nums'>{todayApts.length}</p>
                        <p className='text-[10px] text-blue-200 uppercase tracking-wider'>Today</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   DATE DIVIDER
───────────────────────────────────────────────────────── */
const DateDivider = ({ label }: { label: string }) => (
    <div className='flex items-center gap-3 my-2'>
        <div className='flex-1 h-px bg-blue-100' />
        <span className='text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100'>
            {label}
        </span>
        <div className='flex-1 h-px bg-blue-100' />
    </div>
);

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
const PatientAppointments: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
    const [tabCount, setTabCount] = useState<TabCnt>({ upcoming: 0, past: 0 });
    const [search, setSearch] = useState("");
    const [upcoming, setUpcoming] = useState<Appointment[]>([]);
    const [past, setPast] = useState<Appointment[]>([]);
    const [ongoing, setOngoing] = useState<Appointment[]>([]);

    const { user } = userAuthStore();
    const { appointments, fetchAppointment, cancelAppointment } = useAppointmentStore();

    useEffect(() => {
        if (user?.type === "patient") fetchAppointment("patient", activeTab);
    }, [user, activeTab, fetchAppointment]);

    useEffect(() => {
        const now = new Date();
        const ongoingApt = appointments.filter((apt) => {
            const aptDate = new Date(apt.slotStart);
            const aptEndDate = new Date(apt.slotEnd);
            const isTimeOngoing = now >= aptDate && now <= aptEndDate;
            return isTimeOngoing && (apt.status === "Scheduled" || apt.status === "Progress");
        });
        const ongoingIds = new Set(ongoingApt.map((a) => a._id));
        const upcomingApt = appointments.filter((apt) => {
            if (ongoingIds.has(apt._id)) return false;
            const aptDate = new Date(apt.slotStart);
            return now <= aptDate && apt.status === "Scheduled";
        });
        const pastApt = appointments.filter((apt) => {
            if (ongoingIds.has(apt._id)) return false;
            const aptDate = new Date(apt.slotStart);
            return now > aptDate && (apt.status === "Completed" || apt.status === "Cancelled");
        });
        setOngoing(ongoingApt);
        setUpcoming(upcomingApt);
        setPast(pastApt);
        setTabCount({ upcoming: upcomingApt.length, past: pastApt.length });
    }, [appointments]);

    const handleCancel = async (aptId: string) => {
        try {
            await cancelAppointment?.(aptId);
            setUpcoming((prev) => prev.filter((a) => a._id !== aptId));
            setTabCount((c) => ({ ...c, upcoming: c.upcoming - 1 }));
        } catch (err) {
            console.error("Failed to cancel appointment:", err);
        }
    };

    const handleRate = (aptId: string, rating: number) => {
        setPast((prev) => prev.map((a) => (a._id === aptId ? { ...a, rating } : a)));
    };

    const canJoinCall = (appointment: Appointment) => {
        const now = new Date();
        const strtTime = new Date(appointment.slotStart);
        const endTime = new Date(appointment.slotEnd);
        const diff = (strtTime.getTime() - now.getTime()) / 60000;
        return (
            diff <= 10 &&
            now <= endTime &&
            (appointment.status === "Progress" || appointment.status === "Scheduled")
        );
    };

    const list = activeTab === "upcoming" ? upcoming : past;

    const filtered = useMemo(() => {
        if (!search.trim()) return list;
        const q = search.toLowerCase();
        return list.filter(
            (a) =>
                a.doctorID?.name?.toLowerCase().includes(q) ||
                a.doctorID?.specialization?.toLowerCase().includes(q) ||
                a.symptoms?.toLowerCase().includes(q) ||
                a.status.toLowerCase().includes(q),
        );
    }, [list, search]);

    const upcomingGroups = useMemo(() => {
        if (activeTab !== "upcoming") return null;
        const groups: Record<string, Appointment[]> = {};
        filtered.forEach((a) => {
            const label = formatRelative(a.date);
            if (!groups[label]) groups[label] = [];
            groups[label].push(a);
        });
        return groups;
    }, [filtered, activeTab]);

    /* Quick stats for past tab */
    const pastStats = useMemo(() => {
        const completed = past.filter((a) => a.status === "Completed").length;
        const cancelled = past.filter((a) => a.status === "Cancelled").length;
        const prescribed = past.filter(
            (a) => a.status === "Completed" && a.pescription != null,
        ).length;
        return { completed, cancelled, prescribed };
    }, [past]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white px-4 py-8 sm:px-8'>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .appt-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            {/* BG blobs */}
            <div className='pointer-events-none fixed inset-0 overflow-hidden'>
                <div className='absolute -top-40 left-1/3 w-[700px] h-[400px] bg-blue-100/40 rounded-full blur-[130px]' />
                <div className='absolute bottom-0 right-0 w-64 h-64 bg-blue-50/60 rounded-full blur-[90px]' />
            </div>

            <div className='appt-root relative mx-auto w-full max-w-3xl'>
                {/* HEADER */}
                <div className='mb-7'>
                    <button
                        onClick={() => router.push("/patient/dashboard")}
                        className='flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-semibold mb-5 transition-colors'
                    >
                        <ArrowLeft className='text-slate-400' /> Back to Dashboard
                    </button>
                    <div className='flex items-end justify-between gap-4 flex-wrap'>
                        <div>
                            <div className='flex items-center gap-2 mb-1.5'>
                                <div className='w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200'>
                                    <CalIcon className='text-white' />
                                </div>
                                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-blue-600'>
                                    My Appointments
                                </span>
                            </div>
                            <h1 className='text-[28px] font-black text-slate-900 leading-tight'>
                                My Consultations
                            </h1>
                            <p className='mt-1 text-sm text-slate-500 font-medium'>
                                Track your visits, prescriptions &amp; follow-ups.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/patient/book")}
                            className='flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-200 transition-all duration-200 active:scale-95'
                        >
                            <CalIcon className='text-white' /> Book New
                        </button>
                    </div>
                </div>

                {/* CURRENT CONSULTATION - shows live sessions */}
                <CurrentConsultationSection
                    currentConsultations={ongoing}
                    onJoin={(id) => router.push(`/call/${id}`)}
                    onDoctorProfile={(id) => router.push(`/doctor/${id}`)}
                />

                {/* TODAY STRIP */}
                {activeTab === "upcoming" && !search && <TodayStrip apts={upcoming} />}

                {/* PAST STATS */}
                {activeTab === "past" && (
                    <div className='grid grid-cols-3 gap-3 mb-5'>
                        {[
                            {
                                label: "Completed",
                                val: pastStats.completed,
                                cls: "border-blue-200 bg-blue-50 text-blue-700",
                            },
                            {
                                label: "Prescriptions",
                                val: pastStats.prescribed,
                                cls: "border-emerald-200 bg-emerald-50 text-emerald-700",
                            },
                            {
                                label: "Cancelled",
                                val: pastStats.cancelled,
                                cls: "border-rose-200 bg-rose-50 text-rose-700",
                            },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className={`rounded-2xl border px-4 py-3 flex items-center justify-between shadow-sm ${s.cls}`}
                            >
                                <span className='text-xs font-bold'>{s.label}</span>
                                <span className='text-xl font-black'>{s.val}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* TABS + SEARCH */}
                <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-5'>
                    <div className='inline-flex p-1 rounded-2xl bg-white border border-blue-100 shadow-sm gap-1'>
                        {(
                            [
                                {
                                    key: "upcoming" as TabKey,
                                    label: "Upcoming",
                                    count: tabCount.upcoming,
                                },
                                {
                                    key: "past" as TabKey,
                                    label: "Past 7 Days",
                                    count: tabCount.past,
                                },
                            ] as const
                        ).map((tab) => {
                            const active = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        setActiveTab(tab.key);
                                        setSearch("");
                                    }}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${active ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"}`}
                                >
                                    {tab.label}
                                    <span
                                        className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-black tabular-nums ${active ? "bg-white/25 text-white" : "bg-blue-50 text-blue-500"}`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className='relative flex-1 sm:max-w-xs'>
                        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-blue-400' />
                        <input
                            type='text'
                            placeholder='Search doctor, symptom…'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-blue-100 bg-white shadow-sm text-slate-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition font-medium'
                        />
                    </div>
                </div>

                {/* CARD CONTAINER */}
                <div className='rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-100/40 overflow-hidden'>
                    <div className='flex items-center justify-between px-6 py-3.5 border-b border-blue-50 bg-blue-50/50'>
                        <span className='text-xs font-bold text-blue-500 flex items-center gap-1.5'>
                            <CalIcon className='text-blue-400' />
                            {activeTab === "upcoming"
                                ? "Upcoming Appointments"
                                : "Past 7 Days — History"}
                        </span>
                        <span className='text-xs text-blue-300 font-mono'>
                            {filtered.length} records
                        </span>
                    </div>

                    <div className='p-4 sm:p-5'>
                        {filtered.length === 0 && (
                            <div className='flex flex-col items-center justify-center gap-3 py-14 text-center'>
                                <div className='w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center'>
                                    <CalIcon className='text-blue-400' />
                                </div>
                                <p className='text-sm font-bold text-slate-700'>
                                    No appointments found
                                </p>
                                <p className='text-xs text-slate-400 mb-2'>
                                    Try adjusting your search or switch tabs.
                                </p>
                                <button
                                    onClick={() => router.push("/patient/book")}
                                    className='flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-200 transition-all'
                                >
                                    <CalIcon className='text-white' /> Book an appointment
                                </button>
                            </div>
                        )}

                        {/* UPCOMING grouped */}
                        {activeTab === "upcoming" && upcomingGroups && (
                            <div className='space-y-1'>
                                {Object.entries(upcomingGroups).map(([dateLabel, apts], gi) => (
                                    <div key={dateLabel}>
                                        {gi > 0 && <DateDivider label={dateLabel} />}
                                        {gi === 0 && dateLabel === "Today" && (
                                            <div className='flex items-center gap-2 mb-3'>
                                                <span className='text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5'>
                                                    Today
                                                </span>
                                                <div className='flex-1 h-px bg-blue-100' />
                                            </div>
                                        )}
                                        <div className='space-y-3'>
                                            {apts.map((apt) => (
                                                <UpcomingCard
                                                    key={apt._id}
                                                    apt={apt}
                                                    canJoinCall={canJoinCall(apt)}
                                                    onJoin={(id) => router.push(`/call/${id}`)}
                                                    onCancel={handleCancel}
                                                    onDoctorProfile={(id) =>
                                                        router.push(`/doctor/${id}`)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PAST flat list */}
                        {activeTab === "past" && (
                            <div className='space-y-3'>
                                {filtered.map((apt) => (
                                    <PastCard
                                        key={apt._id}
                                        apt={apt}
                                        onRate={handleRate}
                                        onDoctorProfile={(id) =>
                                            router.push(`/patient/doctors/${id}`)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <p className='mt-5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pb-2'>
                    <svg
                        width='10'
                        height='10'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        className='text-slate-400'
                    >
                        <rect x='3' y='11' width='18' height='11' rx='2' />
                        <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                    </svg>
                    End-to-end encrypted · Docure Telehealth Platform
                </p>
            </div>
        </div>
    );
};

export default PatientAppointments;
