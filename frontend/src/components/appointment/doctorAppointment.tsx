"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppointmentStore, Appointment } from "@/store/appointmentStore";
import { userAuthStore } from "@/store/authStore";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type TabKey = "upcoming" | "past";
type TabCnt = {
  upcoming: number;
  past: number;
};

interface PrescriptionFile {
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
}

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
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return s;
};

const splitTime = (s: string): [string, string] => {
  const formatted = formatTime(s);
  const parts = formatted.split(" ");
  return [parts[0] ?? formatted, parts[1] ?? ""];
};

const formatSize = (b: number) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${(b / 1024).toFixed(0)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;
const formatUploadTime = (s: string) =>
  new Date(s).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
const UploadIcon = ({ className }: { className?: string }) => (
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
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
    <polyline points='17 8 12 3 7 8' />
    <line x1='12' y1='3' x2='12' y2='15' />
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
const TrashIcon = ({ className }: { className?: string }) => (
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
    <polyline points='3 6 5 6 21 6' />
    <path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' />
    <path d='M10 11v6M14 11v6' />
    <path d='M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' />
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
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    width='11'
    height='11'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6.36 6.36l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
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
const SpinIcon = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
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
const LiveIcon = ({ className }: { className?: string }) => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' className={className}>
    <circle cx='12' cy='12' r='8' />
    <circle cx='12' cy='12' r='3' fill='white' />
  </svg>
);

/* ─────────────────────────────────────────────────────────
   EDITABLE NOTES
───────────────────────────────────────────────────────── */
const PencilIcon = ({ className = "" }: { className?: string }) => (
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
    <path d='M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
    <path d='m15 5 4 4' />
  </svg>
);

interface EditableNotesProps {
  notes?: string;
  onSave: (notes: string) => Promise<void>;
}

const EditableNotes: React.FC<EditableNotesProps> = ({ notes, onSave }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes || "");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep draft in sync with DB value when not editing
  useEffect(() => {
    if (!editing) setDraft(notes || "");
  }, [notes, editing]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [editing]);

  const handleSave = async () => {
    if (!draft.trim() && !notes) return;
    setSaving(true);
    try {
      await onSave(draft.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(notes || "");
    setEditing(false);
  };

  // No notes yet — show "Add Notes" button
  if (!notes && !editing) {
    return (
      <div className='mt-2'>
        <button
          onClick={() => {
            setEditing(true);
            setOpen(true);
          }}
          className='flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold hover:text-blue-700 transition-colors'
        >
          <NoteIcon className='text-blue-500' />
          Add consultation notes
          <PencilIcon className='text-blue-400' />
        </button>
      </div>
    );
  }

  return (
    <div className='mt-2'>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => setOpen((o) => !o)}
          className='flex items-center gap-1 text-[11px] text-blue-600 font-semibold hover:text-blue-700 transition-colors'
        >
          <NoteIcon className='text-blue-500' />
          {open ? "Hide" : "View"} consultation notes
          <ChevronDown
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && !editing && (
          <button
            onClick={() => setEditing(true)}
            className='flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 font-medium transition-colors'
          >
            <PencilIcon className='text-blue-400' /> Edit
          </button>
        )}
      </div>
      {open &&
        (editing ? (
          <div className='mt-2'>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              placeholder='Write consultation notes...'
              className='w-full px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 placeholder:text-slate-400'
            />
            <div className='flex items-center gap-2 mt-1.5'>
              <button
                onClick={handleSave}
                disabled={saving}
                className='flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-1 text-[11px] font-semibold text-white transition-colors'
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className='flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 px-3 py-1 text-[11px] font-semibold text-slate-600 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className='mt-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-slate-600 leading-relaxed'>
            {notes}
          </div>
        ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   PRESCRIPTION WIDGET
───────────────────────────────────────────────────────── */
interface RxWidgetProps {
  apt: Appointment;
  onUpload: (id: string, file: File) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  uploadError?: string | null;
}
const PrescriptionWidget: React.FC<RxWidgetProps> = ({
  apt,
  onUpload,
  onDelete,
  isUploading,
  uploadError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const validate = (file: File) => {
    const a = ["application/pdf", "image/png", "image/jpeg"];
    if (!a.includes(file.type)) {
      alert("Only PDF, PNG or JPG.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Max 10 MB.");
      return false;
    }
    return true;
  };
  const handle = (file: File) => {
    if (validate(file)) onUpload(apt._id, file);
  };
  const rx = apt?.pescription;
  if (rx)
    return (
      <div className='mt-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white overflow-hidden'>
        <div className='flex items-center gap-3 px-3.5 py-3'>
          <div className='w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0'>
            <FileIcon className='text-emerald-600' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-1.5 mb-0.5'>
              <span className='inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-1.5 py-0.5'>
                <CheckIcon className='text-emerald-600' /> Uploaded
              </span>
            </div>
            <p className='text-xs font-semibold text-slate-700 truncate'>{rx.fileName}</p>
            <p className='text-[10px] text-slate-400 mt-0.5'>
              {formatSize(10240)} · {formatUploadTime(rx.uploadedAt)}
            </p>
          </div>
          <div className='flex items-center gap-1.5 shrink-0'>
            <a
              href={
                rx.fileType === "pdf"
                  ? `https://docs.google.com/gview?url=${encodeURIComponent(rx.fileUrl)}&embedded=true`
                  : rx.fileUrl
              }
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 transition-colors shadow-sm'
            >
              <EyeIcon className='text-blue-600' /> View
            </a>
            <button
              onClick={() => {
                if (window.confirm("Remove prescription?")) onDelete(apt._id);
              }}
              className='flex items-center gap-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 transition-colors shadow-sm'
            >
              <TrashIcon className='text-rose-500' /> Remove
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <div className='mt-3'>
      <input
        ref={inputRef}
        type='file'
        accept='.pdf,.png,.jpg,.jpeg'
        className='hidden'
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handle(f);
        }}
        className={`relative flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition-all duration-150 ${isUploading ? "cursor-default border-blue-300 bg-blue-50/60" : drag ? "cursor-copy border-blue-400 bg-blue-50 scale-[1.01]" : "cursor-pointer border-blue-200 bg-blue-50/40 hover:border-blue-400 hover:bg-blue-50/70"}`}
      >
        <div
          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${drag ? "bg-blue-200 border-blue-300" : isUploading ? "bg-blue-100 border-blue-200" : "bg-white border-blue-200"}`}
        >
          {isUploading ? (
            <SpinIcon className='text-blue-600' />
          ) : (
            <UploadIcon className={drag ? "text-blue-600" : "text-blue-400"} />
          )}
        </div>
        <div>
          {isUploading ? (
            <>
              <p className='text-xs font-semibold text-blue-700'>Uploading…</p>
              <p className='text-[10px] text-blue-500'>Please wait</p>
            </>
          ) : (
            <>
              <p className='text-xs font-semibold text-slate-600'>
                <span className='text-blue-600'>Upload prescription</span>{" "}
                <span className='text-slate-400'>or drag & drop</span>
              </p>
              <p className='text-[10px] text-slate-400'>PDF, PNG, JPG · max 10 MB</p>
            </>
          )}
        </div>
        {!isUploading && (
          <span className='absolute right-3 top-2 text-[10px] font-semibold text-rose-400 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5'>
            Not uploaded
          </span>
        )}
      </div>
      {uploadError && (
        <div className='mt-2 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2'>
          <span className='text-rose-500 text-xs font-semibold'>Upload failed: Try Again</span>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   UPCOMING CARD
───────────────────────────────────────────────────────── */
const statusConfig = {
  Progress: {
    label: "In Progress",
    bg: "bg-emerald-500",
    ring: "ring-emerald-400/30",
    cardBorder: "border-emerald-200",
    cardBg: "bg-gradient-to-br from-emerald-50/60 via-white to-white",
    glow: "shadow-emerald-100",
    headerBg: "bg-emerald-500",
    pulse: true,
  },
  Scheduled: {
    label: "Scheduled",
    bg: "bg-blue-500",
    ring: "ring-blue-400/30",
    cardBorder: "border-blue-200",
    cardBg: "bg-gradient-to-br from-blue-50/40 via-white to-white",
    glow: "shadow-blue-100",
    headerBg: "bg-blue-500",
    pulse: false,
  },
  Completed: {
    label: "Completed",
    bg: "bg-slate-400",
    ring: "ring-slate-300/30",
    cardBorder: "border-slate-200",
    cardBg: "bg-white",
    glow: "shadow-slate-100",
    headerBg: "bg-slate-400",
    pulse: false,
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-rose-400",
    ring: "ring-rose-300/30",
    cardBorder: "border-rose-100",
    cardBg: "bg-white",
    glow: "shadow-rose-50",
    headerBg: "bg-rose-400",
    pulse: false,
  },
};

const avatarGradients: Record<string, string> = {
  "bg-blue-500": "from-blue-400 to-blue-600",
  "bg-rose-500": "from-rose-400 to-rose-600",
  "bg-amber-500": "from-amber-400 to-amber-600",
  "bg-emerald-500": "from-emerald-400 to-emerald-600",
  "bg-purple-500": "from-purple-400 to-purple-600",
  "bg-teal-500": "from-teal-400 to-teal-600",
};

interface UpcomingCardProps {
  apt: Appointment;
  onJoin: (id: string) => void;
  onProfile: (id: string) => void;
  canJoinCall: boolean;
}

const UpcomingCard: React.FC<UpcomingCardProps> = ({ apt, onJoin, onProfile, canJoinCall }) => {
  const config = statusConfig[apt.status];
  const isVideo = apt.consultationType === "video";
  const canJoin = apt.status === "Scheduled" || apt.status === "Progress";
  const isLive = apt.status === "Progress";
  const isScheduled = apt.status === "Scheduled";
  const relDate = formatRelative(apt.date);
  const isToday = relDate === "Today";
  const paid = apt.paymentDetails?.paymentStatus === "Paid";
  const grad = avatarGradients[apt.patientID?.avatarColor] ?? "from-blue-400 to-blue-600";

  const [startTime, startPeriod] = splitTime(apt.slotStart);
  const [endTime, endPeriod] = splitTime(apt.slotEnd);

  return (
    <div
      className={`group relative rounded-2xl border ${config.cardBorder} ${config.cardBg} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        isLive
          ? "shadow-md shadow-emerald-100/80 ring-1 ring-emerald-200/60"
          : isScheduled
            ? "shadow-md shadow-blue-100/60 ring-1 ring-blue-200/40"
            : "shadow-sm"
      }`}
    >
      {/* Top shimmer line */}
      <div className='absolute inset-0 pointer-events-none'>
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${isLive ? "via-emerald-400" : "via-blue-400"} to-transparent`}
        />
      </div>

      <div className='flex'>
        {/* ── LEFT: Time sidebar — always blue-tinted ── */}
        <div
          className={`flex flex-col items-center justify-between px-3 py-4 border-r min-w-[72px] ${
            isLive ? "border-emerald-200 bg-emerald-50/70" : "border-blue-100 bg-blue-50/60"
          }`}
        >
          <div className='flex flex-col items-center gap-1.5'>
            <div
              className={`w-2 h-2 rounded-full ${config.bg} ${config.pulse ? "animate-pulse" : ""}`}
            />
            <span
              className={`text-[9px] font-bold tracking-wider uppercase ${isLive ? "text-emerald-600" : "text-blue-500"}`}
            >
              {isLive ? "LIVE" : isToday ? "TODAY" : relDate.toUpperCase()}
            </span>
          </div>

          <div className='flex flex-col items-center gap-0.5 mt-3'>
            <span
              className={`text-[15px] font-black tabular-nums leading-none ${isLive ? "text-emerald-700" : "text-blue-700"}`}
            >
              {startTime}
            </span>
            <span
              className={`text-[9px] font-bold uppercase ${isLive ? "text-emerald-500" : "text-blue-400"}`}
            >
              {startPeriod}
            </span>
            <div className='w-px h-3 bg-blue-100 my-0.5' />
            <span className='text-[10px] font-semibold text-slate-400 tabular-nums'>{endTime}</span>
            <span className='text-[9px] text-slate-300 uppercase'>{endPeriod}</span>
          </div>

          <div
            className={`mt-3 w-7 h-7 rounded-xl flex items-center justify-center ${isVideo ? "bg-blue-100 text-blue-600" : "bg-blue-50 text-blue-400"}`}
          >
            {isVideo ? <VideoIcon /> : <AudioIcon />}
          </div>
        </div>

        {/* ── RIGHT: Main content ── */}
        <div className='flex-1 min-w-0 p-4'>
          <div className='flex items-start justify-between gap-3 mb-3'>
            <div className='flex items-center gap-2.5'>
              <button
                onClick={() => onProfile(apt.patientID?._id)}
                className='shrink-0 relative focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 rounded-full'
              >
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-black shadow-md ring-2 ring-white transition-transform group-hover:scale-105 duration-200`}
                >
                  {apt.patientID?.avatar ?? apt.patientID?.name?.slice(0, 2).toUpperCase()}
                </div>
                {isLive && (
                  <span className='absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center'>
                    <span className='w-1.5 h-1.5 bg-white rounded-full animate-pulse' />
                  </span>
                )}
                {isScheduled && !isLive && (
                  <span className='absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center'>
                    <span className='w-1 h-1 bg-white rounded-full' />
                  </span>
                )}
              </button>

              <div>
                <div className='flex items-center gap-1.5 flex-wrap'>
                  <button
                    onClick={() => onProfile(apt.patientID?._id)}
                    className='text-[14px] font-bold text-slate-800 hover:text-blue-600 transition-colors duration-150 leading-tight'
                  >
                    {apt.patientID?.name}
                  </button>
                  {apt.isFollowUp && (
                    <span className='inline-flex items-center gap-0.5 rounded-full bg-violet-50 border border-violet-200 px-1.5 py-0.5 text-[9px] font-bold text-violet-600 uppercase tracking-wide'>
                      <RepeatIcon /> Follow-up
                    </span>
                  )}
                </div>
                <div className='flex items-center gap-2 mt-0.5'>
                  <span className='text-[11px] text-slate-400 font-medium'>
                    {apt.patientID?.age}y · {apt.patientID?.gender}
                  </span>
                  {apt.patientID?.phone && (
                    <>
                      <span className='w-px h-2.5 bg-slate-200' />
                      <span className='flex items-center gap-0.5 text-[11px] text-slate-400'>
                        <PhoneIcon /> {apt.patientID?.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className='shrink-0'>
              {paid ? (
                <span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700'>
                  <CheckIcon className='text-emerald-500' /> ₹{apt.paymentDetails?.totalFees}
                </span>
              ) : (
                <span className='inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700'>
                  ₹{apt.paymentDetails?.totalFees} <span className='opacity-70'>pending</span>
                </span>
              )}
            </div>
          </div>

          {apt.symptoms && (
            <div
              className={`rounded-xl px-3 py-2 mb-3 ${
                isLive
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-blue-50/60 border border-blue-100"
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isLive ? "text-emerald-500" : "text-blue-400"}`}
              >
                Chief Complaint
              </p>
              <p className='text-xs text-slate-600 leading-relaxed line-clamp-2'>{apt.symptoms}</p>
            </div>
          )}

          <div className='flex items-center gap-1.5 flex-wrap mb-3'>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                isLive
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200"
                  : apt.status === "Scheduled"
                    ? "bg-blue-600 text-white border-blue-700 shadow-sm shadow-blue-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-white animate-pulse" : isScheduled ? "bg-blue-200" : config.bg}`}
              />
              {config.label}
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

          {canJoin && (
            <div className='flex items-center gap-2'>
              <button
                onClick={() => onJoin(apt._id)}
                disabled={!canJoinCall && !isLive}
                className={`group/btn relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLive
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                <span className='relative flex items-center gap-1.5'>
                  {isLive ? (
                    <>
                      <LightningIcon className='text-white' /> Resume Consultation
                    </>
                  ) : (
                    <>
                      <svg width='10' height='10' viewBox='0 0 24 24' fill='currentColor'>
                        <polygon points='5 3 19 12 5 21 5 3' />
                      </svg>{" "}
                      Start Consultation
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={() => onProfile(apt.patientID?._id)}
                className='flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition-all duration-150 shadow-sm'
              >
                <UserIcon className='text-blue-500' /> History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   PAST CARD
───────────────────────────────────────────────────────── */
interface PastCardProps {
  apt: Appointment;
  onUpload: (id: string, file: File) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  uploadError?: string | null;
  onPatientHistory: (id: string) => void;
  onMarkFollowUp?: (id: string) => void;
  onSaveNotes?: (id: string, notes: string) => Promise<void>;
}
const PastCard: React.FC<PastCardProps> = ({
  apt,
  onUpload,
  onDelete,
  isUploading,
  uploadError,
  onPatientHistory,
  onMarkFollowUp,
  onSaveNotes,
}) => {
  const meta = {
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

  // Blue-tinted accent bar for all non-cancelled statuses
  const accentBar = {
    Scheduled: "bg-blue-400",
    Progress: "bg-emerald-500",
    Completed: "bg-blue-500",
    Cancelled: "bg-rose-400",
  }[apt.status];

  const isVideo = apt.consultationType === "video";
  const paid = apt.paymentDetails?.paymentStatus === "Paid";
  const showRx = apt.status === "Completed";
  const relDate = formatRelative(apt.date);
  const grad = avatarGradients[apt.patientID?.avatarColor] ?? "from-blue-400 to-blue-600";

  const startFormatted = formatTime(apt.slotStart);
  const endFormatted = formatTime(apt.slotEnd);

  return (
    <div className='relative rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200'>
      {/* Blue left accent bar */}
      <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${accentBar}`} />

      {/* Subtle blue top tint strip */}
      <div className='absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-400/60 via-blue-300/40 to-transparent' />

      <div className='px-5 py-4'>
        <div className='flex items-start gap-3 mb-3'>
          <button className='shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1'>
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-black ring-2 ring-white shadow-sm`}
            >
              {apt.patientID?.avatar ?? apt.patientID?.name?.slice(0, 2).toUpperCase()}
            </div>
          </button>
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-0.5'>
              <button className='text-sm font-bold text-slate-800 hover:text-blue-600 hover:underline underline-offset-2 transition-colors leading-tight'>
                {apt.patientID?.name}
              </button>
              <span className='text-[11px] text-slate-400 font-medium'>
                {apt.patientID?.age}y · {apt.patientID?.gender}
              </span>
            </div>
            {apt.patientID?.phone && (
              <div className='flex items-center gap-1 text-[11px] text-slate-400'>
                <PhoneIcon />
                {apt.patientID?.phone}
              </div>
            )}
          </div>
          <div className='shrink-0'>
            {paid ? (
              <span className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700'>
                <CheckIcon className='text-emerald-500' /> ₹{apt.paymentDetails?.totalFees} Paid
              </span>
            ) : (
              <span className='inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700'>
                ₹{apt.paymentDetails?.totalFees} Pending
              </span>
            )}
          </div>
        </div>

        <div className='h-px bg-blue-50 mb-3' />

        <div className='flex flex-wrap items-center gap-1.5 mb-3'>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
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

        <p className='text-xs font-semibold text-slate-700'>
          {formatDate(apt.date)}
          <span className='mx-1.5 text-blue-200'>·</span>
          <span className='font-normal text-slate-500'>
            {startFormatted} – {endFormatted}
          </span>
        </p>

        {apt.symptoms && (
          <p className='mt-0.5 text-xs text-slate-400 line-clamp-2'>{apt.symptoms}</p>
        )}
        {apt.status === "Completed" && onSaveNotes && (
          <EditableNotes notes={apt.notes} onSave={(notes) => onSaveNotes(apt._id, notes)} />
        )}
        {showRx && (
          <PrescriptionWidget
            apt={apt}
            onUpload={onUpload}
            onDelete={onDelete}
            isUploading={isUploading}
            uploadError={uploadError}
          />
        )}

        <div className='flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-blue-50'>
          <button
            onClick={() => onPatientHistory(apt.patientID?._id)}
            className='flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-150'
          >
            <UserIcon className='text-blue-500' /> Patient History
          </button>
          {apt.status === "Completed" && !apt.isFollowUp && (
            <button
              onClick={() => onMarkFollowUp?.(apt._id)}
              className='flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-600 transition-all duration-150'
            >
              <RepeatIcon className='text-violet-500' /> Mark Follow-up
            </button>
          )}
          {apt.isFollowUp && (
            <span className='inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2 py-1 text-[11px] font-bold text-violet-600'>
              <RepeatIcon /> Follow-up
            </span>
          )}
          {apt.status === "Cancelled" && (
            <span className='ml-auto text-[10px] font-semibold uppercase tracking-wider text-rose-300'>
              Cancelled by patient
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   ELAPSED TIMER HOOK
───────────────────────────────────────────────────────── */
const useElapsed = (startISO: string) => {
  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, Math.floor((Date.now() - new Date(startISO).getTime()) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setElapsed(
        h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}:${String(s).padStart(2, "0")}`,
      );
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [startISO]);
  return elapsed;
};

/* ─────────────────────────────────────────────────────────
   SINGLE LIVE CARD
───────────────────────────────────────────────────────── */
const LiveConsultationCard = ({
  apt,
  onJoin,
  onProfile,
}: {
  apt: Appointment;
  onJoin: (id: string) => void;
  onProfile: (id: string) => void;
}) => {
  const grad = avatarGradients[apt.patientID?.avatarColor] ?? "from-blue-400 to-blue-600";
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

        {/* Patient row */}
        <div className='flex items-center gap-4 mb-4'>
          <button
            onClick={() => onProfile(apt.patientID?._id)}
            className='shrink-0 relative focus:outline-none focus:ring-2 focus:ring-white/40 rounded-full'
          >
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[17px] font-black shadow-xl ring-[3px] ring-white/25 transition-transform group-hover:scale-105 duration-200`}
            >
              {apt.patientID?.avatar ?? apt.patientID?.name?.slice(0, 2).toUpperCase()}
            </div>
            <span className='absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-[2.5px] border-indigo-600 flex items-center justify-center'>
              <span className='w-1.5 h-1.5 bg-white rounded-full animate-pulse' />
            </span>
          </button>

          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <button
                onClick={() => onProfile(apt.patientID?._id)}
                className='text-[17px] font-black text-white hover:text-blue-200 transition-colors truncate'
              >
                {apt.patientID?.name}
              </button>
              {apt.isFollowUp && (
                <span className='inline-flex items-center gap-0.5 rounded-full bg-violet-400/20 border border-violet-300/30 px-1.5 py-0.5 text-[9px] font-bold text-violet-200 uppercase tracking-wide'>
                  <RepeatIcon /> Follow-up
                </span>
              )}
            </div>
            <div className='flex items-center gap-2 mt-1 flex-wrap'>
              <span className='text-white/70 text-xs font-medium'>
                {apt.patientID?.age}y · {apt.patientID?.gender}
              </span>
              {apt.patientID?.phone && (
                <>
                  <span className='w-px h-3 bg-white/20' />
                  <span className='flex items-center gap-1 text-white/60 text-xs'>
                    <PhoneIcon className='text-white/50' /> {apt.patientID?.phone}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Payment chip */}
          <div className='shrink-0 hidden sm:block'>
            {paid ? (
              <span className='inline-flex items-center gap-1 rounded-full bg-emerald-400/15 border border-emerald-400/25 px-2.5 py-1 text-[10px] font-bold text-emerald-300'>
                <CheckIcon className='text-emerald-400' /> ₹{apt.paymentDetails?.totalFees}
              </span>
            ) : (
              <span className='inline-flex items-center gap-1 rounded-full bg-amber-400/15 border border-amber-400/25 px-2.5 py-1 text-[10px] font-bold text-amber-300'>
                ₹{apt.paymentDetails?.totalFees} <span className='opacity-70'>pending</span>
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
              Chief Complaint
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
            Resume Consultation
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
            onClick={() => onProfile(apt.patientID?._id)}
            className='flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200'
          >
            <UserIcon className='text-white/70' />
            History
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   CURRENT CONSULTATION SECTION
───────────────────────────────────────────────────────── */
const CurrentConsultationSection = ({
  currentConsultations,
  onJoin,
  onProfile,
}: {
  currentConsultations: Appointment[];
  onJoin: (id: string) => void;
  onProfile: (id: string) => void;
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
          <LiveConsultationCard key={apt._id} apt={apt} onJoin={onJoin} onProfile={onProfile} />
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   TODAY TIMELINE HEADER
───────────────────────────────────────────────────────── */
const TodayStrip = ({ apts }: { apts: Appointment[] }) => {
  const todayApts = apts.filter((a) => formatRelative(a.date) === "Today");
  const completedToday = todayApts.filter(
    (a) => a.status === "Completed" || a.status === "Progress",
  ).length;
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
              Today's Schedule
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
            {todayApts.length} consultations · {completedToday} in progress or done
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {live && (
            <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20'>
              <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
              <span className='text-xs font-bold text-white'>Live: {live.patientID?.name}</span>
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
   DATE GROUP DIVIDER
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
const DoctorAppointments: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [tabCount, setTabCount] = useState<TabCnt>({ upcoming: 0, past: 0 });
  const [search, setSearch] = useState("");
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
  const [ongoing, setOngoing] = useState<Appointment[]>([]);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<Record<string, string | null>>({});

  const { user } = userAuthStore();
  const {
    appointments,
    fetchAppointment,
    markAsFollowUp,
    updatePrecription,
    deletePrescription,
    updateNotes,
  } = useAppointmentStore();

  useEffect(() => {
    if (user && user.type === "doctor") fetchAppointment("doctor", activeTab);
  }, [user, activeTab, fetchAppointment]);

  useEffect(() => {
    const now = new Date();
    const upcomingApt = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStart);
      return aptDate >= now && apt.status === "Scheduled";
    });
    const pastApt = appointments.filter((apt) => {
      const aptEndDate = new Date(apt.slotEnd);
      return now > aptEndDate && (apt.status === "Completed" || apt.status === "Cancelled");
    });
    const ongoingApt = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStart);
      const aptEndDate = new Date(apt.slotEnd);
      const isTimeOngoing = now >= aptDate && now <= aptEndDate;
      return isTimeOngoing && (apt.status === "Scheduled" || apt.status === "Progress");
    });
    setUpcoming(upcomingApt);
    setPast(pastApt);
    setOngoing(ongoingApt);
    setTabCount({ upcoming: upcomingApt.length, past: pastApt.length });
  }, [appointments]);

  const handleUpload = async (aptId: string, file: File) => {
    setUploading((u) => ({ ...u, [aptId]: true }));
    setUploadError((e) => ({ ...e, [aptId]: null }));
    try {
      const pescription = await updatePrecription(aptId, file);
      if (pescription) {
        setPast((prev) => prev.map((a) => (a._id === aptId ? { ...a, pescription } : a)));
      }
    } catch (err: any) {
      setUploadError((e) => ({ ...e, [aptId]: err?.message || "Something went wrong" }));
    } finally {
      setUploading((u) => ({ ...u, [aptId]: false }));
    }
  };

  const handleDelete = async (aptId: string) => {
    try {
      await deletePrescription(aptId);
      setPast((prev) => prev.map((a) => (a._id === aptId ? { ...a, pescription: undefined } : a)));
    } catch (err) {
      console.error("Failed to delete prescription:", err);
    }
  };

  const handleMarkFollowUp = async (aptId: string) => {
    try {
      await markAsFollowUp(aptId);
      setPast((prev) => prev.map((a) => (a._id === aptId ? { ...a, isFollowUp: true } : a)));
    } catch (err) {
      console.error("Failed to mark as follow-up:", err);
    }
  };

  const handleSaveNotes = async (aptId: string, notes: string) => {
    try {
      await updateNotes(aptId, notes);
      setPast((prev) => prev.map((a) => (a._id === aptId ? { ...a, notes } : a)));
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  const list = activeTab === "upcoming" ? upcoming : past;

  const canJoinCall = (appointment: Appointment) => {
    const now = new Date();
    const strtTime = new Date(appointment.slotStart);
    const endTime = new Date(appointment.slotEnd);
    const diff = (strtTime.getTime() - now.getTime()) / (60 * 1000);
    return (
      diff <= 10 &&
      now <= endTime &&
      (appointment.status === "Progress" || appointment.status === "Scheduled")
    );
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (a) =>
        a.patientID?.name?.toLowerCase().includes(q) ||
        a.symptoms?.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q),
    );
  }, [list, search]);

  const rxStats = useMemo(() => {
    const cp = past.filter((a) => a.status === "Completed");
    const up = cp.filter((a) => a.pescription != null).length;
    return { total: cp.length, uploaded: up, pending: cp.length - up };
  }, [past]);

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

      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute -top-40 left-1/3 w-[700px] h-[400px] bg-blue-100/40 rounded-full blur-[130px]' />
        <div className='absolute bottom-0 right-0 w-64 h-64 bg-blue-50/60 rounded-full blur-[90px]' />
      </div>

      <div className='appt-root relative mx-auto w-full max-w-3xl'>
        {/* HEADER */}
        <div className='mb-7'>
          <button
            onClick={() => router.push("/doctor/dashboard")}
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
                  Appointments
                </span>
              </div>
              <h1 className='text-[28px] font-black text-slate-900 leading-tight'>
                My Consultations
              </h1>
              <p className='mt-1 text-sm text-slate-500 font-medium'>
                Manage your schedule, patients &amp; records.
              </p>
            </div>
          </div>
        </div>

        {/* Current Consultation Section - Shows when there are live consultations */}
        <CurrentConsultationSection
          currentConsultations={ongoing}
          onJoin={(id) => router.push(`/call/${id}`)}
          onProfile={(id) => router.push(`/doctor/patients/${id}`)}
        />

        {activeTab === "upcoming" && !search && <TodayStrip apts={upcoming} />}

        {activeTab === "past" && (
          <div className='grid grid-cols-3 gap-3 mb-5'>
            {[
              {
                label: "Completed",
                val: rxStats.total,
                cls: "border-blue-200 bg-blue-50 text-blue-700",
              },
              {
                label: "Rx Uploaded",
                val: rxStats.uploaded,
                cls: "border-emerald-200 bg-emerald-50 text-emerald-700",
              },
              {
                label: "Rx Pending",
                val: rxStats.pending,
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
              placeholder='Search patient, symptom…'
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
              {activeTab === "upcoming" ? "Upcoming Consultations" : "Past 7 Days — History"}
            </span>
            <span className='text-xs text-blue-300 font-mono'>{filtered.length} records</span>
          </div>

          <div className='p-4 sm:p-5'>
            {filtered.length === 0 && (
              <div className='flex flex-col items-center justify-center gap-3 py-14 text-center'>
                <div className='w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center'>
                  <CalIcon className='text-blue-400' />
                </div>
                <p className='text-sm font-bold text-slate-700'>No appointments found</p>
                <p className='text-xs text-slate-400'>Try adjusting your search or switch tabs.</p>
              </div>
            )}

            {/* UPCOMING: grouped by date */}
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
                          onProfile={(id) => router.push(`/doctor/patients/${id}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAST: flat list */}
            {activeTab === "past" && (
              <div className='space-y-3'>
                {filtered.map((apt) => (
                  <PastCard
                    key={apt._id}
                    apt={apt}
                    onUpload={handleUpload}
                    onDelete={handleDelete}
                    isUploading={!!uploading[apt._id]}
                    uploadError={uploadError[apt._id]}
                    onPatientHistory={(id) => router.push(`/patient-history/${id}`)}
                    onMarkFollowUp={handleMarkFollowUp}
                    onSaveNotes={handleSaveNotes}
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

export default DoctorAppointments;
