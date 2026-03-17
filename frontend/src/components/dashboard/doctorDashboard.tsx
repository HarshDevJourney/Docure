"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { userAuthStore } from "@/store/authStore";
import { useDoctorState } from "@/store/doctorStore";

/* ─── ICONS ─────────────────────────────────────────────── */
const CalIcon = ({ className }: { className?: string }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
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
const VideoIcon = ({ className }: { className?: string }) => (
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
    <path d='M23 7l-7 5 7 5V7z' />
    <rect x='1' y='5' width='15' height='14' rx='2' />
  </svg>
);
const AudioIcon = ({ className }: { className?: string }) => (
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
    <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
    <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
  </svg>
);
const ChevronR = ({ className }: { className?: string }) => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    className={className}
  >
    <polyline points='9 18 15 12 9 6' />
  </svg>
);
const PulseIcon = ({ className }: { className?: string }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
  </svg>
);
const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
    <circle cx='9' cy='7' r='4' />
    <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
  </svg>
);
const RupeeIcon = ({ className }: { className?: string }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M6 3h12M6 8h12M6 13l5 8m-5-8a5 5 0 0 1 5-5 5 5 0 0 0-5 5' />
  </svg>
);
const AlertIcon = ({ className }: { className?: string }) => (
  <svg
    width='16'
    height='16'
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
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);
const LockIcon = ({ className }: { className?: string }) => (
  <svg
    width='10'
    height='10'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    className={className}
  >
    <rect x='3' y='11' width='18' height='11' rx='2' />
    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
  </svg>
);
const TrendUpIcon = ({ className }: { className?: string }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <polyline points='23 6 13.5 15.5 8.5 10.5 1 18' />
    <polyline points='17 6 23 6 23 12' />
  </svg>
);

/* ─── HELPERS ────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-indigo-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ─── STATUS CONFIG ──────────────────────────────────────── */
const statusConfig: Record<string, { dot: string; badge: string }> = {
  Completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Progress: {
    dot: "bg-blue-500 animate-pulse",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Scheduled: {
    dot: "bg-slate-300",
    badge: "bg-slate-50 text-slate-500 border-slate-200",
  },
};

/* ─── SKELETON ───────────────────────────────────────────── */
const Skel = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className ?? ""}`} />
);

const DashboardSkeleton = () => (
  <div className='space-y-5'>
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
      {[...Array(4)].map((_, i) => (
        <Skel key={i} className='h-32' />
      ))}
    </div>
    <div className='grid grid-cols-3 gap-3'>
      {[...Array(3)].map((_, i) => (
        <Skel key={i} className='h-14' />
      ))}
    </div>
    <div className='grid lg:grid-cols-3 gap-5'>
      <Skel className='lg:col-span-2 h-72' />
      <div className='space-y-4'>
        <Skel className='h-44' />
        <Skel className='h-60' />
      </div>
    </div>
  </div>
);

/* ─── STAT CARD ──────────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: {
    border: string;
    iconBg: string;
    label: string;
    corner: string;
  };
}

const StatCard = ({ label, value, sub, icon, accent }: StatCardProps) => (
  <div
    className={`relative bg-white rounded-2xl border p-5 overflow-hidden shadow-sm ${accent.border}`}
  >
    {/* decorative corner */}
    <div
      className={`pointer-events-none absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-[0.07] ${accent.corner}`}
    />
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${accent.iconBg}`}>
      {icon}
    </div>
    <p className={`text-[10.5px] font-bold uppercase tracking-[0.12em] mb-2 ${accent.label}`}>
      {label}
    </p>
    <p className='text-3xl font-extrabold text-slate-900 leading-none'>{value}</p>
    <p className='text-[11.5px] text-slate-400 mt-1.5'>{sub}</p>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
const DoctorDashboard: React.FC = () => {
  const router = useRouter();
  const { user } = userAuthStore();
  const { dashboard, dashboardLoading, fetchDashboard } = useDoctorState();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = dashboard?.stats;
  const weekDaily = dashboard?.weekDaily ?? [];
  const todaySchedule = dashboard?.todaySchedule ?? [];
  const recentPatients = dashboard?.recentPatients ?? [];
  const pa = dashboard?.pendingActions;

  const completedCount = todaySchedule.filter((s) => s.status === "Completed").length;
  const inProgressCount = todaySchedule.filter((s) => s.status === "Progress").length;
  const remainingCount = todaySchedule.length - completedCount - inProgressCount;

  const pendingActions = pa
    ? [
        {
          label: "Prescriptions pending",
          count: pa.prescriptionsPending,
          cls: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100",
        },
        {
          label: "Unpaid consultations",
          count: pa.unpaidConsultations,
          cls: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
        },
        {
          label: "Follow-ups this week",
          count: pa.followUpsThisWeek,
          cls: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
        },
      ]
    : [];

  const doctorName = user?.name ? user.name[0].toUpperCase() + user.name.slice(1) : "";

  // Weekly chart helpers
  const maxDayTotal = Math.max(...weekDaily.map((d) => d.total), 1);
  const todayDow = new Date().getDay();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1;

  return (
    <div className='min-h-screen bg-[#f0f4f8] px-4 py-8 sm:px-8'>
      <div className='mx-auto w-full max-w-5xl space-y-5'>
        {/* ── PAGE HEADER ── */}
        <div className='flex items-end justify-between flex-wrap gap-4'>
          <div>
            {/* live badge */}
            <div className='inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full mb-3'>
              <span className='w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse' />
              <PulseIcon className='text-blue-600' />
              Doctor Dashboard · Docure
            </div>
            <h1
              className='text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight'
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {greeting()}, <span className='text-blue-600'>Dr. {doctorName}</span>
            </h1>
            <p className='mt-1 text-sm text-slate-500'>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={() => router.push("/doctor/appointments")}
            className='flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-300/40 transition-all duration-150'
          >
            <CalIcon className='text-white' />
            View All Appointments
            <ChevronR className='text-white/70' />
          </button>
        </div>

        {dashboardLoading || !dashboard ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* ── STAT CARDS ── */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
              <StatCard
                label='Today'
                value={stats?.todayTotal ?? 0}
                sub={`${stats?.todayDone ?? 0} done · ${(stats?.todayTotal ?? 0) - (stats?.todayDone ?? 0)} remaining`}
                icon={<CalIcon className='text-blue-600' />}
                accent={{
                  border: "border-blue-100",
                  iconBg: "bg-blue-100",
                  label: "text-blue-600",
                  corner: "bg-blue-600",
                }}
              />
              <StatCard
                label='Patients'
                value={stats?.totalPatients ?? 0}
                sub='Total consulted'
                icon={<UsersIcon className='text-violet-600' />}
                accent={{
                  border: "border-violet-100",
                  iconBg: "bg-violet-100",
                  label: "text-violet-600",
                  corner: "bg-violet-600",
                }}
              />
              <StatCard
                label='Revenue'
                value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`}
                sub={`₹${(stats?.weekRevenue ?? 0).toLocaleString()} this week`}
                icon={<RupeeIcon className='text-emerald-600' />}
                accent={{
                  border: "border-emerald-100",
                  iconBg: "bg-emerald-100",
                  label: "text-emerald-600",
                  corner: "bg-emerald-600",
                }}
              />
              <StatCard
                label='Completed'
                value={stats?.totalCompleted ?? 0}
                sub={`${stats?.totalCancelled ?? 0} cancelled all-time`}
                icon={<CheckIcon className='text-amber-600' />}
                accent={{
                  border: "border-amber-100",
                  iconBg: "bg-amber-100",
                  label: "text-amber-600",
                  corner: "bg-amber-600",
                }}
              />
            </div>

            {/* ── WEEKLY ACTIVITY ── */}
            <div className='bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'>
              <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70'>
                <div className='flex items-center gap-2'>
                  <TrendUpIcon className='text-blue-500' />
                  <span
                    className='text-sm font-bold text-slate-700'
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Weekly Activity
                  </span>
                </div>
                <div className='flex items-center gap-4 text-[10.5px] font-semibold text-slate-400'>
                  <span className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-blue-400' /> Total
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500' /> Completed
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-rose-400' /> Cancelled
                  </span>
                </div>
              </div>

              {/* Summary stats */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 pt-5 pb-2'>
                <div className='flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center'>
                    <CalIcon className='text-blue-600' />
                  </div>
                  <div>
                    <p className='text-xl font-extrabold text-slate-800 leading-none'>
                      {stats?.weekTotal ?? 0}
                    </p>
                    <p className='text-[10px] text-slate-400 mt-0.5'>Total this week</p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center'>
                    <CheckIcon className='text-emerald-600' />
                  </div>
                  <div>
                    <p className='text-xl font-extrabold text-slate-800 leading-none'>
                      {stats?.weekCompleted ?? 0}
                    </p>
                    <p className='text-[10px] text-slate-400 mt-0.5'>Completed</p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center'>
                    <AlertIcon className='text-rose-500' />
                  </div>
                  <div>
                    <p className='text-xl font-extrabold text-slate-800 leading-none'>
                      {stats?.weekCancelled ?? 0}
                    </p>
                    <p className='text-[10px] text-slate-400 mt-0.5'>Cancelled</p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center'>
                    <RupeeIcon className='text-amber-600' />
                  </div>
                  <div>
                    <p className='text-xl font-extrabold text-slate-800 leading-none'>
                      ₹{(stats?.weekRevenue ?? 0).toLocaleString()}
                    </p>
                    <p className='text-[10px] text-slate-400 mt-0.5'>Revenue</p>
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div className='px-5 pb-5 pt-3'>
                <div className='flex items-end gap-2 h-32'>
                  {weekDaily.map((d, i) => {
                    const barH = maxDayTotal > 0 ? (d.total / maxDayTotal) * 100 : 0;
                    const completedH = d.total > 0 ? (d.completed / d.total) * barH : 0;
                    const cancelledH = d.total > 0 ? (d.cancelled / d.total) * barH : 0;
                    const isToday = i === todayIndex;
                    const effectiveBar = Math.max(barH, d.total > 0 ? 12 : 4);

                    return (
                      <div key={d.day} className='flex-1 flex flex-col items-center gap-1.5 group'>
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 font-mono whitespace-nowrap'>
                          {d.total > 0 ? `${d.completed}/${d.total}` : "—"}
                        </div>
                        <div className='w-full flex flex-col items-center justify-end h-20'>
                          <div
                            className={`w-full max-w-10 rounded-t-lg overflow-hidden relative transition-all duration-300 ${d.total === 0 ? "bg-slate-100" : ""}`}
                            style={{ height: `${effectiveBar}%` }}
                          >
                            <div
                              className={`absolute inset-0 ${isToday ? "bg-blue-500" : "bg-blue-200"} transition-colors`}
                            />
                            {completedH > 0 && (
                              <div
                                className='absolute bottom-0 w-full bg-emerald-400'
                                style={{ height: `${(completedH / effectiveBar) * 100}%` }}
                              />
                            )}
                            {cancelledH > 0 && (
                              <div
                                className='absolute top-0 w-full bg-rose-300'
                                style={{ height: `${(cancelledH / effectiveBar) * 100}%` }}
                              />
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-semibold ${isToday ? "text-blue-600" : "text-slate-400"}`}
                        >
                          {d.day}
                        </span>
                        {isToday && <div className='w-1 h-1 rounded-full bg-blue-600 -mt-1' />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className='grid lg:grid-cols-3 gap-5'>
              {/* Today's Schedule */}
              <div className='lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'>
                <div className='flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70'>
                  <div className='flex items-center gap-2'>
                    <CalIcon className='text-blue-500' />
                    <span
                      className='text-sm font-bold text-slate-700'
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Today&apos;s Schedule
                    </span>
                  </div>
                  <span className='text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full'>
                    {todaySchedule.length} sessions
                  </span>
                </div>

                {todaySchedule.length === 0 ? (
                  <div className='flex flex-col items-center justify-center px-6 py-12 text-center'>
                    {/* Illustration */}
                    <div className='relative mb-5'>
                      {/* outer ring */}
                      <div className='w-20 h-20 rounded-full bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center'>
                        {/* inner circle */}
                        <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                          <svg
                            width='22'
                            height='22'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='#2563eb'
                            strokeWidth='1.8'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <rect x='3' y='4' width='18' height='18' rx='2' />
                            <line x1='16' y1='2' x2='16' y2='6' />
                            <line x1='8' y1='2' x2='8' y2='6' />
                            <line x1='3' y1='10' x2='21' y2='10' />
                          </svg>
                        </div>
                      </div>
                      {/* floating checkmark badge */}
                      <div className='absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center'>
                        <svg
                          width='10'
                          height='10'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='#059669'
                          strokeWidth='3'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <polyline points='20 6 9 17 4 12' />
                        </svg>
                      </div>
                    </div>

                    {/* Text */}
                    <p className='text-sm font-semibold text-slate-700 mb-1'>All clear for today</p>
                    <p className='text-xs text-slate-400 max-w-[180px] leading-relaxed'>
                      No appointments scheduled. Enjoy your free time or add a new slot.
                    </p>
                  </div>
                ) : (
                  <div className='divide-y divide-slate-100'>
                    {todaySchedule.map((s) => {
                      const sc = statusConfig[s.status] ?? statusConfig.Scheduled;
                      return (
                        <div
                          key={s._id}
                          className='flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/80 transition-colors'
                        >
                          <span className='text-[11.5px] font-mono text-slate-400 w-14 shrink-0'>
                            {s.time}
                          </span>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
                          <span className='text-sm font-semibold text-slate-700 flex-1 truncate'>
                            {s.patient}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-[11px] font-semibold rounded-full border px-2.5 py-0.5 ${
                              s.type === "video"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >
                            {s.type === "video" ? <VideoIcon /> : <AudioIcon />}
                            {s.type}
                          </span>
                          <span
                            className={`text-[10.5px] font-semibold rounded-full border px-2.5 py-0.5 ${sc.badge}`}
                          >
                            {s.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Day progress strip */}
                <div className='grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100'>
                  <div className='py-3 text-center'>
                    <p className='text-lg font-extrabold text-slate-800'>
                      {completedCount}{" "}
                      <span className='text-xs font-medium text-slate-400'>done</span>
                    </p>
                    <p className='text-[10px] uppercase tracking-widest text-slate-400 font-semibold'>
                      Completed
                    </p>
                  </div>
                  <div className='py-3 text-center'>
                    <p className='text-lg font-extrabold text-blue-600'>
                      {inProgressCount}{" "}
                      <span className='text-xs font-medium text-blue-300'>live</span>
                    </p>
                    <p className='text-[10px] uppercase tracking-widest text-slate-400 font-semibold'>
                      In Progress
                    </p>
                  </div>
                  <div className='py-3 text-center'>
                    <p className='text-lg font-extrabold text-slate-800'>
                      {remainingCount}{" "}
                      <span className='text-xs font-medium text-slate-400'>left</span>
                    </p>
                    <p className='text-[10px] uppercase tracking-widest text-slate-400 font-semibold'>
                      Remaining
                    </p>
                  </div>
                </div>

                <div className='px-5 py-3.5 border-t border-slate-100 text-center'>
                  <button
                    onClick={() => router.push("/doctor/appointments")}
                    className='text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors'
                  >
                    View all appointments <ChevronR className='text-blue-500' />
                  </button>
                </div>
              </div>

              {/* Right column */}
              <div className='space-y-4'>
                {/* Pending Actions */}
                <div className='bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'>
                  <div className='flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/70'>
                    <AlertIcon className='text-rose-500' />
                    <span
                      className='text-sm font-bold text-slate-700'
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Action Required
                    </span>
                  </div>
                  <div className='p-4 space-y-2.5'>
                    {pendingActions.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => router.push("/doctor/appointments")}
                        className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors ${a.cls}`}
                      >
                        <span>{a.label}</span>
                        <span className='text-lg font-extrabold'>{a.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Patients */}
                <div className='bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'>
                  <div className='flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/70'>
                    <UsersIcon className='text-violet-500' />
                    <span
                      className='text-sm font-bold text-slate-700'
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Recent Patients
                    </span>
                  </div>

                  {recentPatients.length === 0 ? (
                    <div className='px-5 py-10 text-center'>
                      <p className='text-sm text-slate-400'>No recent patients yet</p>
                    </div>
                  ) : (
                    <div className='divide-y divide-slate-100'>
                      {recentPatients.map((p, i) => (
                        <button
                          key={p._id}
                          onClick={() => router.push(`/patient-history/${p._id}`)}
                          className='w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/60 transition-all duration-150 text-left group border-b border-slate-100 last:border-b-0'
                        >
                          {/* Avatar */}
                          <div className='relative shrink-0'>
                            {p.profilePic ? (
                              <Image
                                src={p.profilePic}
                                alt={p.name}
                                width={36}
                                height={36}
                                className='w-9 h-9 rounded-full object-cover ring-2 ring-white'
                              />
                            ) : (
                              <div
                                className={`w-9 h-9 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white`}
                              >
                                {getInitials(p.name)}
                              </div>
                            )}
                            {/* online-style dot — optional, remove if not needed */}
                            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white' />
                          </div>

                          {/* Text */}
                          <div className='flex-1 min-w-0'>
                            <p className='text-[13px] font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors leading-tight'>
                              {p.name}
                            </p>
                            <p className='text-[11px] text-slate-400 truncate mt-0.5 leading-tight'>
                              {p.reason}
                            </p>
                          </div>

                          {/* Right side */}
                          <div className='flex flex-col items-end gap-1 shrink-0'>
                            <span className='text-[10px] font-medium text-slate-400'>
                              {getRelativeTime(p.lastVisit)}
                            </span>
                            <span className='flex items-center gap-0.5 text-[10px] font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity'>
                              View <ChevronR className='text-blue-400' />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <p className='text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pb-2'>
          <LockIcon className='text-slate-400' />
          End-to-end encrypted · Docure Telehealth Platform
        </p>
      </div>
    </div>
  );
};

export default DoctorDashboard;
