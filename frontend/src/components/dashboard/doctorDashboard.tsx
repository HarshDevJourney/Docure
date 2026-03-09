"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";

/* ─────────────────────────────────────────────────────────
   DUMMY DATA
───────────────────────────────────────────────────────── */
const STATS = {
  todayTotal: 4,
  todayDone: 1,
  weekCompleted: 18,
  weekCancelled: 3,
  weekRevenue: 9000,
  pendingPayments: 2,
  totalPatients: 84,
  avgRating: 4.8,
  reviewCount: 112,
};

const TODAY_SCHEDULE = [
  { time: "9:00 AM",  patient: "Anjali Singh", type: "video" as const, status: "Completed" as const },
  { time: "10:00 AM", patient: "Harsh Sharma", type: "video" as const, status: "Progress"  as const },
  { time: "11:30 AM", patient: "Ravi Kumar",   type: "audio" as const, status: "Scheduled" as const },
  { time: "2:00 PM",  patient: "Meera Patel",  type: "video" as const, status: "Scheduled" as const },
];

const RECENT_PATIENTS = [
  { _id: "pat_anjali", name: "Anjali Singh",  reason: "Anxiety follow-up",        avatar: "AS", color: "bg-emerald-500", time: "1h ago"   },
  { _id: "pat_harsh",  name: "Harsh Sharma",  reason: "Fever & headache",          avatar: "HS", color: "bg-blue-500",   time: "Today"    },
  { _id: "pat_ravi",   name: "Ravi Kumar",    reason: "Blood pressure monitoring", avatar: "RK", color: "bg-amber-500",  time: "Yesterday"},
  { _id: "pat_meera",  name: "Meera Patel",   reason: "Skin allergy follow-up",    avatar: "MP", color: "bg-rose-500",   time: "2d ago"   },
  { _id: "pat_vikram", name: "Vikram Nair",   reason: "Chest tightness",           avatar: "VN", color: "bg-purple-500", time: "3d ago"   },
];

const PENDING_ACTIONS = [
  { label: "Prescriptions pending",   count: 3, color: "text-rose-600 bg-rose-50 border-rose-200"       },
  { label: "Unpaid consultations",    count: 2, color: "text-amber-600 bg-amber-50 border-amber-200"     },
  { label: "Follow-ups this week",    count: 5, color: "text-blue-600 bg-blue-50 border-blue-200"        },
];

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */
const CalIcon    = ({ className }: { className?: string }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const VideoIcon  = ({ className }: { className?: string }) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const AudioIcon  = ({ className }: { className?: string }) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>;
const ChevronR   = ({ className }: { className?: string }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>;
const StarIcon   = ({ className }: { className?: string }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const PulseIcon  = ({ className }: { className?: string }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const UsersIcon  = ({ className }: { className?: string }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const RupeeIcon  = ({ className }: { className?: string }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 3h12M6 8h12M6 13l5 8m-5-8a5 5 0 0 1 5-5 5 5 0 0 0-5 5"/></svg>;
const AlertIcon  = ({ className }: { className?: string }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

/* ─────────────────────────────────────────────────────────
   STATUS HELPERS
───────────────────────────────────────────────────────── */
const scheduleStatusStyle: Record<string, { dot: string; badge: string }> = {
  Completed: { dot: "bg-emerald-500",              badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Progress:  { dot: "bg-blue-500 animate-pulse",   badge: "bg-blue-50 text-blue-700 border-blue-200"         },
  Scheduled: { dot: "bg-slate-300",                badge: "bg-slate-50 text-slate-500 border-slate-200"      },
};

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
const DoctorDashboard: React.FC = () => {
  const router = useRouter();
  const { user } = userAuthStore()

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white px-4 py-8 sm:px-8">

      {/* ambient blur */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[400px] bg-blue-100/40 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-100/60 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl space-y-6">

        {/* ── PAGE HEADER ───────────────────────────────── */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <PulseIcon className="text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Doctor Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {greeting()}, <span className="text-blue-600 font-bold font-stretch-90% text-4xl"> Dr. {user.name[0].toUpperCase() + user.name.slice(1)}</span> 
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <button
            onClick={() => router.push("/doctor/appointments")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-300/40 transition-all duration-150"
          >
            <CalIcon className="text-white" />
            View All Appointments
            <ChevronR className="text-white/70" />
          </button>
        </div>

        {/* ── STAT CARDS ────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Today */}
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <CalIcon className="text-blue-600" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-500">Today</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 leading-none">{STATS.todayTotal}</p>
            <p className="text-xs text-slate-400 mt-1">{STATS.todayDone} done · {STATS.todayTotal - STATS.todayDone} remaining</p>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-2xl border border-violet-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                <UsersIcon className="text-violet-600" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-violet-500">Patients</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 leading-none">{STATS.totalPatients}</p>
            <p className="text-xs text-slate-400 mt-1">Total registered</p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                <RupeeIcon className="text-emerald-600" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">Revenue</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 leading-none">₹{STATS.weekRevenue.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">This week · paid</p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                <StarIcon className="text-amber-500" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500">Rating</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 leading-none">{STATS.avgRating}</p>
            <p className="text-xs text-slate-400 mt-1">{STATS.reviewCount} reviews</p>
          </div>
        </div>

        {/* ── WEEK SUMMARY STRIP ────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="text-xs font-semibold text-emerald-700">Completed this week</span>
            <span className="text-xl font-bold text-emerald-700">{STATS.weekCompleted}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <span className="text-xs font-semibold text-rose-700">Cancelled this week</span>
            <span className="text-xl font-bold text-rose-700">{STATS.weekCancelled}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <span className="text-xs font-semibold text-amber-700">Pending payments</span>
            <span className="text-xl font-bold text-amber-700">{STATS.pendingPayments}</span>
          </div>
        </div>

        {/* ── MAIN GRID ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Today's schedule */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <CalIcon className="text-blue-500" />
                <span className="text-sm font-bold text-slate-700">Today's Schedule</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{TODAY_SCHEDULE.length} sessions</span>
            </div>
            <div className="divide-y divide-slate-100">
              {TODAY_SCHEDULE.map((s, i) => {
                const ss = scheduleStatusStyle[s.status];
                return (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/80 transition-colors group cursor-default">
                    <span className="text-xs font-mono text-slate-400 w-16 shrink-0">{s.time}</span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${ss.dot}`} />
                    <span className="text-sm font-semibold text-slate-700 flex-1">{s.patient}</span>
                    <span className={`flex items-center gap-1 text-[11px] font-semibold rounded-full border px-2 py-0.5 ${
                      s.type === "video" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {s.type === "video" ? <VideoIcon className="text-blue-500" /> : <AudioIcon className="text-slate-400" />}
                      {s.type}
                    </span>
                    <span className={`text-[11px] font-semibold rounded-full border px-2 py-0.5 ${ss.badge}`}>
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100">
              <button
                onClick={() => router.push("/doctor/appointments")}
                className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 transition-colors"
              >
                View all appointments <ChevronR className="text-blue-500" />
              </button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Pending actions */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                <AlertIcon className="text-rose-500" />
                <span className="text-sm font-bold text-slate-700">Action Required</span>
              </div>
              <div className="p-4 space-y-2">
                {PENDING_ACTIONS.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => router.push("/doctor/appointments")}
                    className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all hover:opacity-80 ${a.color}`}
                  >
                    <span>{a.label}</span>
                    <span className="text-base font-bold">{a.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent patients */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                <UsersIcon className="text-violet-500" />
                <span className="text-sm font-bold text-slate-700">Recent Patients</span>
              </div>
              <div className="divide-y divide-slate-100">
                {RECENT_PATIENTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(`/doctor/patients/${p._id}`)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.reason}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{p.time}</span>
                    <ChevronR className="text-slate-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pb-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          End-to-end encrypted · Docure Telehealth Platform
        </p>

      </div>
    </div>
  );
};

export default DoctorDashboard;