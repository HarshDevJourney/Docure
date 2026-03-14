"use client";

import { useEffect, useState } from "react";
import { userAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import {
  User,
  Pen,
  X,
  Save,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Heart,
  Droplets,
  Shield,
  AlertCircle,
  Activity,
  Pill,
  Siren,
  CheckCircle2,
  ChevronRight,
  UserRound,
  HeartPulse,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = ["male", "female", "other"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const RELATION_OPTIONS = ["father", "mother", "spouse", "sibling", "friend", "other"];

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

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined);

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "emergency", label: "Emergency", icon: Siren },
  { id: "medical", label: "Medical", icon: HeartPulse },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Field components (identical to DoctorProfilePage) ───────────────────────

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
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <ChevronRight className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-slate-400' />
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
  accent?: "blue" | "emerald" | "violet" | "rose" | "amber";
}) => {
  const accentMap = {
    blue: "bg-blue-50    text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50  text-violet-600",
    rose: "bg-rose-50    text-rose-600",
    amber: "bg-amber-50   text-amber-600",
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

// ─── Section title wrapper ────────────────────────────────────────────────────

const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className='space-y-3'>
    {title && (
      <h3 className='px-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400'>
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

// ─── Alert / medical badge ────────────────────────────────────────────────────

const MedicalBadge = ({ text, color }: { text: string; color: "rose" | "amber" | "violet" }) => {
  const map = {
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[color]}`}
    >
      {text}
    </span>
  );
};

// ─── Form shape ───────────────────────────────────────────────────────────────

interface PatientForm {
  name: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGrp: string;
  emergencyContact: { name: string; phone: string; relation: string };
  medicalHistory: { allergies: string; currentMedications: string; chronicConditions: string };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PatientProfilePage() {
  const { user, fetchProfile, updateProfile, isloading } = userAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = user as any;

  const buildForm = (): PatientForm => ({
    name: user?.name || "",
    phone: user?.phone || "",
    dob: toInputDate(user?.dob),
    gender: u?.gender || "",
    bloodGrp: u?.bloodGrp || user?.bloodGroup || "",
    emergencyContact: {
      name: user?.emergencyContact?.name || "",
      phone: user?.emergencyContact?.phone || "",
      relation: u?.emergencyContact?.relation || user?.emergencyContact?.relationship || "",
    },
    medicalHistory: {
      allergies: user?.medicalHistory?.allergies || "",
      currentMedications: user?.medicalHistory?.currentMedications || "",
      chronicConditions: user?.medicalHistory?.chronicConditions || "",
    },
  });

  const [form, setForm] = useState<PatientForm>(buildForm);

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

  const set = (path: string, value: string) =>
    setForm((prev) => {
      const parts = path.split(".");
      if (parts.length === 1) return { ...prev, [parts[0]]: value };
      const [sec, field] = parts;
      return { ...prev, [sec]: { ...(prev as any)[sec], [field]: value } }; // eslint-disable-line
    });

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
          <Pulse className='h-56 w-full' />
          <Pulse className='h-40 w-full' />
        </div>
      </div>
    );

  // ── Derived display values ─────────────────────────────────────────────────

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PT";
  const gender = u?.gender || "";
  const bloodGrp = u?.bloodGrp || user?.bloodGroup || "";
  const relation = u?.emergencyContact?.relation || user?.emergencyContact?.relationship || "";

  // Parse age from dob
  const dobDate = user?.dob ? new Date(user.dob) : null;
  const age =
    dobDate && !isNaN(dobDate.getTime())
      ? Math.floor((Date.now() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
      : (user as any)?.age || null;

  // Has any medical data?
  const hasMedical =
    user?.medicalHistory?.allergies ||
    user?.medicalHistory?.currentMedications ||
    user?.medicalHistory?.chronicConditions;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        .prof-font  { font-family: 'Sora', sans-serif; }
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
          <div className='animate-slide-up overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60'>
            {/* ── Hero banner with patient info ── */}
            <div className='relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pb-5 pt-8'>
              {/* Hex pattern */}
              <svg className='absolute inset-0 h-full w-full opacity-[0.07]' viewBox='0 0 400 300'>
                <defs>
                  <pattern
                    id='pat'
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
                <rect width='400' height='300' fill='url(#pat)' />
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
                      {user.name}
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
                    {user.phone && (
                      <p className='flex items-center gap-1.5 text-sm font-semibold text-blue-100'>
                        <Phone className='h-3.5 w-3.5 text-blue-200/70' />
                        {user.phone}
                      </p>
                    )}
                  </div>

                  {user.dob && (
                    <p className='mt-1 flex items-center gap-1.5 text-xs text-blue-200/70'>
                      <Calendar className='h-3 w-3' />
                      {formatDate(user.dob)}
                      {age && (
                        <>
                          <span className='text-blue-300/40'>|</span>
                          <span>{age} years old</span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Stat pills inside banner */}
              {(gender || bloodGrp || user?.emergencyContact?.name) && (
                <div className='relative mt-4 flex flex-wrap gap-2'>
                  {gender && (
                    <div className='flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm'>
                      <User className='h-3 w-3 text-blue-200' />
                      {capitalize(gender)}
                    </div>
                  )}
                  {bloodGrp && (
                    <div className='flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm'>
                      <Droplets className='h-3 w-3 text-blue-200' />
                      {bloodGrp}
                    </div>
                  )}
                  {user?.emergencyContact?.name && (
                    <div className='flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm'>
                      <Siren className='h-3 w-3 text-blue-200' />
                      {user.emergencyContact.name}
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
                        : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
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
            className='animate-slide-up overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50'
            style={{ animationDelay: "100ms" }}
          >
            {/* ── TAB: PERSONAL ── */}
            {activeTab === "personal" && (
              <div>
                <div className='flex items-center gap-3 border-b border-slate-100 px-6 py-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200'>
                    <UserRound className='h-4 w-4' />
                  </div>
                  <div>
                    <h2 className='prof-font text-sm font-extrabold text-slate-900'>
                      Personal Information
                    </h2>
                    <p className='text-xs text-slate-400'>Your basic details and demographics</p>
                  </div>
                </div>

                <div className='p-6 space-y-5'>
                  {!editing ? (
                    <div className='grid grid-cols-1 gap-1 sm:grid-cols-2'>
                      <DataRow
                        icon={<User className='h-4 w-4' />}
                        label='Full Name'
                        value={user.name}
                      />
                      <DataRow
                        icon={<Mail className='h-4 w-4' />}
                        label='Email'
                        value={user.email}
                      />
                      <DataRow
                        icon={<Phone className='h-4 w-4' />}
                        label='Phone'
                        value={user.phone}
                        accent='violet'
                      />
                      <DataRow
                        icon={<Calendar className='h-4 w-4' />}
                        label='Date of Birth'
                        value={formatDate(user.dob)}
                        accent='violet'
                      />
                      <DataRow
                        icon={<User className='h-4 w-4' />}
                        label='Gender'
                        value={capitalize(gender)}
                        accent='emerald'
                      />
                      <DataRow
                        icon={<Droplets className='h-4 w-4' />}
                        label='Blood Group'
                        value={bloodGrp || undefined}
                        accent='rose'
                      />
                      {age && (
                        <DataRow
                          icon={<Activity className='h-4 w-4' />}
                          label='Age'
                          value={`${age} years`}
                          accent='amber'
                        />
                      )}
                    </div>
                  ) : (
                    <Section title='Basic Details'>
                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <Field
                          label='Full Name'
                          value={form.name}
                          onChange={(v) => set("name", v)}
                          placeholder='John Doe'
                          icon={<User className='h-4 w-4' />}
                        />
                        <Field
                          label='Phone'
                          value={form.phone}
                          onChange={(v) => set("phone", v)}
                          placeholder='+91 9876543210'
                          icon={<Phone className='h-4 w-4' />}
                        />
                        <Field
                          label='Date of Birth'
                          value={form.dob}
                          onChange={(v) => set("dob", v)}
                          type='date'
                          icon={<Calendar className='h-4 w-4' />}
                        />
                        <SelectField
                          label='Gender'
                          value={form.gender}
                          onChange={(v) => set("gender", v)}
                          options={GENDER_OPTIONS}
                          placeholder='Select gender'
                          icon={<User className='h-4 w-4' />}
                        />
                        <SelectField
                          label='Blood Group'
                          value={form.bloodGrp}
                          onChange={(v) => set("bloodGrp", v)}
                          options={BLOOD_GROUP_OPTIONS}
                          placeholder='Select blood group'
                          icon={<Droplets className='h-4 w-4' />}
                        />
                      </div>
                    </Section>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB: EMERGENCY ── */}
            {activeTab === "emergency" && (
              <div>
                <div className='flex items-center gap-3 border-b border-slate-100 px-6 py-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-200'>
                    <Siren className='h-4 w-4' />
                  </div>
                  <div>
                    <h2 className='prof-font text-sm font-extrabold text-slate-900'>
                      Emergency Contact
                    </h2>
                    <p className='text-xs text-slate-400'>Who to call in case of emergency</p>
                  </div>
                </div>

                <div className='p-6'>
                  {!editing ? (
                    <>
                      {/* Contact card */}
                      {user?.emergencyContact?.name ? (
                        <div className='mb-4 overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/40'>
                          <div className='flex items-center gap-3 border-b border-rose-100/60 px-4 py-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600'>
                              <Shield className='h-4 w-4' />
                            </div>
                            <div>
                              <p className='text-sm font-black text-slate-800'>
                                {user.emergencyContact.name}
                              </p>
                              <p className='text-xs text-rose-500 font-semibold'>
                                {capitalize(relation) || "Emergency Contact"}
                              </p>
                            </div>
                          </div>
                          <div className='grid grid-cols-1 gap-1 p-2 sm:grid-cols-2'>
                            <DataRow
                              icon={<Phone className='h-4 w-4' />}
                              label='Phone'
                              value={user.emergencyContact.phone}
                              accent='rose'
                            />
                            <DataRow
                              icon={<Heart className='h-4 w-4' />}
                              label='Relationship'
                              value={capitalize(relation)}
                              accent='rose'
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='rounded-2xl border border-slate-200 border-dashed bg-slate-50/60 p-8 text-center'>
                          <Siren className='mx-auto mb-2 h-8 w-8 text-slate-300' />
                          <p className='text-sm font-semibold text-slate-400'>
                            No emergency contact set
                          </p>
                          <p className='mt-0.5 text-xs text-slate-300'>
                            Add one by clicking Edit Profile above
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <Field
                        label='Contact Name'
                        value={form.emergencyContact.name}
                        onChange={(v) => set("emergencyContact.name", v)}
                        placeholder='Jane Doe'
                        icon={<User className='h-4 w-4' />}
                      />
                      <Field
                        label='Contact Phone'
                        value={form.emergencyContact.phone}
                        onChange={(v) => set("emergencyContact.phone", v)}
                        placeholder='+91 9876543210'
                        icon={<Phone className='h-4 w-4' />}
                      />
                      <div className='sm:col-span-2'>
                        <SelectField
                          label='Relationship'
                          value={form.emergencyContact.relation}
                          onChange={(v) => set("emergencyContact.relation", v)}
                          options={RELATION_OPTIONS}
                          placeholder='Select relationship'
                          icon={<Heart className='h-4 w-4' />}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB: MEDICAL ── */}
            {activeTab === "medical" && (
              <div>
                <div className='flex items-center gap-3 border-b border-slate-100 px-6 py-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200'>
                    <HeartPulse className='h-4 w-4' />
                  </div>
                  <div>
                    <h2 className='prof-font text-sm font-extrabold text-slate-900'>
                      Medical History
                    </h2>
                    <p className='text-xs text-slate-400'>Allergies, medications & conditions</p>
                  </div>
                </div>

                <div className='p-6 space-y-5'>
                  {!editing ? (
                    <>
                      {/* Quick badge summary */}
                      {hasMedical ? (
                        <div className='flex flex-wrap gap-2'>
                          {user.medicalHistory?.allergies && (
                            <MedicalBadge
                              text={`⚠ ${user.medicalHistory.allergies}`}
                              color='rose'
                            />
                          )}
                          {user.medicalHistory?.chronicConditions && (
                            <MedicalBadge
                              text={user.medicalHistory.chronicConditions}
                              color='amber'
                            />
                          )}
                          {user.medicalHistory?.currentMedications && (
                            <MedicalBadge
                              text={user.medicalHistory.currentMedications}
                              color='violet'
                            />
                          )}
                        </div>
                      ) : null}

                      <div className='space-y-1'>
                        <DataRow
                          icon={<AlertCircle className='h-4 w-4' />}
                          label='Allergies'
                          value={user.medicalHistory?.allergies}
                          accent='rose'
                        />
                        <DataRow
                          icon={<Pill className='h-4 w-4' />}
                          label='Current Medications'
                          value={user.medicalHistory?.currentMedications}
                          accent='violet'
                        />
                        <DataRow
                          icon={<Activity className='h-4 w-4' />}
                          label='Chronic Conditions'
                          value={user.medicalHistory?.chronicConditions}
                          accent='amber'
                        />
                      </div>

                      {!hasMedical && (
                        <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center'>
                          <HeartPulse className='mx-auto mb-2 h-8 w-8 text-slate-300' />
                          <p className='text-sm font-semibold text-slate-400'>
                            No medical history recorded
                          </p>
                          <p className='mt-0.5 text-xs text-slate-300'>
                            Add details by clicking Edit Profile above
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <Section title='Medical Details'>
                      <div className='grid grid-cols-1 gap-4'>
                        <TextAreaField
                          label='Known Allergies'
                          value={form.medicalHistory.allergies}
                          onChange={(v) => set("medicalHistory.allergies", v)}
                          placeholder='e.g., Penicillin, Peanuts, Dust…'
                          rows={2}
                        />
                        <TextAreaField
                          label='Current Medications'
                          value={form.medicalHistory.currentMedications}
                          onChange={(v) => set("medicalHistory.currentMedications", v)}
                          placeholder='e.g., Aspirin 75mg daily, Metformin 500mg…'
                          rows={2}
                        />
                        <TextAreaField
                          label='Chronic Conditions'
                          value={form.medicalHistory.chronicConditions}
                          onChange={(v) => set("medicalHistory.chronicConditions", v)}
                          placeholder='e.g., Type 2 Diabetes, Hypertension, Asthma…'
                          rows={2}
                        />
                      </div>
                    </Section>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Floating save bar ── */}
          {editing && (
            <div
              className='animate-slide-up sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/90 px-5 py-3 shadow-2xl shadow-blue-200/40 backdrop-blur-md'
              style={{ animationDelay: "120ms" }}
            >
              <p className='text-xs font-semibold text-slate-500'>
                Editing{" "}
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
