"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CircleDollarSign,
  ClipboardList,
  Clock3,
  FileText,
  Loader2,
  Stethoscope,
  UserRound,
  Activity,
  ChevronDown,
  ChevronUp,
  Video,
  AlertCircle,
  ArrowLeft,
  Phone,
  Star,
  MapPin,
  Flag,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Pen,
  Save,
  StickyNote,
  X,
} from "lucide-react";
import { Appointment, useAppointmentStore } from "@/store/appointmentStore";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (v?: string) => {
  if (!v) return "N/A";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (v?: string) => {
  if (!v) return "N/A";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true });
};

const getAppointmentDate = (a: Appointment) => a?.slotStart || a?.date || a?.createdAt;
const isFuture = (v?: string) => !!v && new Date(v).getTime() > Date.now();

type StatusType = Appointment["status"] | "Upcoming";

interface StopMeta {
  icon: React.ReactNode;
  pinGradient: string;
  pinShadow: string;
  cardBorder: string;
  cardBg: string;
  badge: string;
  label: string;
  accent: string;
  dotColor: string;
}

const getStopMeta = (status: StatusType, isCurrent: boolean): StopMeta => {
  if (isCurrent)
    return {
      icon: <Star className='h-4 w-4 text-white fill-white' />,
      pinGradient: "from-blue-400 to-blue-600",
      pinShadow: "shadow-blue-400/70",
      cardBorder: "border-blue-300",
      cardBg: "bg-gradient-to-br from-blue-50 via-white to-blue-50/20",
      badge: "bg-blue-100 text-blue-700 border-blue-300",
      label: "Upcoming",
      accent: "bg-blue-500",
      dotColor: "#3b82f6",
    };
  if (status === "Completed")
    return {
      icon: <CheckCircle2 className='h-4 w-4 text-white' />,
      pinGradient: "from-emerald-400 to-emerald-600",
      pinShadow: "shadow-emerald-300/60",
      cardBorder: "border-emerald-200",
      cardBg: "bg-gradient-to-br from-emerald-50/40 via-white to-white",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Completed",
      accent: "bg-emerald-500",
      dotColor: "#10b981",
    };
  if (status === "Cancelled")
    return {
      icon: <XCircle className='h-4 w-4 text-white' />,
      pinGradient: "from-rose-400 to-rose-500",
      pinShadow: "shadow-rose-300/50",
      cardBorder: "border-rose-200",
      cardBg: "bg-gradient-to-br from-rose-50/30 via-white to-white",
      badge: "bg-rose-50 text-rose-600 border-rose-200",
      label: "Cancelled",
      accent: "bg-rose-400",
      dotColor: "#f43f5e",
    };
  return {
    icon: <CalendarDays className='h-4 w-4 text-white' />,
    pinGradient: "from-blue-400 to-blue-500",
    pinShadow: "shadow-blue-300/50",
    cardBorder: "border-blue-200",
    cardBg: "bg-gradient-to-br from-blue-50/20 via-white to-white",
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    label: "Scheduled",
    accent: "bg-blue-400",
    dotColor: "#60a5fa",
  };
};

const getPaymentStyles = (s: string) => {
  if (s === "Paid") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (s === "Refunded") return "text-blue-700 bg-blue-50 border-blue-200";
  if (s === "Failed") return "text-rose-700 bg-rose-50 border-rose-200";
  return "text-amber-700 bg-amber-50 border-amber-200";
};

// ─── Info Tile ────────────────────────────────────────────────────────────────

const InfoTile = ({
  icon,
  title,
  children,
  span2 = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  span2?: boolean;
}) => (
  <div
    className={`rounded-xl border border-slate-100 bg-white/90 p-3.5 ${span2 ? "md:col-span-2" : ""}`}
  >
    <div className='mb-2 flex items-center gap-2'>
      {icon}
      <p className='text-[10px] font-black uppercase tracking-[0.15em] text-slate-400'>{title}</p>
    </div>
    <div className='text-sm text-slate-700'>{children}</div>
  </div>
);

// ─── Stop Card ────────────────────────────────────────────────────────────────

const StopCard = ({
  appointment,
  index,
  isCurrent,
}: {
  appointment: Appointment;
  index: number;
  isCurrent: boolean;
  side: "left" | "right";
}) => {
  const [expanded, setExpanded] = useState(isCurrent);
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteDraft, setNoteDraft] = useState(appointment.notes || "");
  const [savingNote, setSavingNote] = useState(false);
  const updateNotes = useAppointmentStore((s) => s.updateNotes);
  const meta = getStopMeta(isCurrent ? "Upcoming" : appointment.status, isCurrent);
  const doctorName = appointment?.doctorID?.name || "Doctor";
  const hospital = appointment?.doctorID?.hospitalInfo?.name || "Hospital";
  const specialization = appointment?.doctorID?.specialization || "General";
  const paidAt = appointment?.paymentDetails?.paidAt;
  const isOnline = /online|video/i.test(appointment.consultationType || "");
  const aptDate = getAppointmentDate(appointment);

  const handleSaveNotes = useCallback(async () => {
    setSavingNote(true);
    try {
      await updateNotes(appointment._id, noteDraft);
      setEditingNotes(false);
    } catch {
      // error toast handled in store
    } finally {
      setSavingNote(false);
    }
  }, [appointment._id, noteDraft, updateNotes]);

  const handleCancelNotes = () => {
    setNoteDraft(appointment.notes || "");
    setEditingNotes(false);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300
        ${meta.cardBorder} ${meta.cardBg}
        ${isCurrent ? `ring-2 ring-blue-300/40 shadow-blue-200/80` : "hover:-translate-y-0.5 hover:shadow-xl"}
      `}
      style={{ animation: `stop-in 0.55s cubic-bezier(0.34,1.56,0.64,1) ${index * 90}ms both` }}
    >
      {/* Top accent strip */}
      <div className={`h-1 w-full ${meta.accent}`} />

      <button
        onClick={() => setExpanded((e) => !e)}
        className='w-full p-4 text-left'
        aria-expanded={expanded}
      >
        {/* Badges */}
        <div className='mb-3 flex flex-wrap items-center gap-1.5'>
          {isCurrent && (
            <span className='flex animate-pulse items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm'>
              <Activity className='h-2.5 w-2.5' />
              Now
            </span>
          )}
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.badge}`}>
            {meta.label}
          </span>
          <span className='flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500'>
            {isOnline ? (
              <Video className='h-2.5 w-2.5 text-blue-500' />
            ) : (
              <Phone className='h-2.5 w-2.5 text-blue-500' />
            )}
            {appointment.consultationType}
          </span>
        </div>

        {/* Doctor */}
        <div className='flex items-center gap-2.5'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600'>
            <UserRound className='h-4 w-4' />
          </div>
          <div className='min-w-0'>
            <p className='truncate text-sm font-black text-slate-800'>{doctorName}</p>
            <p className='truncate text-[11px] text-slate-500'>
              {specialization} · {hospital}
            </p>
          </div>
        </div>

        {/* Date + toggle */}
        <div className='mt-3 flex items-center justify-between'>
          <div>
            <p className='text-[11px] font-bold text-blue-600'>{formatDate(aptDate)}</p>
            <p className='text-[11px] text-slate-400'>{formatTime(appointment.slotStart)}</p>
          </div>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-500'>
            {expanded ? (
              <ChevronUp className='h-3.5 w-3.5' />
            ) : (
              <ChevronDown className='h-3.5 w-3.5' />
            )}
          </div>
        </div>
      </button>

      {/* Expanded details */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className='grid grid-cols-1 gap-2 px-4 pb-4 md:grid-cols-2'>
          <InfoTile icon={<Clock3 className='h-3.5 w-3.5 text-blue-500' />} title='Time Slot'>
            <p className='text-xs font-bold text-slate-800'>
              {formatTime(appointment.slotStart)} – {formatTime(appointment.slotEnd)}
            </p>
            <p className='mt-0.5 text-[11px] text-slate-400'>
              Booked {formatDate(appointment.createdAt)}
            </p>
          </InfoTile>

          <InfoTile
            icon={<CircleDollarSign className='h-3.5 w-3.5 text-emerald-500' />}
            title='Payment'
          >
            <p className='text-xs font-bold text-slate-800'>
              ₹{appointment?.paymentDetails?.totalFees ?? 0}
            </p>
            <span
              className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black ${getPaymentStyles(appointment?.paymentDetails?.paymentStatus || "Pending")}`}
            >
              {appointment?.paymentDetails?.paymentStatus || "Pending"}
            </span>
            {paidAt && <p className='mt-1 text-[10px] text-slate-400'>Paid {formatDate(paidAt)}</p>}
          </InfoTile>

          <InfoTile
            icon={<ClipboardList className='h-3.5 w-3.5 text-amber-500' />}
            title='Symptoms'
          >
            <p className='text-[11px] leading-relaxed'>
              {appointment.symptoms || <span className='italic text-slate-300'>None recorded</span>}
            </p>
          </InfoTile>

          {/* ── Doctor Notes (editable) ── */}
          <InfoTile
            icon={<StickyNote className='h-3.5 w-3.5 text-violet-500' />}
            title='Doctor Notes'
            span2
          >
            {!editingNotes ? (
              <div className='flex items-start justify-between gap-3'>
                <p className='flex-1 text-[11px] leading-relaxed whitespace-pre-line'>
                  {appointment.notes || <span className='italic text-slate-300'>No notes yet</span>}
                </p>
                <button
                  onClick={() => {
                    setNoteDraft(appointment.notes || "");
                    setEditingNotes(true);
                  }}
                  className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 transition-all hover:bg-blue-100 hover:text-blue-700'
                  title='Edit notes'
                >
                  <Pen className='h-3 w-3' />
                </button>
              </div>
            ) : (
              <div className='space-y-2'>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder='Add notes for future reference…'
                  rows={3}
                  className='w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none'
                  autoFocus
                />
                <div className='flex items-center justify-end gap-2'>
                  <button
                    onClick={handleCancelNotes}
                    className='flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-all hover:bg-slate-50'
                  >
                    <X className='h-3 w-3' />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNote}
                    className='flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-60'
                  >
                    {savingNote ? (
                      <Loader2 className='h-3 w-3 animate-spin' />
                    ) : (
                      <Save className='h-3 w-3' />
                    )}
                    {savingNote ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </InfoTile>

          <InfoTile
            icon={<FileText className='h-3.5 w-3.5 text-blue-500' />}
            title='Prescription'
            span2
          >
            {appointment.pescription?.fileUrl ? (
              <a
                href={`https://docs.google.com/gview?url=${encodeURIComponent(appointment.pescription.fileUrl)}&embedded=true`}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700 transition-all hover:bg-blue-100'
              >
                <FileText className='h-3.5 w-3.5' />
                View Prescription
              </a>
            ) : (
              <p className='flex items-center gap-1.5 text-[11px] italic text-slate-400'>
                <AlertCircle className='h-3 w-3 text-slate-300' />
                No prescription uploaded
              </p>
            )}
          </InfoTile>
        </div>
      </div>
    </div>
  );
};

// ─── Stat Chip ────────────────────────────────────────────────────────────────

const StatChip = ({
  label,
  count,
  icon,
  color,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 ${color}`}>
    <div className='flex items-center gap-1.5'>
      {icon}
      <span className='text-2xl font-black'>{count}</span>
    </div>
    <span className='text-[10px] font-bold uppercase tracking-widest opacity-60'>{label}</span>
  </div>
);

// ─── Curved Snake Path ────────────────────────────────────────────────────────
// Renders a continuous SVG bezier snake connecting all stops

type NodePos = { x: number; y: number; side: "left" | "right"; dotColor: string };

const CurvedPath = ({ nodes, containerWidth }: { nodes: NodePos[]; containerWidth: number }) => {
  if (nodes.length < 2) return null;

  // The dot sits at x = containerWidth/2 (center), we draw from dot to dot
  const cx = containerWidth / 2;

  // Build one continuous path string through all nodes
  const pathSegments: string[] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    const midY = (a.y + b.y) / 2;
    // Control points curve toward the side of each node
    const cp1x = cx + (a.side === "right" ? 40 : -40);
    const cp2x = cx + (b.side === "right" ? 40 : -40);
    if (i === 0) pathSegments.push(`M ${cx} ${a.y}`);
    pathSegments.push(`C ${cp1x} ${midY}, ${cp2x} ${midY}, ${cx} ${b.y}`);
  }

  const pathD = pathSegments.join(" ");

  return (
    <svg
      className='pointer-events-none absolute inset-0 z-0 w-full'
      style={{ height: "100%", overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <linearGradient id='snake-grad' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#3b82f6' stopOpacity='1' />
          <stop offset='50%' stopColor='#6366f1' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#94a3b8' stopOpacity='0.5' />
        </linearGradient>
        <filter id='path-glow'>
          <feGaussianBlur stdDeviation='3' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
      {/* Glow shadow */}
      <path
        d={pathD}
        stroke='#93c5fd'
        strokeWidth='6'
        fill='none'
        strokeLinecap='round'
        opacity='0.35'
        filter='url(#path-glow)'
      />
      {/* Main path */}
      <path
        d={pathD}
        stroke='url(#snake-grad)'
        strokeWidth='3'
        fill='none'
        strokeLinecap='round'
        strokeDasharray='6 0'
        style={{ animation: "path-draw 1.4s ease-out both" }}
      />
      {/* Dots at each node */}
      {nodes.map((n, i) => (
        <g key={i}>
          {/* Outer ring */}
          <circle cx={cx} cy={n.y} r='11' fill='white' stroke={n.dotColor} strokeWidth='2.5' />
          {/* Inner fill */}
          <circle cx={cx} cy={n.y} r='6' fill={n.dotColor} />
          {/* Pulse ring for first (current) node */}
          {i === 0 && (
            <circle
              cx={cx}
              cy={n.y}
              r='14'
              fill='none'
              stroke={n.dotColor}
              strokeWidth='1.5'
              opacity='0.4'
              style={{ animation: "dot-pulse 1.8s ease-out infinite" }}
            />
          )}
        </g>
      ))}
    </svg>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PatientHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const appointments = useAppointmentStore((s) => s.appointments);
  const loading = useAppointmentStore((s) => s.loading);
  const error = useAppointmentStore((s) => s.error);
  const fetchPatientHistory = useAppointmentStore((s) => s.fetchPatientHistory);

  useEffect(() => {
    if (id) fetchPatientHistory(id);
  }, [id, fetchPatientHistory]);

  const { current, past } = useMemo(() => {
    const sorted = [...appointments].sort(
      (a, b) =>
        new Date(getAppointmentDate(b)).getTime() - new Date(getAppointmentDate(a)).getTime(),
    );
    const current = sorted.filter(
      (a) =>
        (a.status === "Scheduled") && isFuture(getAppointmentDate(a)),
    );
    const past = sorted.filter((a) => !current.includes(a));
    return { current, past };
  }, [appointments]);

  const allTimeline = [...current, ...past];
  const patientName = appointments[0]?.patientID?.name || "Patient";

  // We measure actual card positions for the SVG path
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodes, setNodes] = useState<NodePos[]>([]);
  const [containerWidth, setContainerWidth] = useState(640);

  useEffect(() => {
    if (!containerRef.current || allTimeline.length === 0) return;

    const measure = () => {
      const containerRect = containerRef.current!.getBoundingClientRect();
      setContainerWidth(containerRect.width);
      const newNodes: NodePos[] = [];
      dotRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const y = rect.top - containerRect.top + rect.height / 2;
        const side = i % 2 === 0 ? "right" : "left";
        const apt = allTimeline[i];
        const isCurr = i < current.length;
        const meta = getStopMeta(isCurr ? "Upcoming" : apt.status, isCurr);
        newNodes.push({ x: containerRect.width / 2, y, side, dotColor: meta.dotColor });
      });
      setNodes(newNodes);
    };

    // Slight delay for layout to settle
    const t = setTimeout(measure, 80);
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [allTimeline, current]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        @keyframes stop-in {
          from { opacity: 0; transform: scale(0.88) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes path-draw {
          from { stroke-dashoffset: 2000; stroke-dasharray: 2000; }
          to   { stroke-dashoffset: 0;    stroke-dasharray: 2000; }
        }
        @keyframes dot-pulse {
          0%   { r: 14; opacity: 0.5; }
          70%  { r: 22; opacity: 0; }
          100% { r: 22; opacity: 0; }
        }
        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .road-font { font-family: 'Nunito', sans-serif; }
        .body-font  { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <section className='body-font min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white'>
        <div className='mx-auto max-w-4xl px-4 py-8'>
          {/* Back */}
          <button
            onClick={() => router.back()}
            className='road-font mb-6 flex items-center gap-2 rounded-full border-2 border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md'
            style={{ animation: "fade-down 0.4s ease both" }}
          >
            <ArrowLeft className='h-4 w-4' />
            Back
          </button>

          {/* ── Header ── */}
          <div
            className='relative mb-10 overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-xl shadow-blue-100/40'
            style={{ animation: "fade-down 0.5s ease 0.05s both" }}
          >
            <div className='h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-300' />
            <div className='p-6'>
              <div className='flex items-start gap-4'>
                <div className='road-font flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-300/40'>
                  <MapPin className='h-7 w-7' />
                </div>
                <div>
                  <h1 className='road-font text-2xl font-black tracking-tight text-slate-900 md:text-3xl'>
                    {patientName}&apos;s Journey
                  </h1>
                  <p className='mt-0.5 text-sm text-slate-500'>
                    Present → Past · Follow the path below.
                  </p>
                </div>
              </div>

              {!loading && !error && (
                <div className='mt-5 flex flex-wrap gap-3'>
                  <StatChip
                    label='Upcoming'
                    count={current.length}
                    icon={<Star className='h-4 w-4 fill-current' />}
                    color='border-blue-200 bg-blue-50 text-blue-700'
                  />
                  <StatChip
                    label='Completed'
                    count={past.filter((a) => a.status === "Completed").length}
                    icon={<CheckCircle2 className='h-4 w-4' />}
                    color='border-emerald-200 bg-emerald-50 text-emerald-700'
                  />
                  <StatChip
                    label='Cancelled'
                    count={past.filter((a) => a.status === "Cancelled").length}
                    icon={<XCircle className='h-4 w-4' />}
                    color='border-rose-200 bg-rose-50 text-rose-700'
                  />
                  <StatChip
                    label='Total'
                    count={allTimeline.length}
                    icon={<Stethoscope className='h-4 w-4' />}
                    color='border-slate-200 bg-slate-50 text-slate-700'
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── States ── */}
          {loading ? (
            <div className='flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-blue-100 bg-white shadow-lg'>
              <Loader2 className='h-9 w-9 animate-spin text-blue-500' />
              <p className='road-font text-sm font-bold text-blue-400'>Loading the journey…</p>
            </div>
          ) : error ? (
            <div className='flex items-center gap-3 rounded-3xl border-2 border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700'>
              <AlertCircle className='h-5 w-5 shrink-0' />
              Failed to load history. Please try again.
            </div>
          ) : allTimeline.length === 0 ? (
            <div
              className='relative overflow-hidden rounded-3xl border-2 border-blue-100 bg-white px-8 py-16 text-center shadow-xl shadow-blue-100/30'
              style={{ animation: "fade-down 0.5s ease 0.1s both" }}
            >
              {/* Decorative background circles */}
              <div className='pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-100/40 blur-[60px]' />
              <div className='pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-100/40 blur-[60px]' />

              {/* Icon */}
              <div className='relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 shadow-inner'>
                <Stethoscope className='h-10 w-10 text-blue-300' />
                <div className='absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-md shadow-blue-200'>
                  <CalendarDays className='h-3.5 w-3.5 text-white' />
                </div>
              </div>

              <h3 className='road-font text-xl font-black text-slate-700'>
                No Consultation History
              </h3>
              <p className='mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-400'>
                There are no past appointments with this patient yet. Once a consultation takes place, the journey will appear here.
              </p>

              {/* Decorative dotted path */}
              <div className='mx-auto mt-6 flex items-center justify-center gap-1.5'>
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className='h-1.5 w-1.5 rounded-full bg-blue-200'
                    style={{ opacity: 1 - i * 0.12 }}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* ── Snake Timeline ── */
            <div ref={containerRef} className='relative'>
              {/* SVG curved path overlay */}
              <CurvedPath nodes={nodes} containerWidth={containerWidth} />

              {/* ── START marker ── */}
              <div className='relative z-10 mb-6 flex justify-center'>
                <div className='road-font flex items-center gap-2 rounded-full border-2 border-blue-300 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-blue-700 shadow-lg shadow-blue-100'>
                  <Flag className='h-4 w-4 text-blue-500' />
                  Present
                </div>
              </div>

              {/* Stops */}
              <div className='relative z-10 space-y-10'>
                {allTimeline.map((apt, i) => {
                  const side: "left" | "right" = i % 2 === 0 ? "right" : "left";
                  const isCurr = i < current.length;

                  // Section label before first past item
                  const showPastLabel = isCurr === false && i === current.length;

                  return (
                    <div key={apt._id}>
                      {/* Past section label */}
                      {showPastLabel && current.length > 0 && (
                        <div className='relative z-10 mb-8 flex justify-center'>
                          <div className='road-font flex items-center gap-2 rounded-full border-2 border-dashed border-slate-300 bg-white/90 px-5 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400 shadow-md backdrop-blur-sm'>
                            Past Consultations ↓
                          </div>
                        </div>
                      )}

                      {/* Row: card on one side, dot ref in center, empty on other */}
                      <div
                        className='relative flex items-center'
                        style={{ flexDirection: side === "right" ? "row" : "row-reverse" }}
                      >
                        {/* Card */}
                        <div className={`w-[calc(50%-44px)] ${side === "right" ? "pr-6" : "pl-6"}`}>
                          <StopCard appointment={apt} index={i} isCurrent={isCurr} side={side} />
                        </div>

                        {/* Center dot anchor (invisible — used for SVG measurement only) */}
                        <div
                          ref={(el) => {
                            dotRefs.current[i] = el;
                          }}
                          className='relative z-10 mx-auto flex h-6 w-6 shrink-0 items-center justify-center'
                          aria-hidden
                        />

                        {/* Empty opposite side */}
                        <div className='w-[calc(50%-44px)]' />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── END marker ── */}
              <div className='relative z-10 mt-10 flex justify-center'>
                <div className='road-font flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 shadow-md'>
                  <CheckCircle2 className='h-4 w-4 text-slate-400' />
                  End of History
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
