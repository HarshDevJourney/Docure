"use client";

import { useEffect, useState } from "react";
import { userAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { specializations, healthcareCategoriesList, days } from "@/lib/constant";
import {
  User,
  Pen,
  X,
  Save,
  Loader2,
  Mail,
  Stethoscope,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Hospital,
  MapPin,
  CalendarRange,
  Clock,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Shield,
  ChevronRight,
  Building2,
  Timer,
  CalendarDays,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

const toInputDate = (v?: string) => {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

// ─── Form type ───────────────────────────────────────────────────────────────

interface DocForm {
  name: string;
  specialization: string;
  qualification: string;
  category: string[];
  experience: number;
  about: string;
  fees: number;
  hospitalInfo: { name: string; address: string; city: string };
  availabilityRange: { startDate: string; endDate: string; excludedWeekdays: number[] };
  dailyTimeRange: { start: string; end: string }[];
  slotDurationMinutes: number;
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "practice", label: "Practice", icon: Building2 },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Reusable field components ────────────────────────────────────────────────

const inputBase =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-sm";

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) => (
  <div className='space-y-1.5'>
    <label className='block text-[11px] font-black uppercase tracking-[0.12em] text-slate-400'>
      {label}
    </label>
    <div className='relative'>
      {icon && (
        <div className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'>
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputBase} ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className='space-y-1.5'>
    <label className='block text-[11px] font-black uppercase tracking-[0.12em] text-slate-400'>
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-sm resize-none'
    />
  </div>
);

const NumberField = ({
  label,
  value,
  onChange,
  min = 0,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  prefix?: string;
}) => (
  <div className='space-y-1.5'>
    <label className='block text-[11px] font-black uppercase tracking-[0.12em] text-slate-400'>
      {label}
    </label>
    <div className='relative'>
      {prefix && (
        <span className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400'>
          {prefix}
        </span>
      )}
      <input
        type='number'
        value={value}
        min={min}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={`${inputBase} ${prefix ? "pl-8" : ""}`}
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  icon?: React.ReactNode;
}) => (
  <div className='space-y-1.5'>
    <label className='block text-[11px] font-black uppercase tracking-[0.12em] text-slate-400'>
      {label}
    </label>
    <div className='relative'>
      {icon && (
        <div className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'>
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} cursor-pointer appearance-none ${icon ? "pl-10" : ""}`}
      >
        <option value=''>{placeholder || "Select"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronRight className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-slate-400' />
    </div>
  </div>
);

// ─── Display row (read mode) ──────────────────────────────────────────────────

const DataRow = ({
  icon,
  label,
  value,
  accent = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  accent?: "blue" | "emerald" | "violet" | "rose";
}) => {
  const accentMap = {
    blue: "bg-blue-50   text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50  text-violet-600",
    rose: "bg-rose-50    text-rose-600",
  };
  return (
    <div className='flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50/80'>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentMap[accent]}`}
      >
        {icon}
      </div>
      <div className='min-w-0 pt-0.5'>
        <p className='text-[10px] font-black uppercase tracking-[0.12em] text-slate-400'>{label}</p>
        <p className='mt-0.5 text-sm font-semibold text-slate-800 whitespace-pre-line'>
          {value || <span className='italic font-normal text-slate-300'>Not set</span>}
        </p>
      </div>
    </div>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className='space-y-3'>
    {title && (
      <h3 className='text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 px-1'>
        {title}
      </h3>
    )}
    {children}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Pulse = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DoctorProfilePage() {
  const { user, fetchProfile, updateProfile, isloading } = userAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = user as any;

  const buildForm = (): DocForm => ({
    name: user?.name || "",
    specialization: u?.specialization || "",
    qualification: u?.qualification || "",
    category: u?.category || [],
    experience: u?.experience || 0,
    about: u?.about || "",
    fees: u?.fees || 0,
    hospitalInfo: {
      name: u?.hospitalInfo?.name || "",
      address: u?.hospitalInfo?.address || "",
      city: u?.hospitalInfo?.city || u?.hospitalInfo?.cityName || "",
    },
    availabilityRange: {
      startDate: toInputDate(u?.availabilityRange?.startDate),
      endDate: toInputDate(u?.availabilityRange?.endDate),
      excludedWeekdays: (u?.availabilityRange?.excludedWeekdays || []).map(Number),
    },
    dailyTimeRange: u?.dailyTimeRange?.length
      ? u.dailyTimeRange.map((s: { start: string; end: string }) => ({
          start: s.start,
          end: s.end,
        }))
      : [{ start: "09:00", end: "17:00" }],
    slotDurationMinutes: u?.slotDurationMinutes || 30,
  });

  const [form, setForm] = useState<DocForm>(buildForm);

  useEffect(() => {
    fetchProfile().then(() => setLoaded(true));
  }, [fetchProfile]);
  useEffect(() => {
    if (user) setForm(buildForm());
  }, [user]); // eslint-disable-line

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.dailyTimeRange.length) {
      toast.error("Add at least one time slot");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) setForm(buildForm());
  };

  const toggleCategory = (cat: string) =>
    setForm((p) => ({
      ...p,
      category: p.category.includes(cat)
        ? p.category.filter((c) => c !== cat)
        : [...p.category, cat],
    }));

  const toggleWeekday = (day: number) =>
    setForm((p) => ({
      ...p,
      availabilityRange: {
        ...p.availabilityRange,
        excludedWeekdays: p.availabilityRange.excludedWeekdays.includes(day)
          ? p.availabilityRange.excludedWeekdays.filter((d) => d !== day)
          : [...p.availabilityRange.excludedWeekdays, day],
      },
    }));

  const addTimeSlot = () =>
    setForm((p) => ({
      ...p,
      dailyTimeRange: [...p.dailyTimeRange, { start: "09:00", end: "17:00" }],
    }));
  const removeTimeSlot = (i: number) =>
    setForm((p) => ({ ...p, dailyTimeRange: p.dailyTimeRange.filter((_, idx) => idx !== i) }));
  const updateTimeSlot = (i: number, field: "start" | "end", value: string) =>
    setForm((p) => ({
      ...p,
      dailyTimeRange: p.dailyTimeRange.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    }));

  // ── Loading states ─────────────────────────────────────────────────────────

  if (!user)
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-300/40'>
            <Loader2 className='h-7 w-7 animate-spin text-white' />
          </div>
          <p className='text-sm font-semibold text-slate-400'>Loading your profile…</p>
        </div>
      </div>
    );

  if (!loaded && isloading)
    return (
      <div className='min-h-screen bg-slate-50 px-4 py-8'>
        <div className='mx-auto max-w-2xl space-y-4'>
          <Pulse className='h-52 w-full' />
          <Pulse className='h-12 w-full' />
          <Pulse className='h-64 w-full' />
          <Pulse className='h-40 w-full' />
        </div>
      </div>
    );

  // ── Render ────────────────────────────────────────────────────────────────

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "DR";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        .prof-font { font-family: 'Sora', sans-serif; }
        .body-font  { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-fade-in  { animation: fade-in 0.3s ease both; }
        .tab-active {
          background: white;
          color: #2563eb;
          box-shadow: 0 1px 8px 0 rgba(37,99,235,0.12), 0 0 0 1px rgba(37,99,235,0.08);
        }
      `}</style>

      <section className='body-font min-h-screen bg-slate-50 px-4 py-8 md:px-6'>
        <div className='mx-auto max-w-2xl space-y-5'>
          {/* ══════════════════════════════════════════════
              HEADER CARD
          ══════════════════════════════════════════════ */}
          <div className='animate-slide-up overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100'>
            {/* Hero banner with doctor info */}
            <div className='relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pb-5 pt-8'>
              {/* Geometric pattern */}
              <svg className='absolute inset-0 h-full w-full opacity-[0.07]' viewBox='0 0 400 300'>
                <defs>
                  <pattern
                    id='hex'
                    x='0'
                    y='0'
                    width='40'
                    height='35'
                    patternUnits='userSpaceOnUse'
                  >
                    <polygon
                      points='20,2 38,12 38,23 20,33 2,23 2,12'
                      fill='none'
                      stroke='white'
                      strokeWidth='1'
                    />
                  </pattern>
                </defs>
                <rect width='400' height='300' fill='url(#hex)' />
              </svg>
              {/* Decorative circles */}
              <div className='absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5' />
              <div className='absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5' />
              {/* Gradient overlay */}
              <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/30 to-transparent' />

              {/* Avatar + info row */}
              <div className='relative flex items-start gap-5'>
                {/* Avatar */}
                <div className='relative shrink-0'>
                  <div className='prof-font flex h-[88px] w-[88px] items-center justify-center rounded-2xl border-[3px] border-white/25 bg-white/15 text-3xl font-extrabold text-white shadow-2xl shadow-blue-900/40 backdrop-blur-sm'>
                    {initials}
                  </div>
                  {user.isVerified && (
                    <div className='absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-700 bg-white shadow-lg'>
                      <Shield className='h-3.5 w-3.5 text-blue-600' />
                    </div>
                  )}
                </div>

                {/* Name + details */}
                <div className='min-w-0 flex-1 pt-0.5'>
                  <div className='flex items-center gap-2.5'>
                    <h1 className='prof-font truncate text-2xl font-extrabold text-white drop-shadow-sm'>
                      Dr. {user.name}
                    </h1>
                    {user.isVerified && (
                      <span className='shrink-0 rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200'>
                        Verified
                      </span>
                    )}
                  </div>

                  <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1'>
                    <p className='flex items-center gap-1.5 text-sm text-blue-100/90'>
                      <Mail className='h-3.5 w-3.5 shrink-0 text-blue-200/70' />
                      <span className='truncate'>{user.email}</span>
                    </p>
                    {u.specialization && (
                      <p className='flex items-center gap-1.5 text-sm font-semibold text-blue-100'>
                        <Stethoscope className='h-3.5 w-3.5 text-blue-200/70' />
                        {u.specialization}
                      </p>
                    )}
                  </div>

                  {u.hospitalInfo?.name && (
                    <p className='mt-1 flex items-center gap-1.5 text-xs text-blue-200/70'>
                      <Hospital className='h-3 w-3' />
                      {u.hospitalInfo.name}
                      {(u.hospitalInfo?.city || u.hospitalInfo?.cityName) && (
                        <span className='text-blue-300/40'>|</span>
                      )}
                      {(u.hospitalInfo?.city || u.hospitalInfo?.cityName) && (
                        <span className='flex items-center gap-1'>
                          <MapPin className='h-3 w-3' />
                          {u.hospitalInfo.city || u.hospitalInfo.cityName}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
                {/* Stat pills inside banner */}
                {(u.experience || u.fees || u.slotDurationMinutes) && (
                  <div className='relative mt-2 flex flex-wrap gap-2 ml-26'>
                    {u.experience > 0 && (
                      <div className='flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm'>
                        <Briefcase className='h-3 w-3 text-blue-200' />
                        {u.experience} yrs exp
                      </div>
                    )}
                    {u.fees > 0 && (
                      <div className='flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm'>
                        <IndianRupee className='h-3 w-3 text-blue-200' />
                        {u.fees} / consult
                      </div>
                    )}
                    {u.slotDurationMinutes && (
                      <div className='flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm'>
                        <Timer className='h-3 w-3 text-blue-200' />
                        {u.slotDurationMinutes} min slots
                      </div>
                    )}
                  </div>
                )}

            </div>

            {/* Action buttons */}
            <div className='px-6 py-4'>
              <div className='flex items-center gap-2'>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className='flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-300/40 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
                  >
                    <Pen className='h-3.5 w-3.5' />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className='flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-300/40 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                      {saving ? (
                        <Loader2 className='h-3.5 w-3.5 animate-spin' />
                      ) : (
                        <Save className='h-3.5 w-3.5' />
                      )}
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]'
                    >
                      <X className='h-3.5 w-3.5' />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              TAB BAR
          ══════════════════════════════════════════════ */}
          <div
            className='animate-slide-up rounded-2xl border border-slate-100 bg-slate-100/80 p-1.5 shadow-sm'
            style={{ animationDelay: "60ms" }}
          >
            <div className='grid grid-cols-3 gap-1'>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                      active
                        ? "tab-active text-blue-700"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-blue-600" : ""}`} />
                    <span className='hidden sm:block'>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              TAB CONTENT
          ══════════════════════════════════════════════ */}
          <div
            key={activeTab + String(editing)}
            className='animate-slide-up rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden'
            style={{ animationDelay: "100ms" }}
          >
            {/* ── TAB: PROFILE ── */}
            {activeTab === "profile" && (
              <div>
                {/* Section header */}
                <div className='flex items-center gap-3 border-b border-slate-100 px-6 py-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200'>
                    <User className='h-4 w-4' />
                  </div>
                  <div>
                    <h2 className='prof-font text-sm font-extrabold text-slate-900'>
                      Professional Info
                    </h2>
                    <p className='text-xs text-slate-400'>Your qualifications and expertise</p>
                  </div>
                </div>

                <div className='p-6 space-y-6'>
                  {!editing ? (
                    <>
                      <div className='grid grid-cols-1 gap-1 sm:grid-cols-2'>
                        <DataRow
                          icon={<User className='h-4 w-4' />}
                          label='Full Name'
                          value={user.name}
                        />
                        <DataRow
                          icon={<Stethoscope className='h-4 w-4' />}
                          label='Specialization'
                          value={u.specialization}
                        />
                        <DataRow
                          icon={<GraduationCap className='h-4 w-4' />}
                          label='Qualification'
                          value={u.qualification}
                        />
                        <DataRow
                          icon={<Briefcase className='h-4 w-4' />}
                          label='Experience'
                          value={u.experience ? `${u.experience} years` : undefined}
                          accent='violet'
                        />
                        <DataRow
                          icon={<IndianRupee className='h-4 w-4' />}
                          label='Consultation Fee'
                          value={u.fees ? `₹${u.fees}` : undefined}
                          accent='emerald'
                        />
                      </div>

                      {u.about && (
                        <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4'>
                          <p className='mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400'>
                            About
                          </p>
                          <p className='text-sm leading-relaxed text-slate-700'>{u.about}</p>
                        </div>
                      )}

                      {/* Categories */}
                      {((u.category as string[]) || []).length > 0 && (
                        <div>
                          <p className='mb-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400'>
                            Categories
                            <span className='ml-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-blue-700'>
                              {u.category.length}
                            </span>
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            {(u.category as string[]).map((cat: string) => (
                              <span
                                key={cat}
                                className='rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Section title='Basic Info'>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                          <Field
                            label='Full Name'
                            value={form.name}
                            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                            placeholder='Dr. John Doe'
                            icon={<User className='h-4 w-4' />}
                          />
                          <SelectField
                            label='Specialization'
                            value={form.specialization}
                            onChange={(v) => setForm((p) => ({ ...p, specialization: v }))}
                            options={specializations}
                            placeholder='Select specialization'
                            icon={<Stethoscope className='h-4 w-4' />}
                          />
                          <Field
                            label='Qualification'
                            value={form.qualification}
                            onChange={(v) => setForm((p) => ({ ...p, qualification: v }))}
                            placeholder='e.g., MBBS, MD'
                            icon={<GraduationCap className='h-4 w-4' />}
                          />
                          <NumberField
                            label='Experience (years)'
                            value={form.experience}
                            onChange={(v) => setForm((p) => ({ ...p, experience: v }))}
                          />
                          <NumberField
                            label='Consultation Fee'
                            value={form.fees}
                            onChange={(v) => setForm((p) => ({ ...p, fees: v }))}
                            prefix='₹'
                          />
                        </div>
                      </Section>

                      <Section title='About You'>
                        <TextAreaField
                          label=''
                          value={form.about}
                          onChange={(v) => setForm((p) => ({ ...p, about: v }))}
                          placeholder='Tell patients about your background, expertise, and approach to care…'
                          rows={4}
                        />
                      </Section>

                      <Section title='Categories'>
                        <div className='flex flex-wrap gap-2'>
                          {healthcareCategoriesList.map((cat) => {
                            const selected = form.category.includes(cat);
                            return (
                              <button
                                key={cat}
                                type='button'
                                onClick={() => toggleCategory(cat)}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                                  selected
                                    ? "border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-200"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                              >
                                {selected && <CheckCircle2 className='h-3 w-3' />}
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </Section>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB: PRACTICE ── */}
            {activeTab === "practice" && (
              <div>
                <div className='flex items-center gap-3 border-b border-slate-100 px-6 py-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200'>
                    <Building2 className='h-4 w-4' />
                  </div>
                  <div>
                    <h2 className='prof-font text-sm font-extrabold text-slate-900'>
                      Hospital / Clinic
                    </h2>
                    <p className='text-xs text-slate-400'>Where you practice</p>
                  </div>
                </div>

                <div className='p-6'>
                  {!editing ? (
                    <div className='grid grid-cols-1 gap-1 sm:grid-cols-2'>
                      <DataRow
                        icon={<Hospital className='h-4 w-4' />}
                        label='Hospital / Clinic'
                        value={u.hospitalInfo?.name}
                        accent='emerald'
                      />
                      <DataRow
                        icon={<MapPin className='h-4 w-4' />}
                        label='City'
                        value={u.hospitalInfo?.city || u.hospitalInfo?.cityName}
                      />
                      <DataRow
                        icon={<FileText className='h-4 w-4' />}
                        label='Full Address'
                        value={u.hospitalInfo?.address}
                      />
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <Field
                        label='Hospital / Clinic Name'
                        value={form.hospitalInfo.name}
                        onChange={(v) =>
                          setForm((p) => ({ ...p, hospitalInfo: { ...p.hospitalInfo, name: v } }))
                        }
                        placeholder='City General Hospital'
                        icon={<Hospital className='h-4 w-4' />}
                      />
                      <Field
                        label='City'
                        value={form.hospitalInfo.city}
                        onChange={(v) =>
                          setForm((p) => ({ ...p, hospitalInfo: { ...p.hospitalInfo, city: v } }))
                        }
                        placeholder='Mumbai'
                        icon={<MapPin className='h-4 w-4' />}
                      />
                      <div className='sm:col-span-2'>
                        <TextAreaField
                          label='Full Address'
                          value={form.hospitalInfo.address}
                          onChange={(v) =>
                            setForm((p) => ({
                              ...p,
                              hospitalInfo: { ...p.hospitalInfo, address: v },
                            }))
                          }
                          placeholder='Street, landmark, pincode…'
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB: SCHEDULE ── */}
            {activeTab === "schedule" && (
              <div>
                <div className='flex items-center gap-3 border-b border-slate-100 px-6 py-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200'>
                    <CalendarDays className='h-4 w-4' />
                  </div>
                  <div>
                    <h2 className='prof-font text-sm font-extrabold text-slate-900'>
                      Availability & Schedule
                    </h2>
                    <p className='text-xs text-slate-400'>When patients can book you</p>
                  </div>
                </div>

                <div className='p-6 space-y-6'>
                  {!editing ? (
                    <>
                      {/* Date range + slot duration */}
                      <div className='grid grid-cols-1 gap-1 sm:grid-cols-2'>
                        <DataRow
                          icon={<CalendarRange className='h-4 w-4' />}
                          label='Available From'
                          value={formatDate(u.availabilityRange?.startDate)}
                          accent='violet'
                        />
                        <DataRow
                          icon={<CalendarRange className='h-4 w-4' />}
                          label='Available Until'
                          value={formatDate(u.availabilityRange?.endDate)}
                          accent='violet'
                        />
                        <DataRow
                          icon={<Timer className='h-4 w-4' />}
                          label='Slot Duration'
                          value={
                            u.slotDurationMinutes ? `${u.slotDurationMinutes} minutes` : undefined
                          }
                          accent='violet'
                        />
                      </div>

                      {/* ── Non-working days ── visual week grid */}
                      <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4'>
                        <p className='mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400'>
                          Weekly Schedule
                        </p>
                        <div className='grid grid-cols-7 gap-1.5'>
                          {days.map((d) => {
                            const isOff = (
                              (u.availabilityRange?.excludedWeekdays || []).map(Number)
                            ).includes(d.value);
                            return (
                              <div
                                key={d.value}
                                className={`flex flex-col items-center gap-1 rounded-xl py-2.5 px-1 ${
                                  isOff
                                    ? "bg-rose-50 border border-rose-200"
                                    : "bg-emerald-50 border border-emerald-200"
                                }`}
                              >
                                <span
                                  className={`text-[10px] font-black uppercase ${isOff ? "text-rose-400" : "text-emerald-500"}`}
                                >
                                  {d.label.slice(0, 3)}
                                </span>
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded-full ${isOff ? "bg-rose-100" : "bg-emerald-100"}`}
                                >
                                  {isOff ? (
                                    <X className='h-3 w-3 text-rose-500' />
                                  ) : (
                                    <CheckCircle2 className='h-3 w-3 text-emerald-500' />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className='mt-3 flex items-center gap-4 text-[11px] text-slate-400'>
                          <span className='flex items-center gap-1.5'>
                            <span className='h-2 w-2 rounded-full bg-emerald-400' />
                            Working
                          </span>
                          <span className='flex items-center gap-1.5'>
                            <span className='h-2 w-2 rounded-full bg-rose-400' />
                            Off
                          </span>
                        </div>
                      </div>

                      {/* ── Daily time slots ── timeline style */}
                      {((u.dailyTimeRange as { start: string; end: string }[]) || []).length >
                        0 && (
                        <div>
                          <p className='mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400'>
                            Daily Time Windows
                          </p>
                          <div className='space-y-2'>
                            {(u.dailyTimeRange as { start: string; end: string }[]).map(
                              (slot, i) => {
                                // Parse hours for the visual bar
                                const [sh, sm] = slot.start.split(":").map(Number);
                                const [eh, em] = slot.end.split(":").map(Number);
                                const startMins = sh * 60 + (sm || 0);
                                const endMins = eh * 60 + (em || 0);
                                const totalDay = 24 * 60;
                                const leftPct = (startMins / totalDay) * 100;
                                const widthPct = Math.max(
                                  ((endMins - startMins) / totalDay) * 100,
                                  4,
                                );
                                const durationH = Math.floor((endMins - startMins) / 60);
                                const durationM = (endMins - startMins) % 60;
                                const durationLabel =
                                  durationH > 0
                                    ? `${durationH}h${durationM > 0 ? ` ${durationM}m` : ""}`
                                    : `${durationM}m`;

                                return (
                                  <div
                                    key={i}
                                    className='overflow-hidden rounded-2xl border border-violet-100 bg-white'
                                  >
                                    {/* Header row */}
                                    <div className='flex items-center justify-between px-4 pt-3 pb-2'>
                                      <div className='flex items-center gap-3'>
                                        <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-[11px] font-black text-violet-600'>
                                          {i + 1}
                                        </div>
                                        <div>
                                          <p className='text-sm font-black text-slate-800'>
                                            {slot.start}{" "}
                                            <span className='text-slate-400 font-normal'>→</span>{" "}
                                            {slot.end}
                                          </p>
                                          <p className='text-[11px] text-slate-400'>
                                            {durationLabel} window
                                          </p>
                                        </div>
                                      </div>
                                      <span className='rounded-full bg-violet-50 border border-violet-100 px-2.5 py-0.5 text-[10px] font-black text-violet-600'>
                                        {durationLabel}
                                      </span>
                                    </div>
                                    {/* Visual bar */}
                                    <div className='relative mx-4 mb-3 h-2 rounded-full bg-slate-100'>
                                      <div
                                        className='absolute top-0 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 shadow-sm'
                                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                      />
                                    </div>
                                    <div className='flex justify-between px-4 pb-2.5 text-[9px] font-semibold text-slate-300'>
                                      <span>12 AM</span>
                                      <span>6 AM</span>
                                      <span>12 PM</span>
                                      <span>6 PM</span>
                                      <span>12 AM</span>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Section title='Date Range & Duration'>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                          <Field
                            label='Available From'
                            value={form.availabilityRange.startDate}
                            onChange={(v) =>
                              setForm((p) => ({
                                ...p,
                                availabilityRange: { ...p.availabilityRange, startDate: v },
                              }))
                            }
                            type='date'
                          />
                          <Field
                            label='Available Until'
                            value={form.availabilityRange.endDate}
                            onChange={(v) =>
                              setForm((p) => ({
                                ...p,
                                availabilityRange: { ...p.availabilityRange, endDate: v },
                              }))
                            }
                            type='date'
                          />
                          <SelectField
                            label='Slot Duration'
                            value={String(form.slotDurationMinutes)}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, slotDurationMinutes: Number(v) }))
                            }
                            options={["5", "10", "15", "30", "60"]}
                            placeholder='Select'
                            icon={<Timer className='h-4 w-4' />}
                          />
                        </div>
                      </Section>

                      {/* ── Non-working days — interactive week grid ── */}
                      <Section title='Non-Working Days'>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4'>
                          <p className='mb-3 text-xs text-slate-400'>
                            Click a day to mark it as{" "}
                            <span className='font-semibold text-rose-500'>off</span>
                          </p>
                          <div className='grid grid-cols-7 gap-2'>
                            {days.map((d) => {
                              const excluded = form.availabilityRange.excludedWeekdays.includes(
                                d.value,
                              );
                              return (
                                <button
                                  key={d.value}
                                  type='button'
                                  onClick={() => toggleWeekday(d.value)}
                                  className={`group relative flex flex-col items-center gap-1.5 rounded-xl py-3 px-1 font-semibold transition-all duration-200 border-2 ${
                                    excluded
                                      ? "border-rose-300 bg-rose-50 text-rose-600 shadow-sm shadow-rose-100"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-400"
                                  }`}
                                >
                                  <span className='text-[11px] font-black uppercase'>
                                    {d.label.slice(0, 3)}
                                  </span>
                                  <div
                                    className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${excluded ? "bg-rose-100" : "bg-emerald-100 group-hover:bg-rose-100"}`}
                                  >
                                    {excluded ? (
                                      <X className='h-3 w-3 text-rose-500' />
                                    ) : (
                                      <CheckCircle2 className='h-3 w-3 text-emerald-500 group-hover:hidden' />
                                    )}
                                    {!excluded && (
                                      <X className='hidden h-3 w-3 text-rose-400 group-hover:block' />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {/* Status summary */}
                          <div className='mt-3 flex flex-wrap gap-2'>
                            {form.availabilityRange.excludedWeekdays.length === 0 ? (
                              <span className='flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                                <CheckCircle2 className='h-3 w-3' />
                                Available all 7 days
                              </span>
                            ) : (
                              <>
                                <span className='flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600'>
                                  <X className='h-3 w-3' />
                                  {form.availabilityRange.excludedWeekdays.length} day
                                  {form.availabilityRange.excludedWeekdays.length > 1 ? "s" : ""}{" "}
                                  off
                                </span>
                                <span className='flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                                  <CheckCircle2 className='h-3 w-3' />
                                  {7 - form.availabilityRange.excludedWeekdays.length} working day
                                  {7 - form.availabilityRange.excludedWeekdays.length !== 1
                                    ? "s"
                                    : ""}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </Section>

                      {/* ── Daily time slots ── */}
                      <Section title='Daily Time Slots'>
                        <div className='space-y-3'>
                          {form.dailyTimeRange.map((slot, i) => {
                            const [sh, sm] = slot.start.split(":").map(Number);
                            const [eh, em] = slot.end.split(":").map(Number);
                            const startMins = sh * 60 + (sm || 0);
                            const endMins = eh * 60 + (em || 0);
                            const durationM = endMins - startMins;
                            const durationH = Math.floor(durationM / 60);
                            const durationRm = durationM % 60;
                            const isValid = durationM > 0;
                            const totalDay = 24 * 60;
                            const leftPct = (startMins / totalDay) * 100;
                            const widthPct = Math.max((durationM / totalDay) * 100, 2);

                            return (
                              <div
                                key={i}
                                className={`overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                                  isValid
                                    ? "border-violet-200 bg-white shadow-sm shadow-violet-50"
                                    : "border-rose-200 bg-rose-50/30"
                                }`}
                              >
                                <div className='flex items-center gap-3 p-3'>
                                  {/* Slot number */}
                                  <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-black ${isValid ? "bg-violet-100 text-violet-600" : "bg-rose-100 text-rose-500"}`}
                                  >
                                    {i + 1}
                                  </div>

                                  {/* Time inputs */}
                                  <div className='flex flex-1 items-center gap-2'>
                                    <div className='flex-1'>
                                      <p className='mb-1 text-[9px] font-black uppercase tracking-wider text-slate-400'>
                                        Start
                                      </p>
                                      <input
                                        type='time'
                                        value={slot.start}
                                        onChange={(e) => updateTimeSlot(i, "start", e.target.value)}
                                        className='h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all'
                                      />
                                    </div>
                                    <div className='flex flex-col items-center pt-4'>
                                      <div className='flex items-center gap-1'>
                                        <div className='h-px w-3 bg-slate-300' />
                                        <Clock className='h-3 w-3 text-slate-300' />
                                        <div className='h-px w-3 bg-slate-300' />
                                      </div>
                                    </div>
                                    <div className='flex-1'>
                                      <p className='mb-1 text-[9px] font-black uppercase tracking-wider text-slate-400'>
                                        End
                                      </p>
                                      <input
                                        type='time'
                                        value={slot.end}
                                        onChange={(e) => updateTimeSlot(i, "end", e.target.value)}
                                        className='h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all'
                                      />
                                    </div>
                                  </div>

                                  {/* Duration badge + delete */}
                                  <div className='flex flex-col items-end gap-1.5'>
                                    {isValid ? (
                                      <span className='rounded-lg bg-violet-50 border border-violet-100 px-2 py-0.5 text-[11px] font-black text-violet-600'>
                                        {durationH > 0 ? `${durationH}h ` : ""}
                                        {durationRm > 0 ? `${durationRm}m` : ""}
                                      </span>
                                    ) : (
                                      <span className='rounded-lg bg-rose-50 border border-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-400'>
                                        Invalid
                                      </span>
                                    )}
                                    {form.dailyTimeRange.length > 1 && (
                                      <button
                                        type='button'
                                        onClick={() => removeTimeSlot(i)}
                                        className='flex h-7 w-7 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-400 transition-all hover:bg-rose-100 hover:text-rose-600'
                                      >
                                        <Trash2 className='h-3 w-3' />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Visual timeline bar */}
                                {isValid && (
                                  <div className='px-3 pb-3'>
                                    <div className='relative h-1.5 rounded-full bg-slate-100'>
                                      <div
                                        className='absolute top-0 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-400'
                                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                      />
                                    </div>
                                    <div className='mt-1 flex justify-between text-[8px] font-semibold text-slate-300'>
                                      <span>12AM</span>
                                      <span>6AM</span>
                                      <span>12PM</span>
                                      <span>6PM</span>
                                      <span>12AM</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Add slot */}
                        <button
                          type='button'
                          onClick={addTimeSlot}
                          className='mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 py-3 text-sm font-bold text-violet-500 transition-all hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700'
                        >
                          <Plus className='h-4 w-4' />
                          Add Time Window
                        </button>
                      </Section>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Floating save bar when editing */}
          {editing && (
            <div
              className='animate-slide-up sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/90 px-5 py-3 shadow-2xl shadow-blue-200/40 backdrop-blur-md'
              style={{ animationDelay: "120ms" }}
            >
              <p className='text-xs font-semibold text-slate-500'>
                Unsaved changes on{" "}
                <span className='text-blue-600'>{TABS.find((t) => t.id === activeTab)?.label}</span>
              </p>
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleCancel}
                  className='rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50'
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className='flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-300/40 transition-all hover:bg-blue-700 disabled:opacity-60'
                >
                  {saving ? (
                    <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  ) : (
                    <Save className='h-3.5 w-3.5' />
                  )}
                  {saving ? "Saving…" : "Save All"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
