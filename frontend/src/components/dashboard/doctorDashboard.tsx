"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { userAuthStore } from "@/store/authStore";
import { useDoctorState } from "@/store/doctorStore";

/* ─── ICONS ─────────────────────────────────────────────── */
const CalIcon = ({ className }: { className?: string }) => (
  <svg
    width='18'
    height='18'
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
    <path d='M23 7l-7 5 7 5V7z' />
    <rect x='1' y='5' width='15' height='14' rx='2' />
  </svg>
);
const AudioIcon = ({ className }: { className?: string }) => (
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
    <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
    <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
  </svg>
);
const ChevronR = ({ className }: { className?: string }) => (
  <svg
    width='14'
    height='14'
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
    width='18'
    height='18'
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
    width='18'
    height='18'
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
    width='18'
    height='18'
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
    width='18'
    height='18'
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
    width='18'
    height='18'
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
    width='12'
    height='12'
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
    width='18'
    height='18'
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
const SparkleIcon = ({ className }: { className?: string }) => (
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
    <path d='M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z' />
  </svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
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
    <circle cx='12' cy='12' r='10' />
    <polyline points='12 6 12 12 16 14' />
  </svg>
);

/* ─── HELPERS ────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-cyan-500 to-cyan-600",
  "from-sky-500 to-sky-600",
  "from-violet-500 to-violet-600",
  "from-purple-500 to-purple-600",
  "from-teal-500 to-teal-600",
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
const statusConfig: Record<string, { dot: string; badge: string; text: string }> = {
  Completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    text: "Completed",
  },
  Progress: {
    dot: "bg-blue-500 animate-pulse",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    text: "In Progress",
  },
  Scheduled: {
    dot: "bg-slate-400",
    badge: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    text: "Scheduled",
  },
};

/* ─── SKELETON ───────────────────────────────────────────── */
const Skel = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-blue-100/50 ${className ?? ""}`} />
);

const DashboardSkeleton = () => (
  <div className='space-y-6'>
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      {[...Array(4)].map((_, i) => (
        <Skel key={i} className='h-36' />
      ))}
    </div>
    <Skel className='h-72' />
    <div className='grid lg:grid-cols-3 gap-5'>
      <Skel className='lg:col-span-2 h-80' />
      <div className='space-y-4'>
        <Skel className='h-48' />
        <Skel className='h-64' />
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
  gradient: string;
  iconBg: string;
  delay?: number;
}

const StatCard = ({ label, value, sub, icon, gradient, iconBg, delay = 0 }: StatCardProps) => (
  <div
    className='group relative bg-white rounded-2xl border border-blue-100/50 p-5 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1'
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Gradient corner */}
    <div
      className={`pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.15] blur-2xl ${gradient}`}
    />
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg} shadow-lg`}
    >
      {icon}
    </div>
    <p className='text-[10px] font-bold uppercase tracking-[0.14em] text-blue-400 mb-2'>{label}</p>
    <p className='text-3xl font-extrabold text-slate-900 leading-none tracking-tight'>{value}</p>
    <p className='text-[11px] text-slate-400 mt-2'>{sub}</p>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
const DoctorDashboard: React.FC = () => {
  const router = useRouter();
  const { user } = userAuthStore();
  const { dashboard, dashboardLoading, fetchDashboard } = useDoctorState();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchDashboard();
    setTimeout(() => setAnimateIn(true), 100);
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
          icon: <AlertIcon className='text-rose-500' />,
          cls: "from-rose-50 to-rose-100/50 border-rose-200/50 hover:border-rose-300",
          textCls: "text-rose-700",
        },
        {
          label: "Unpaid consultations",
          count: pa.unpaidConsultations,
          icon: <RupeeIcon className='text-amber-500' />,
          cls: "from-amber-50 to-amber-100/50 border-amber-200/50 hover:border-amber-300",
          textCls: "text-amber-700",
        },
        {
          label: "Follow-ups this week",
          count: pa.followUpsThisWeek,
          icon: <CalIcon className='text-blue-500' />,
          cls: "from-blue-50 to-blue-100/50 border-blue-200/50 hover:border-blue-300",
          textCls: "text-blue-700",
        },
      ]
    : [];

  const doctorName = user?.name ? user.name[0].toUpperCase() + user.name.slice(1) : "";
  const initials = doctorName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Weekly chart helpers
  const maxDayTotal = Math.max(...weekDaily.map((d) => d.total), 1);
  const todayDow = new Date().getDay();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }

        .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; }
        .stagger-4 { animation-delay: 0.2s; }
        .stagger-5 { animation-delay: 0.25s; }

        .glass-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div
        className='min-h-screen'
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #e0f2fe 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Decorative background elements */}
        <div className='fixed inset-0 pointer-events-none overflow-hidden'>
          <div
            className='absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-40'
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className='absolute top-1/3 -left-40 w-80 h-80 rounded-full opacity-30'
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            }}
          />
          <div
            className='absolute bottom-20 right-1/4 w-64 h-64 rounded-full opacity-20'
            style={{
              background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className='relative z-10 px-4 py-8 sm:px-8'>
          <div className='mx-auto w-full max-w-5xl space-y-6'>
            {/* ── HERO HEADER ── */}
            <div
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 ${animateIn ? "animate-fadeUp" : "opacity-0"}`}
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%)",
                boxShadow: "0 20px 60px -15px rgba(59,130,246,0.4)",
              }}
            >
              {/* Background pattern */}
              <div className='absolute inset-0 opacity-10'>
                <svg className='w-full h-full' viewBox='0 0 400 200'>
                  <defs>
                    <pattern
                      id='heroPattern'
                      x='0'
                      y='0'
                      width='40'
                      height='40'
                      patternUnits='userSpaceOnUse'
                    >
                      <circle cx='20' cy='20' r='1.5' fill='white' />
                    </pattern>
                  </defs>
                  <rect width='400' height='200' fill='url(#heroPattern)' />
                </svg>
              </div>

              {/* Gradient orbs */}
              <div className='absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl' />
              <div className='absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl' />

              <div className='relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
                <div className='flex items-center gap-5'>
                  {/* Avatar */}
                  <div className='relative'>
                    <div className='w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-2xl'>
                      {initials}
                    </div>
                    <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-lg border-2 border-white flex items-center justify-center'>
                      <CheckIcon className='w-3 h-3 text-white' />
                    </div>
                  </div>

                  <div>
                    {/* Live badge */}
                    <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full mb-3 border border-white/20'>
                      <span className='relative flex h-2 w-2'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-400'></span>
                      </span>
                      <PulseIcon className='w-3 h-3' />
                      Live Dashboard
                    </div>

                    <h1
                      className='text-2xl sm:text-3xl font-bold text-white leading-tight'
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {greeting()}, Dr. {doctorName}
                    </h1>
                    <p className='text-blue-100 text-sm mt-1 flex items-center gap-2'>
                      <ClockIcon className='w-3.5 h-3.5' />
                      {new Date().toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/doctor/appointments")}
                  className='flex items-center gap-2 rounded-xl bg-white hover:bg-blue-50 active:scale-95 px-6 py-3 text-sm font-bold text-blue-600 shadow-xl transition-all duration-200'
                >
                  <CalIcon />
                  View All Appointments
                  <ChevronR />
                </button>
              </div>
            </div>

            {dashboardLoading || !dashboard ? (
              <DashboardSkeleton />
            ) : (
              <>
                {/* ── STAT CARDS ── */}
                <div
                  className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${animateIn ? "animate-fadeUp stagger-1" : "opacity-0"}`}
                >
                  <StatCard
                    label="Today's Appointments"
                    value={stats?.todayTotal ?? 0}
                    sub={`${stats?.todayDone ?? 0} completed · ${(stats?.todayTotal ?? 0) - (stats?.todayDone ?? 0)} remaining`}
                    icon={<CalIcon className='text-white' />}
                    gradient='bg-gradient-to-br from-blue-400 to-blue-600'
                    iconBg='bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200'
                    delay={50}
                  />
                  <StatCard
                    label='Total Patients'
                    value={stats?.totalPatients ?? 0}
                    sub='Lifetime consultations'
                    icon={<UsersIcon className='text-white' />}
                    gradient='bg-gradient-to-br from-indigo-400 to-indigo-600'
                    iconBg='bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-200'
                    delay={100}
                  />
                  <StatCard
                    label='Total Revenue'
                    value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`}
                    sub={`₹${(stats?.weekRevenue ?? 0).toLocaleString()} this week`}
                    icon={<RupeeIcon className='text-white' />}
                    gradient='bg-gradient-to-br from-emerald-400 to-emerald-600'
                    iconBg='bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200'
                    delay={150}
                  />
                  <StatCard
                    label='Completed'
                    value={stats?.totalCompleted ?? 0}
                    sub={`${stats?.totalCancelled ?? 0} cancelled all-time`}
                    icon={<CheckIcon className='text-white' />}
                    gradient='bg-gradient-to-br from-cyan-400 to-cyan-600'
                    iconBg='bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-200'
                    delay={200}
                  />
                </div>

                {/* ── WEEKLY ACTIVITY ── */}
                <div
                  className={`glass-card rounded-3xl border border-blue-100/50 shadow-lg shadow-blue-100/30 overflow-hidden ${animateIn ? "animate-fadeUp stagger-2" : "opacity-0"}`}
                >
                  <div className='flex items-center justify-between px-6 py-5 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-transparent'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200'>
                        <TrendUpIcon className='text-white' />
                      </div>
                      <div>
                        <span
                          className='text-base font-bold text-slate-800'
                          style={{ fontFamily: "'DM Serif Display', serif" }}
                        >
                          Weekly Activity
                        </span>
                        <p className='text-[11px] text-slate-400'>Last 7 days performance</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-5 text-[11px] font-semibold text-slate-500'>
                      <span className='flex items-center gap-1.5'>
                        <span className='w-2.5 h-2.5 rounded-full bg-blue-400' /> Total
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <span className='w-2.5 h-2.5 rounded-full bg-emerald-500' /> Completed
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <span className='w-2.5 h-2.5 rounded-full bg-rose-400' /> Cancelled
                      </span>
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 pt-6 pb-4'>
                    {[
                      {
                        icon: <CalIcon className='text-blue-600' />,
                        bg: "bg-blue-100",
                        value: stats?.weekTotal ?? 0,
                        label: "Total this week",
                      },
                      {
                        icon: <CheckIcon className='text-emerald-600' />,
                        bg: "bg-emerald-100",
                        value: stats?.weekCompleted ?? 0,
                        label: "Completed",
                      },
                      {
                        icon: <AlertIcon className='text-rose-500' />,
                        bg: "bg-rose-100",
                        value: stats?.weekCancelled ?? 0,
                        label: "Cancelled",
                      },
                      {
                        icon: <RupeeIcon className='text-amber-600' />,
                        bg: "bg-amber-100",
                        value: `₹${(stats?.weekRevenue ?? 0).toLocaleString()}`,
                        label: "Revenue",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className='flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors'
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <p className='text-xl font-extrabold text-slate-800 leading-none'>
                            {item.value}
                          </p>
                          <p className='text-[10px] text-slate-400 mt-0.5'>{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div className='px-6 pb-6 pt-2'>
                    <div className='flex items-end gap-3 h-36'>
                      {weekDaily.map((d, i) => {
                        const barH = maxDayTotal > 0 ? (d.total / maxDayTotal) * 100 : 0;
                        const completedH = d.total > 0 ? (d.completed / d.total) * barH : 0;
                        const cancelledH = d.total > 0 ? (d.cancelled / d.total) * barH : 0;
                        const isToday = i === todayIndex;
                        const effectiveBar = Math.max(barH, d.total > 0 ? 15 : 6);

                        return (
                          <div
                            key={d.day}
                            className='flex-1 flex flex-col items-center gap-2 group cursor-pointer'
                          >
                            <div className='opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 text-[10px] text-slate-600 font-mono bg-white px-2 py-1 rounded-lg shadow-lg whitespace-nowrap'>
                              {d.total > 0 ? `${d.completed}/${d.total}` : "—"}
                            </div>
                            <div className='w-full flex flex-col items-center justify-end h-24'>
                              <div
                                className={`w-full max-w-12 rounded-xl overflow-hidden relative transition-all duration-300 group-hover:scale-105 ${d.total === 0 ? "bg-slate-100" : ""}`}
                                style={{ height: `${effectiveBar}%` }}
                              >
                                <div
                                  className={`absolute inset-0 transition-colors ${
                                    isToday
                                      ? "bg-gradient-to-t from-blue-600 to-blue-400"
                                      : "bg-gradient-to-t from-blue-300 to-blue-200"
                                  }`}
                                />
                                {completedH > 0 && (
                                  <div
                                    className='absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-400'
                                    style={{ height: `${(completedH / effectiveBar) * 100}%` }}
                                  />
                                )}
                                {cancelledH > 0 && (
                                  <div
                                    className='absolute top-0 w-full bg-gradient-to-b from-rose-400 to-rose-300'
                                    style={{ height: `${(cancelledH / effectiveBar) * 100}%` }}
                                  />
                                )}
                              </div>
                            </div>
                            <span
                              className={`text-xs font-bold ${isToday ? "text-blue-600" : "text-slate-400"}`}
                            >
                              {d.day}
                            </span>
                            {isToday && (
                              <div className='w-1.5 h-1.5 rounded-full bg-blue-600 -mt-1' />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── MAIN GRID ── */}
                <div className='grid lg:grid-cols-3 gap-5'>
                  {/* Today's Schedule */}
                  <div
                    className={`lg:col-span-2 glass-card rounded-3xl border border-blue-100/50 shadow-lg shadow-blue-100/30 overflow-hidden ${animateIn ? "animate-fadeUp stagger-3" : "opacity-0"}`}
                  >
                    <div className='flex items-center justify-between px-6 py-5 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-transparent'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200'>
                          <CalIcon className='text-white' />
                        </div>
                        <div>
                          <span
                            className='text-base font-bold text-slate-800'
                            style={{ fontFamily: "'DM Serif Display', serif" }}
                          >
                            Today&apos;s Schedule
                          </span>
                          <p className='text-[11px] text-slate-400'>Your appointments for today</p>
                        </div>
                      </div>
                      <span className='text-xs font-mono text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full font-bold'>
                        {todaySchedule.length} sessions
                      </span>
                    </div>

                    {todaySchedule.length === 0 ? (
                      <div className='flex flex-col items-center justify-center px-6 py-14 text-center'>
                        <div className='relative mb-6 animate-float'>
                          <div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center'>
                            <div className='w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200'>
                              <CalIcon className='w-6 h-6 text-white' />
                            </div>
                          </div>
                          <div className='absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 border-3 border-white flex items-center justify-center shadow-lg'>
                            <CheckIcon className='w-4 h-4 text-white' />
                          </div>
                        </div>
                        <p className='text-base font-bold text-slate-700 mb-1'>
                          All clear for today!
                        </p>
                        <p className='text-sm text-slate-400 max-w-[200px] leading-relaxed'>
                          No appointments scheduled. Enjoy your free time!
                        </p>
                      </div>
                    ) : (
                      <div className='divide-y divide-blue-50'>
                        {todaySchedule.map((s, i) => {
                          const sc = statusConfig[s.status] ?? statusConfig.Scheduled;
                          return (
                            <div
                              key={s._id}
                              className='flex items-center gap-4 px-6 py-4 hover:bg-blue-50/50 transition-all duration-200 group'
                              style={{ animationDelay: `${i * 50}ms` }}
                            >
                              <span
                                className='text-xs font-mono text-slate-500 w-14 shrink-0 bg-slate-100 px-2 py-1 rounded-lg text-center'
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              >
                                {s.time}
                              </span>
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${sc.dot}`} />
                              <span className='text-sm font-semibold text-slate-700 flex-1 truncate group-hover:text-blue-600 transition-colors'>
                                {s.patient}
                              </span>
                              <span
                                className={`flex items-center gap-1.5 text-[11px] font-bold rounded-lg border px-2.5 py-1 ${
                                  s.type === "video"
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                                }`}
                              >
                                {s.type === "video" ? <VideoIcon /> : <AudioIcon />}
                                {s.type}
                              </span>
                              <span
                                className={`text-[10px] font-bold rounded-lg border px-2.5 py-1 ${sc.badge}`}
                              >
                                {sc.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Day progress strip */}
                    <div className='grid grid-cols-3 divide-x divide-blue-100/50 border-t border-blue-100/50 bg-gradient-to-r from-blue-50/30 to-transparent'>
                      {[
                        {
                          value: completedCount,
                          label: "Completed",
                          sub: "done",
                          color: "text-emerald-600",
                        },
                        {
                          value: inProgressCount,
                          label: "In Progress",
                          sub: "live",
                          color: "text-blue-600",
                        },
                        {
                          value: remainingCount,
                          label: "Remaining",
                          sub: "left",
                          color: "text-slate-600",
                        },
                      ].map((item, i) => (
                        <div key={i} className='py-4 text-center'>
                          <p className={`text-2xl font-extrabold ${item.color}`}>
                            {item.value}{" "}
                            <span className='text-xs font-medium opacity-60'>{item.sub}</span>
                          </p>
                          <p className='text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1'>
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className='px-6 py-4 border-t border-blue-100/50 text-center'>
                      <button
                        onClick={() => router.push("/doctor/appointments")}
                        className='text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors group'
                      >
                        View all appointments{" "}
                        <ChevronR className='group-hover:translate-x-1 transition-transform' />
                      </button>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className='space-y-5'>
                    {/* Pending Actions */}
                    <div
                      className={`glass-card rounded-3xl border border-blue-100/50 shadow-lg shadow-blue-100/30 overflow-hidden ${animateIn ? "animate-fadeUp stagger-4" : "opacity-0"}`}
                    >
                      <div className='flex items-center gap-3 px-5 py-4 border-b border-blue-100/50 bg-gradient-to-r from-rose-50/50 to-transparent'>
                        <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200'>
                          <AlertIcon className='text-white w-4 h-4' />
                        </div>
                        <div>
                          <span
                            className='text-sm font-bold text-slate-800'
                            style={{ fontFamily: "'DM Serif Display', serif" }}
                          >
                            Action Required
                          </span>
                          <p className='text-[10px] text-slate-400'>Items needing attention</p>
                        </div>
                      </div>
                      <div className='p-4 space-y-2.5'>
                        {pendingActions.map((a, i) => (
                          <button
                            key={i}
                            onClick={() => router.push("/doctor/appointments")}
                            className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all hover:shadow-md bg-gradient-to-r ${a.cls} ${a.textCls}`}
                          >
                            <div className='flex items-center gap-3'>
                              {a.icon}
                              <span>{a.label}</span>
                            </div>
                            <span className='text-xl font-extrabold'>{a.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Patients */}
                    <div
                      className={`glass-card rounded-3xl border border-blue-100/50 shadow-lg shadow-blue-100/30 overflow-hidden ${animateIn ? "animate-fadeUp stagger-5" : "opacity-0"}`}
                    >
                      <div className='flex items-center gap-3 px-5 py-4 border-b border-blue-100/50 bg-gradient-to-r from-indigo-50/50 to-transparent'>
                        <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200'>
                          <UsersIcon className='text-white w-4 h-4' />
                        </div>
                        <div>
                          <span
                            className='text-sm font-bold text-slate-800'
                            style={{ fontFamily: "'DM Serif Display', serif" }}
                          >
                            Recent Patients
                          </span>
                          <p className='text-[10px] text-slate-400'>Latest consultations</p>
                        </div>
                      </div>

                      {recentPatients.length === 0 ? (
                        <div className='px-5 py-12 text-center'>
                          <p className='text-sm text-slate-400'>No recent patients yet</p>
                        </div>
                      ) : (
                        <div className='divide-y divide-blue-50'>
                          {recentPatients.map((p, i) => (
                            <button
                              key={p._id}
                              onClick={() => router.push(`/patient-history/${p._id}`)}
                              className='w-full flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50/50 transition-all duration-200 text-left group'
                            >
                              {/* Avatar */}
                              <div className='relative shrink-0'>
                                {p.profilePic ? (
                                  <Image
                                    src={p.profilePic}
                                    alt={p.name}
                                    width={40}
                                    height={40}
                                    className='w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-md'
                                  />
                                ) : (
                                  <div
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-md`}
                                  >
                                    {getInitials(p.name)}
                                  </div>
                                )}
                                <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white' />
                              </div>

                              {/* Text */}
                              <div className='flex-1 min-w-0'>
                                <h1 className='text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors'>
                                  {p.name[0].toUpperCase() + p.name.slice(1)}
                                </h1>
                                <p className='text-[11px] text-slate-400'>
                                  {getRelativeTime(p.lastVisit)}
                                </p>
                              </div>

                              {/* Arrow */}
                              <ChevronR className='text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all' />
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
            <div
              className={`flex items-center justify-center gap-2 pt-4 pb-6 ${animateIn ? "animate-fadeUp" : "opacity-0"}`}
              style={{ animationDelay: "400ms" }}
            >
              <LockIcon className='text-blue-300' />
              <span className='text-xs text-slate-400'>
                End-to-end encrypted · Docure Telehealth Platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
