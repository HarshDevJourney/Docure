"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import {
  CreditCard,
  Building2,
  User,
  FileText,
  ChevronRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Pen,
  X,
  Save,
  Smartphone,
  IndianRupee,
  Lock,
  Wallet,
  BadgeCheck,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

/* ─── ICONS ────────────────────────────────────────────────────────────────── */
const BankIcon = ({ className }: { className?: string }) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <rect x='3' y='10' width='18' height='10' rx='2' />
    <path d='M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4' />
    <path d='M12 2v4' />
    <line x1='7' y1='14' x2='7' y2='16' />
    <line x1='12' y1='14' x2='12' y2='16' />
    <line x1='17' y1='14' x2='17' y2='16' />
  </svg>
);

const UPIIcon = ({ className }: { className?: string }) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <rect x='2' y='5' width='20' height='14' rx='2' />
    <path d='M12 12h.01' />
    <path d='M17 12h.01' />
    <path d='M7 12h.01' />
  </svg>
);

/* ─── FORM INTERFACE ───────────────────────────────────────────────────────── */
interface PaymentForm {
  panNumber: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

/* ─── INPUT BASE ───────────────────────────────────────────────────────────── */
const inputBase =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-sm disabled:bg-slate-50 disabled:text-slate-500";

/* ─── FIELD COMPONENT ──────────────────────────────────────────────────────── */
const Field = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  disabled,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: string;
  hint?: string;
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
        disabled={disabled}
        className={`${inputBase} ${icon ? "pl-11" : ""}`}
      />
    </div>
    {hint && <p className='text-[10px] text-slate-400 mt-1'>{hint}</p>}
  </div>
);

/* ─── BANK CARD COMPONENT ──────────────────────────────────────────────────── */
const BankCard = ({
  bankName,
  accountNumber,
  accountHolderName,
  ifscCode,
  isComplete,
}: {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  isComplete: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const maskAccountNumber = (num?: string) => {
    if (!num || num.length < 4) return "•••• •••• •••• ••••";
    return "•••• •••• •••• " + num.slice(-4);
  };

  const copyToClipboard = () => {
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className='relative overflow-hidden rounded-3xl p-6 sm:p-8 min-h-[220px] shadow-2xl shadow-blue-900/40'
      style={{
        background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #3b82f6 75%, #1e40af 100%)",
      }}
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <svg className='w-full h-full' viewBox='0 0 400 300'>
          <defs>
            <pattern id='circles' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'>
              <circle cx='20' cy='20' r='1.5' fill='white' />
            </pattern>
          </defs>
          <rect width='400' height='300' fill='url(#circles)' />
        </svg>
      </div>

      {/* Gradient Orbs */}
      <div className='absolute -top-20 -right-20 w-40 h-40 bg-white/15 rounded-full blur-3xl' />
      <div className='absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl' />

      {/* Card Content */}
      <div className='relative z-10 h-full flex flex-col justify-between'>
        {/* Top Row */}
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200 mb-1'>
              Bank Account
            </p>
            <p
              className='text-lg font-bold text-white'
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {bankName || "Add Bank Details"}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            {isComplete && (
              <div className='flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1'>
                <CheckCircle2 size={12} className='text-emerald-400' />
                <span className='text-[10px] font-bold text-emerald-400'>Verified</span>
              </div>
            )}
            <div className='w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center'>
              <Building2 className='text-white/80' size={20} />
            </div>
          </div>
        </div>

        {/* Account Number */}
        <div className='mt-6'>
          <p className='text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-2'>
            Account Number
          </p>
          <div className='flex items-center gap-3'>
            <p
              className='text-2xl sm:text-3xl font-bold text-white tracking-[0.15em]'
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {maskAccountNumber(accountNumber)}
            </p>
            {accountNumber && (
              <button
                onClick={copyToClipboard}
                className='w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all'
              >
                {copied ? (
                  <Check size={14} className='text-emerald-400' />
                ) : (
                  <Copy size={14} className='text-white/60' />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className='mt-6 flex items-end justify-between'>
          <div>
            <p className='text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1'>
              Account Holder
            </p>
            <p className='text-sm font-bold text-white uppercase tracking-wide'>
              {accountHolderName || "Your Name"}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1'>
              IFSC Code
            </p>
            <p
              className='text-sm font-bold text-white/80 tracking-wider'
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {ifscCode || "••••••••••"}
            </p>
          </div>
        </div>
      </div>

      {/* Card Chip Design */}
      <div className='absolute top-6 right-6 sm:top-8 sm:right-8'>
        <div className='w-12 h-9 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 opacity-80'>
          <div className='w-full h-full grid grid-cols-3 gap-[1px] p-1'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='bg-amber-600/30 rounded-[1px]' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── UPI CARD COMPONENT ───────────────────────────────────────────────────── */
const UPICard = ({ upiId, isComplete }: { upiId?: string; isComplete: boolean }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (upiId) {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className='relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-xl shadow-emerald-500/20'>
      <div className='absolute inset-0 opacity-10'>
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          <defs>
            <pattern id='waves' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'>
              <path d='M0 10 Q5 5 10 10 T20 10' fill='none' stroke='white' strokeWidth='0.5' />
            </pattern>
          </defs>
          <rect width='100' height='100' fill='url(#waves)' />
        </svg>
      </div>

      <div className='relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center'>
              <Smartphone className='text-white' size={16} />
            </div>
            <span className='text-sm font-bold text-white'>UPI</span>
          </div>
          {isComplete && (
            <div className='flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5'>
              <CheckCircle2 size={10} className='text-white' />
              <span className='text-[9px] font-bold text-white'>Active</span>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <p className='text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-200 mb-1'>
              UPI ID
            </p>
            <p className='text-lg font-bold text-white'>{upiId || "Not configured"}</p>
          </div>
          {upiId && (
            <button
              onClick={copyToClipboard}
              className='w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all'
            >
              {copied ? (
                <Check size={16} className='text-white' />
              ) : (
                <Copy size={16} className='text-white/80' />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── PAN CARD COMPONENT ───────────────────────────────────────────────────── */
const PANCard = ({ panNumber, isComplete }: { panNumber?: string; isComplete: boolean }) => {
  const maskPAN = (pan?: string) => {
    if (!pan || pan.length < 4) return "••••••••••";
    return pan.slice(0, 2) + "••••••" + pan.slice(-2);
  };

  return (
    <div className='relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 shadow-xl shadow-violet-500/20'>
      <div className='absolute inset-0 opacity-10'>
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          <defs>
            <pattern id='grid' x='0' y='0' width='10' height='10' patternUnits='userSpaceOnUse'>
              <rect width='10' height='10' fill='none' stroke='white' strokeWidth='0.3' />
            </pattern>
          </defs>
          <rect width='100' height='100' fill='url(#grid)' />
        </svg>
      </div>

      <div className='relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center'>
              <FileText className='text-white' size={16} />
            </div>
            <span className='text-sm font-bold text-white'>PAN Card</span>
          </div>
          {isComplete && (
            <div className='flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5'>
              <CheckCircle2 size={10} className='text-white' />
              <span className='text-[9px] font-bold text-white'>Verified</span>
            </div>
          )}
        </div>

        <div>
          <p className='text-[9px] font-bold uppercase tracking-[0.15em] text-violet-200 mb-1'>
            PAN Number
          </p>
          <p
            className='text-xl font-bold text-white tracking-[0.2em]'
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {maskPAN(panNumber)}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ───────────────────────────────────────────────────────── */
const PaymentDetailsPage: React.FC = () => {
  const router = useRouter();
  const { user, updateProfile } = userAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const emptyForm: PaymentForm = {
    panNumber: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  };

  const getFormFromUser = (): PaymentForm => ({
    panNumber: user?.paymentDetails?.panNumber || "",
    accountHolderName: user?.paymentDetails?.bank?.accountHolderName || "",
    bankName: user?.paymentDetails?.bank?.bankName || "",
    accountNumber: user?.paymentDetails?.bank?.accountNumber || "",
    ifscCode: user?.paymentDetails?.bank?.ifscCode || "",
    upiId: user?.paymentDetails?.bank?.upiId || "",
  });

  const [form, setForm] = useState<PaymentForm>(emptyForm);

  useEffect(() => {
    setForm(getFormFromUser());
    setTimeout(() => setAnimateIn(true), 100);
  }, [user]);

  const updateField = <K extends keyof PaymentForm>(key: K, value: PaymentForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        paymentDetails: {
          panNumber: form.panNumber.toUpperCase(),
          bank: {
            accountHolderName: form.accountHolderName,
            bankName: form.bankName,
            accountNumber: form.accountNumber,
            ifscCode: form.ifscCode.toUpperCase(),
            upiId: form.upiId,
          },
        },
      });
      toast.success("Payment details updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update payment details");
    } finally {
      setSaving(false);
    }
  };

  /* ── FIX: Always reset to saved user data (or blank if none) ── */
  const handleCancel = () => {
    setForm(getFormFromUser());
    setIsEditing(false);
  };

  const isPanComplete = !!form.panNumber;
  const isBankComplete =
    !!form.accountHolderName && !!form.bankName && !!form.accountNumber && !!form.ifscCode;
  const isUpiComplete = !!form.upiId;
  const isFullyComplete = isPanComplete && isBankComplete;

  const completionPercent =
    ([isPanComplete, isBankComplete, isUpiComplete].filter(Boolean).length / 3) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-6px) rotate(0.3deg); }
          66%  { transform: translateY(-3px) rotate(-0.2deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          70%  { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: var(--target-width); }
        }

        .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
        .animate-card-float { animation: cardFloat 7s ease-in-out infinite; }
        .animate-slideDown { animation: slideDown 0.35s cubic-bezier(0.22,1,0.36,1) both; }

        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.12s; }
        .stagger-3 { animation-delay: 0.19s; }
        .stagger-4 { animation-delay: 0.26s; }
        .stagger-5 { animation-delay: 0.33s; }
        .stagger-6 { animation-delay: 0.40s; }

        .shimmer-text {
          background: linear-gradient(90deg, #1e293b 30%, #3b82f6 50%, #1e293b 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .glass-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .progress-bar {
          animation: progressFill 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s both;
        }

        .input-field {
          height: 48px;
          width: 100%;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: #cbd5e1; }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
          background: #f8faff;
        }
        .input-field:disabled {
          background: #f8fafc;
          color: #94a3b8;
          cursor: not-allowed;
        }
        .input-with-icon { padding-left: 44px; }

        .section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 8px 0;
        }
        .section-divider::before,
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: repeating-linear-gradient(90deg, #e2e8f0 0, #e2e8f0 4px, transparent 4px, transparent 8px);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(59,130,246,0.35);
          transition: all 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.45);
          background: linear-gradient(135deg, #1e40af, #2563eb);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-success {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16,185,129,0.35);
          transition: all 0.2s;
        }
        .btn-success:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16,185,129,0.45);
        }
        .btn-success:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          background: #f1f5f9;
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover {
          background: #e2e8f0;
          color: #1e293b;
          border-color: #cbd5e1;
        }

        .quick-link-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          transition: background 0.2s;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .quick-link-row:hover { background: #f8faff; }
        .quick-link-row:hover .link-chevron { transform: translateX(3px); color: #3b82f6; }
        .link-chevron { transition: transform 0.2s, color 0.2s; color: #cbd5e1; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #f0f4ff 0%, #f8fafc 40%, #f0fdf4 100%)",
          padding: "32px 16px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Decorative background blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: 500,
              height: 500,
              background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "-8%",
              width: 400,
              height: 400,
              background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* ── HEADER ── */}
          <div
            className={animateIn ? "animate-fadeUp stagger-1" : ""}
            style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}
          >
            <button
              onClick={() => router.push("/doctor/profile")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.9)",
                border: "1.5px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                cursor: "pointer",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                transition: "all 0.2s",
                flexShrink: 0,
                marginTop: 6,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b82f6";
                (e.currentTarget as HTMLButtonElement).style.color = "#3b82f6";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 12px rgba(59,130,246,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
                (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 1px 6px rgba(0,0,0,0.06)";
              }}
            >
              <ArrowLeft size={18} />
            </button>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: 999,
                  marginBottom: 8,
                  boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                }}
              >
                <Sparkles size={11} />
                Payment Settings
              </div>
              <h1
                className='shimmer-text'
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(26px, 4vw, 36px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  margin: "0 0 6px",
                  letterSpacing: "-0.01em",
                }}
              >
                Payment Details
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                Manage your banking & tax information to receive payouts
              </p>
            </div>

            {/* ── HEADER ACTION BUTTONS ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
                marginTop: 6,
              }}
            >
              {!isEditing ? (
                <button className='btn-primary' onClick={() => setIsEditing(true)}>
                  <Pen size={15} />
                  Edit Details
                </button>
              ) : (
                <>
                  <button className='btn-ghost' onClick={handleCancel}>
                    <X size={15} />
                    Cancel
                  </button>
                  <button className='btn-success' onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      <Save size={15} />
                    )}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── PROGRESS / STATUS BANNER ── */}
          <div
            className={animateIn ? "animate-fadeUp stagger-2" : ""}
            style={{
              borderRadius: 20,
              padding: "20px 24px",
              marginBottom: 24,
              background: isFullyComplete
                ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                : "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border: `1.5px solid ${isFullyComplete ? "#86efac" : "#fcd34d"}`,
              boxShadow: isFullyComplete
                ? "0 4px 20px rgba(16,185,129,0.1)"
                : "0 4px 20px rgba(245,158,11,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  flexShrink: 0,
                  background: isFullyComplete
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isFullyComplete
                    ? "0 4px 14px rgba(16,185,129,0.35)"
                    : "0 4px 14px rgba(245,158,11,0.35)",
                }}
              >
                {isFullyComplete ? (
                  <BadgeCheck className='text-white' size={26} />
                ) : (
                  <AlertCircle className='text-white' size={26} />
                )}
              </div>

              {/* Text + progress */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 17,
                    fontWeight: 400,
                    color: isFullyComplete ? "#065f46" : "#78350f",
                    margin: "0 0 2px",
                  }}
                >
                  {isFullyComplete ? "Payment Setup Complete!" : "Complete Your Payment Setup"}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: isFullyComplete ? "#059669" : "#b45309",
                    margin: "0 0 10px",
                  }}
                >
                  {isFullyComplete
                    ? "You're all set to receive consultation payouts every Monday"
                    : "Add your bank details to start receiving payments"}
                </p>
                {/* Progress bar */}
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: isFullyComplete ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className='progress-bar'
                    style={
                      {
                        height: "100%",
                        borderRadius: 999,
                        background: isFullyComplete
                          ? "linear-gradient(90deg, #10b981, #34d399)"
                          : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                        "--target-width": `${completionPercent}%`,
                        width: `${completionPercent}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>

              {/* Status pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "PAN", complete: isPanComplete, color: "#7c3aed" },
                  { label: "Bank", complete: isBankComplete, color: "#1d4ed8" },
                  { label: "UPI", complete: isUpiComplete, color: "#059669" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: item.complete ? item.color : "#fff",
                      color: item.complete ? "#fff" : "#94a3b8",
                      border: `1.5px solid ${item.complete ? item.color : "#e2e8f0"}`,
                      boxShadow: item.complete ? `0 2px 8px ${item.color}40` : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    {item.complete ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          border: "2px solid #cbd5e1",
                        }}
                      />
                    )}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── VIEW MODE: CARDS ── */}
          {!isEditing && (
            <div className={animateIn ? "animate-fadeUp stagger-3" : ""}>
              {/* Bank card */}
              <div className='animate-card-float' style={{ marginBottom: 20 }}>
                <BankCard
                  bankName={form.bankName}
                  accountNumber={form.accountNumber}
                  accountHolderName={form.accountHolderName}
                  ifscCode={form.ifscCode}
                  isComplete={isBankComplete}
                />
              </div>

              {/* PAN + UPI */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div className='animate-card-float' style={{ animationDelay: "0.7s" }}>
                  <PANCard panNumber={form.panNumber} isComplete={isPanComplete} />
                </div>
                <div className='animate-card-float' style={{ animationDelay: "1.4s" }}>
                  <UPICard upiId={form.upiId} isComplete={isUpiComplete} />
                </div>
              </div>

              {/* Mobile edit button */}
              <button
                className='btn-primary'
                onClick={() => setIsEditing(true)}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: 24,
                  display: "flex",
                }}
              >
                <Pen size={16} />
                Edit Payment Details
              </button>
            </div>
          )}

          {/* ── EDIT FORM ── */}
          {isEditing && (
            <div
              className='animate-slideDown glass-card'
              style={{
                borderRadius: 24,
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                overflow: "hidden",
                marginBottom: 24,
              }}
            >
              {/* Form header bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 24px",
                  borderBottom: "1.5px solid #f1f5f9",
                  background: "linear-gradient(135deg, #f8faff, #f0f9ff)",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                  }}
                >
                  <CreditCard className='text-white' size={18} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 16,
                      margin: 0,
                      color: "#1e293b",
                    }}
                  >
                    Edit Payment Information
                  </p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    All changes are encrypted before saving
                  </p>
                </div>
              </div>

              <div style={{ padding: "28px 24px" }}>
                {/* ── BANK SECTION ── */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #1e293b, #334155)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Building2 className='text-white' size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                        Bank Account
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        Primary account for receiving payouts
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {/* Account Holder Name */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        Account Holder Name
                      </label>
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8",
                            pointerEvents: "none",
                          }}
                        >
                          <User size={15} />
                        </div>
                        <input
                          className='input-field input-with-icon'
                          value={form.accountHolderName}
                          onChange={(e) => updateField("accountHolderName", e.target.value)}
                          placeholder='As per bank records'
                        />
                      </div>
                    </div>

                    {/* Bank Name */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        Bank Name
                      </label>
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8",
                            pointerEvents: "none",
                          }}
                        >
                          <Building2 size={15} />
                        </div>
                        <input
                          className='input-field input-with-icon'
                          value={form.bankName}
                          onChange={(e) => updateField("bankName", e.target.value)}
                          placeholder='e.g., State Bank of India'
                        />
                      </div>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        Account Number
                      </label>
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8",
                            pointerEvents: "none",
                          }}
                        >
                          <CreditCard size={15} />
                        </div>
                        <input
                          className='input-field input-with-icon'
                          value={form.accountNumber}
                          onChange={(e) => updateField("accountNumber", e.target.value)}
                          placeholder='Enter account number'
                        />
                      </div>
                    </div>

                    {/* IFSC */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#94a3b8",
                          marginBottom: 6,
                        }}
                      >
                        IFSC Code
                      </label>
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8",
                            pointerEvents: "none",
                          }}
                        >
                          <BankIcon />
                        </div>
                        <input
                          className='input-field input-with-icon'
                          value={form.ifscCode}
                          onChange={(e) => updateField("ifscCode", e.target.value.toUpperCase())}
                          placeholder='e.g., SBIN0001234'
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: "0.05em",
                          }}
                        />
                      </div>
                      <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                        11-character bank branch code
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className='section-divider'>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#cbd5e1",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tax Info
                  </span>
                </div>

                {/* ── PAN SECTION ── */}
                <div style={{ margin: "24px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FileText className='text-white' size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                        PAN Card
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        Required for TDS deduction compliance
                      </p>
                    </div>
                  </div>
                  <div style={{ maxWidth: 340 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#94a3b8",
                        marginBottom: 6,
                      }}
                    >
                      PAN Number
                    </label>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#94a3b8",
                          pointerEvents: "none",
                        }}
                      >
                        <FileText size={15} />
                      </div>
                      <input
                        className='input-field input-with-icon'
                        value={form.panNumber}
                        onChange={(e) => updateField("panNumber", e.target.value.toUpperCase())}
                        placeholder='ABCDE1234F'
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.08em",
                        }}
                      />
                    </div>
                    <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                      10-character alphanumeric PAN
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className='section-divider'>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#cbd5e1",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    UPI (Optional)
                  </span>
                </div>

                {/* ── UPI SECTION ── */}
                <div style={{ margin: "24px 0 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #059669, #10b981)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Smartphone className='text-white' size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                        UPI ID
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        Optional — for instant payment requests
                      </p>
                    </div>
                  </div>
                  <div style={{ maxWidth: 340 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#94a3b8",
                        marginBottom: 6,
                      }}
                    >
                      UPI ID
                    </label>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#94a3b8",
                          pointerEvents: "none",
                        }}
                      >
                        <UPIIcon />
                      </div>
                      <input
                        className='input-field input-with-icon'
                        value={form.upiId}
                        onChange={(e) => updateField("upiId", e.target.value)}
                        placeholder='yourname@upi'
                      />
                    </div>
                    <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                      Your registered UPI handle
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile save/cancel footer */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "16px 24px",
                  borderTop: "1.5px solid #f1f5f9",
                  background: "#fafbfc",
                }}
              >
                <button
                  className='btn-ghost'
                  onClick={handleCancel}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  <X size={15} />
                  Cancel
                </button>
                <button
                  className='btn-success'
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  {saving ? (
                    <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ── INFO CARDS ── */}
          <div
            className={animateIn ? "animate-fadeUp stagger-4" : ""}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              className='glass-card'
              style={{
                borderRadius: 18,
                border: "1.5px solid #e2e8f0",
                padding: "18px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 6px 24px rgba(59,130,246,0.1)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                }}
              >
                <Shield className='text-white' size={20} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>
                  Bank-Grade Security
                </p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                  Your data is encrypted with 256-bit SSL and stored with zero-access architecture.
                </p>
              </div>
            </div>

            <div
              className='glass-card'
              style={{
                borderRadius: 18,
                border: "1.5px solid #e2e8f0",
                padding: "18px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 6px 24px rgba(16,185,129,0.1)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                }}
              >
                <IndianRupee className='text-white' size={20} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>
                  Weekly Payouts
                </p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                  Earnings are settled every Monday. Minimum payout threshold is ₹500.
                </p>
              </div>
            </div>
          </div>

          {/* ── QUICK LINKS ── */}
          <div
            className={`glass-card ${animateIn ? "animate-fadeUp stagger-5" : ""}`}
            style={{
              borderRadius: 18,
              border: "1.5px solid #e2e8f0",
              overflow: "hidden",
              marginBottom: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                borderBottom: "1.5px solid #f1f5f9",
                background: "#fafbfc",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Quick Actions
              </span>
            </div>

            <button
              className='quick-link-row'
              onClick={() => router.push("/doctor/dashboard")}
              style={{ borderBottom: "1px solid #f1f5f9" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                >
                  <Wallet size={18} style={{ color: "#3b82f6" }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0 }}>
                    View Earnings Dashboard
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                    Track your consultation revenue
                  </p>
                </div>
              </div>
              <ChevronRight size={17} className='link-chevron' />
            </button>

            <button className='quick-link-row' onClick={() => router.push("/doctor/profile")}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#f5f3ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={18} style={{ color: "#7c3aed" }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0 }}>
                    Profile Settings
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                    Update your professional information
                  </p>
                </div>
              </div>
              <ChevronRight size={17} className='link-chevron' />
            </button>
          </div>

          {/* ── FOOTER ── */}
          <div
            className={animateIn ? "animate-fadeUp stagger-6" : ""}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingBottom: 16,
            }}
          >
            <Lock size={11} style={{ color: "#cbd5e1" }} />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              End-to-end encrypted · Docure Telehealth Platform
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetailsPage;
