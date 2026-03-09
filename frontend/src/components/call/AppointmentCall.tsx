import { Appointment } from "@/store/appointmentStore";
import React, { useCallback, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { toast } from "sonner";

interface AppointmentCallProps {
    appointment: Appointment;
    currentUser: {
        id: string;
        name: string;
        role: "patient" | "doctor";
    };
    joinConsultation: (appointmentID: string) => Promise<void>;
    onCallEnd: () => void;
}

const AppointmentCall = ({
    appointment,
    currentUser,
    joinConsultation,
    onCallEnd,
}: AppointmentCallProps) => {
    const zpRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isCompMountedRef = useRef(false);
    const initializationRef = useRef(false);

    const memorizedJoinConsultation = useCallback(
        async (appointmentID: string) => {
            await joinConsultation(appointmentID);
        },
        [joinConsultation],
    );

    const initializeCall = useCallback(
        async (container: HTMLDivElement) => {
            if (!isCompMountedRef.current || initializationRef.current || !zpRef.current) return;
            if (!container || !container.isConnected) return;

            try {
                initializationRef.current = true;
                const appID = process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID;
                const serverSecret = process.env.ZEGOCLOUD_SERVER_SECRET;

                if (!appID || !serverSecret) {
                    throw new Error("ZegoCloud app credentials are not configured");
                }

                const numericAppID = parseInt(appID);
                if (isNaN(numericAppID)) {
                    throw new Error("Invalid ZegoCloud app ID");
                }

                try {
                    await memorizedJoinConsultation(appointment?._id);
                } catch (err: any) {
                    console.error(err);
                }

                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    numericAppID,
                    serverSecret,
                    appointment?._id,
                    currentUser.id,
                    currentUser.name,
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zpRef.current = zp;

                const isVideoCall = appointment?.consultationType === "video";

                zp.joinRoom({
                    container: container,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall,
                    },
                    turnOnMicrophoneWhenJoining: true,
                    showMyMicrophoneToggleButton: true,
                    turnOnCameraWhenJoining: isVideoCall,
                    showMyCameraToggleButton: isVideoCall,
                    showScreenSharingButton: true,
                    showTextChat: true,
                    showUserList: true,
                    showUserName: true,
                    showRemoveUserButton: true,
                    showPinButton: false,
                    showAudioVideoSettingsButton: true,
                    showTurnOffRemoteCameraButton: true,
                    showTurnOffRemoteMicrophoneButton: true,
                    maxUsers: 3,
                    layout: "Auto",
                    showLayoutButton: true,
                    onJoinRoom: () => {
                        if (isCompMountedRef.current) {
                            console.log(
                                `Joined ${appointment.consultationType} call : ${appointment.zegocloudRoomID}`,
                            );
                            toast.success("Consultation Call Joined Successfully");
                        }
                    },
                    onLeaveRoom: () => {
                        if (isCompMountedRef.current) {
                            if (zpRef.current) {
                                try {
                                    zpRef.current.mutePublishStreamAudio(true);
                                    zpRef.current.mutePublishStreamVideo(true);
                                } catch (err) {
                                    console.warn("Error turning off camera/Microphone");
                                }
                            }
                        }
                    },
                    onUserJoin: (users: any[]) => {
                        if (isCompMountedRef.current) {
                            console.log("User joined:", users);
                            toast.success("Participant joined the consultation");
                        }
                    },
                    onUserLeave: (users) => {
                        if (isCompMountedRef.current) {
                            console.log("User left:", users);
                            toast.info("Participant left the consultation");
                        }
                    },
                    showLeavingView: true,
                    onReturnToHomeScreenClicked: () => {
                        if (zpRef.current) {
                            try {
                                zpRef.current.mutePublishStreamAudio(true);
                                zpRef.current.mutePublishStreamVideo(true);
                            } catch (err) {
                                console.warn("Error turning off camera/Microphone");
                            }
                        }
                        onCallEnd();
                    },
                });
            } catch (err: any) {
                console.error("failed to join consultation", err);
                initializationRef.current = false;
                if (isCompMountedRef.current) {
                    zpRef.current = null;
                    onCallEnd();
                }
            }
        },
        [
            appointment?._id,
            appointment?.zegocloudRoomID,
            appointment?.consultationType,
            currentUser.id,
            currentUser.name,
            onCallEnd,
            memorizedJoinConsultation,
        ],
    );

    useEffect(() => {
        if (
            containerRef.current &&
            !initializationRef.current &&
            currentUser.id &&
            currentUser.name
        ) {
            isCompMountedRef.current = true;
            initializeCall(containerRef.current);
        }
        return () => {
            isCompMountedRef.current = false;
            if (zpRef.current) {
                try {
                    zpRef.current.destroy();
                } catch (err) {
                    console.warn("Error during cleanup", err);
                } finally {
                    zpRef.current = null;
                }
            }
        };
    }, [currentUser.id, currentUser.name, initializeCall]);

    const isVideoCall = appointment?.consultationType === "video";

    return (
        <div className='flex flex-col h-screen bg-[#0c1222] overflow-hidden'>
            {/* ── Top Header Bar ── */}
            <header className='flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0f1729] via-[#131c2e] to-[#0f1729] border-b border-blue-500/10 z-20 shrink-0 backdrop-blur-sm'>
                {/* Brand + call info */}
                <div className='flex items-center gap-4'>
                    {/* Logo mark — blue healthcare accent */}
                    <div className='relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 ring-1 ring-blue-400/20'>
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                        </svg>
                        <span className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-[#0c1222] animate-pulse shadow-sm shadow-blue-400/50' />
                    </div>

                    <div>
                        <p className='text-sm font-semibold text-slate-100 leading-tight tracking-tight'>
                            {isVideoCall ? "Video Consultation" : "Audio Consultation"}
                        </p>
                        <p className='text-[11px] text-slate-400 leading-tight mt-0.5 flex items-center gap-1.5'>
                            <span className='relative flex h-2 w-2'>
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
                                <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500' />
                            </span>
                            Session in progress
                        </p>
                    </div>
                </div>

                {/* Right — user info + end call */}
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50'>
                        <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0'>
                            {currentUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className='text-xs text-slate-200 font-medium hidden sm:block'>
                            {currentUser.name}
                        </span>
                        <span className='text-[10px] text-blue-400 capitalize font-medium'>
                            · {currentUser.role}
                        </span>
                    </div>

                    <button
                        onClick={onCallEnd}
                        className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-900/40 transition-all duration-200 border border-rose-500/30 hover:border-rose-400/40'
                    >
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z' />
                        </svg>
                        End Call
                    </button>
                </div>
            </header>

            {/* ── Main Content ── */}
            <div className='flex flex-1 overflow-hidden'>
                {/* ── Left Sidebar ── */}
                <aside className='w-72 bg-[#0f1729]/95 border-r border-blue-500/10 flex flex-col shrink-0 overflow-y-auto backdrop-blur-sm'>
                    {/* Participant section */}
                    <div className='px-4 pt-6 pb-4'>
                        <p className='text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 mb-4'>
                            Participants
                        </p>

                        <div className='flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-500/10 border border-blue-500/25 mb-3'>
                            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md shadow-blue-500/20'>
                                {currentUser.role === "doctor"
                                    ? currentUser.name?.charAt(0).toUpperCase()
                                    : "D"}
                            </div>
                            <div className='min-w-0 flex-1'>
                                <p className='text-sm font-semibold text-slate-100 truncate'>
                                    {currentUser.role === "doctor"
                                        ? `Dr. ${currentUser.name}`
                                        : "Doctor"}
                                </p>
                                <p className='text-[11px] text-blue-400'>Physician · Host</p>
                            </div>
                            <span className='relative flex h-2.5 w-2.5 shrink-0'>
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
                                <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500' />
                            </span>
                        </div>

                        <div className='flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 mb-3'>
                            <div className='w-9 h-9 rounded-xl bg-slate-600 flex items-center justify-center text-sm font-bold text-white shrink-0'>
                                {currentUser.role === "patient"
                                    ? currentUser.name?.charAt(0).toUpperCase()
                                    : "P"}
                            </div>
                            <div className='min-w-0 flex-1'>
                                <p className='text-sm font-semibold text-slate-200 truncate'>
                                    {currentUser.role === "patient" ? currentUser.name : "Patient"}
                                </p>
                                <p className='text-[11px] text-slate-400'>Patient</p>
                            </div>
                            <span className='relative flex h-2.5 w-2.5 shrink-0'>
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
                                <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500' />
                            </span>
                        </div>
                    </div>

                    <div className='mx-4 h-px bg-slate-700/60' />

                    {/* Session Details */}
                    <div className='px-4 pt-5 pb-4'>
                        <p className='text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 mb-4'>
                            Session Details
                        </p>

                        <div className='space-y-3'>
                            <div className='flex items-center justify-between py-2 px-3 rounded-xl bg-slate-800/30'>
                                <span className='text-xs text-slate-400 flex items-center gap-2'>
                                    <svg
                                        width='12'
                                        height='12'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        className='text-blue-500/80'
                                    >
                                        <circle cx='12' cy='12' r='10' />
                                        <polyline points='12 6 12 12 16 14' />
                                    </svg>
                                    Type
                                </span>
                                <span className='text-xs font-semibold text-slate-100 flex items-center gap-1.5'>
                                    {isVideoCall ? (
                                        <>
                                            <svg
                                                width='12'
                                                height='12'
                                                viewBox='0 0 24 24'
                                                fill='currentColor'
                                                className='text-blue-400'
                                            >
                                                <path d='M23 7l-7 5 7 5V7z' />
                                                <rect
                                                    x='1'
                                                    y='5'
                                                    width='15'
                                                    height='14'
                                                    rx='2'
                                                    ry='2'
                                                />
                                            </svg>{" "}
                                            Video
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                width='12'
                                                height='12'
                                                viewBox='0 0 24 24'
                                                fill='currentColor'
                                                className='text-blue-400'
                                            >
                                                <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
                                                <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
                                            </svg>{" "}
                                            Audio
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className='flex items-center justify-between py-2 px-3 rounded-xl bg-slate-800/30'>
                                <span className='text-xs text-slate-400 flex items-center gap-2'>
                                    <svg
                                        width='12'
                                        height='12'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        className='text-blue-500/80'
                                    >
                                        <rect x='3' y='11' width='18' height='11' rx='2' />
                                        <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                                    </svg>
                                    Room
                                </span>
                                <span className='text-xs font-mono text-blue-300/90'>
                                    {appointment?.zegocloudRoomID?.slice(0, 10) ?? "—"}
                                </span>
                            </div>

                            <div className='flex items-center justify-between py-2 px-3 rounded-xl bg-slate-800/30'>
                                <span className='text-xs text-slate-400 flex items-center gap-2'>
                                    <svg
                                        width='12'
                                        height='12'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        className='text-blue-500/80'
                                    >
                                        <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                                        <circle cx='9' cy='7' r='4' />
                                        <path d='M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                                    </svg>
                                    Max Users
                                </span>
                                <span className='text-xs font-semibold text-slate-100'>3</span>
                            </div>

                            <div className='flex items-center justify-between py-2 px-3 rounded-xl bg-blue-500/10 border border-blue-500/20'>
                                <span className='text-xs text-slate-400 flex items-center gap-2'>
                                    <svg
                                        width='12'
                                        height='12'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        className='text-blue-500/80'
                                    >
                                        <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
                                    </svg>
                                    Status
                                </span>
                                <span className='flex items-center gap-1.5 text-xs font-semibold text-blue-400'>
                                    <span className='relative flex h-2 w-2'>
                                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
                                        <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500' />
                                    </span>
                                    Live
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='mx-4 h-px bg-slate-700/60' />

                    {/* Quick controls hint */}
                    <div className='px-4 pt-5 pb-4'>
                        <p className='text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 mb-4'>
                            Controls
                        </p>
                        <div className='space-y-2.5'>
                            {[
                                {
                                    icon: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2",
                                    label: "Microphone",
                                    status: "On",
                                },
                                {
                                    icon: "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1z",
                                    label: "Camera",
                                    status: isVideoCall ? "On" : "Off",
                                },
                                {
                                    icon: "M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3",
                                    label: "Chat",
                                    status: "Available",
                                },
                            ].map(({ icon, label, status }) => (
                                <div
                                    key={label}
                                    className='flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-800/30 border border-slate-700/30'
                                >
                                    <div className='flex items-center gap-2.5'>
                                        <svg
                                            width='12'
                                            height='12'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            stroke='currentColor'
                                            strokeWidth='2'
                                            className='text-blue-400'
                                        >
                                            <path d={icon} />
                                        </svg>
                                        <span className='text-xs text-slate-300'>{label}</span>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold ${status === "Off" ? "text-slate-500" : "text-blue-400"}`}
                                    >
                                        {status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom tip */}
                    <div className='mt-auto mx-4 mb-5 p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-500/10 border border-blue-500/25'>
                        <div className='flex gap-3 items-start'>
                            <svg
                                width='14'
                                height='14'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                className='text-blue-400 shrink-0 mt-0.5'
                            >
                                <circle cx='12' cy='12' r='10' />
                                <line x1='12' y1='8' x2='12' y2='12' />
                                <line x1='12' y1='16' x2='12.01' y2='16' />
                            </svg>
                            <p className='text-[11px] text-slate-300 leading-relaxed'>
                                {isVideoCall
                                    ? "Good lighting and a quiet space improve your consultation."
                                    : "Headphones reduce echo and improve audio clarity."}
                            </p>
                        </div>
                    </div>
                </aside>

                {/* ── Video Stage ── */}
                <div className='relative flex-1 bg-[#0c1222] overflow-hidden'>
                    {/* Radial gradient ambient */}
                    <div className='absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(59,130,246,0.06),transparent)]' />

                    {/* Subtle grid texture overlay */}
                    <div
                        className='absolute inset-0 opacity-[0.04] pointer-events-none z-0'
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* Connecting / idle placeholder */}
                    <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 pointer-events-none'>
                        <div className='relative flex items-center justify-center'>
                            <span className='absolute w-40 h-40 rounded-full border border-blue-500/30 animate-ping [animation-duration:3s]' />
                            <span className='absolute w-28 h-28 rounded-full border border-blue-500/45 animate-ping [animation-duration:2.2s] [animation-delay:0.2s]' />
                            <span className='absolute w-20 h-20 rounded-full border border-blue-500/70 animate-ping [animation-duration:1.8s] [animation-delay:0.4s]' />

                            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/25 to-blue-500/20 border border-blue-500/30 flex items-center justify-center backdrop-blur-sm shadow-xl shadow-blue-500/10'>
                                {isVideoCall ? (
                                    <svg
                                        width='26'
                                        height='26'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        className='text-blue-400'
                                    >
                                        <path d='M23 7l-7 5 7 5V7z' />
                                        <rect x='1' y='5' width='15' height='14' rx='2' ry='2' />
                                    </svg>
                                ) : (
                                    <svg
                                        width='26'
                                        height='26'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='1.5'
                                        className='text-blue-400'
                                    >
                                        <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' />
                                        <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
                                        <line x1='12' y1='19' x2='12' y2='23' />
                                        <line x1='8' y1='23' x2='16' y2='23' />
                                    </svg>
                                )}
                            </div>
                        </div>

                        <div className='text-center'>
                            <p className='text-slate-100 text-lg font-semibold tracking-tight'>
                                Initialising session…
                            </p>
                            <p className='text-slate-500 text-sm mt-1.5'>Connecting you securely</p>
                        </div>

                        <div className='flex gap-2'>
                            {[0, 1, 2, 3].map((i) => (
                                <span
                                    key={i}
                                    className='w-2 h-2 rounded-full bg-blue-500 animate-bounce'
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                    </div>

                    <div ref={containerRef} className='absolute inset-0 z-20 w-full h-full' />
                </div>
            </div>

            {/* ── Bottom Status Bar ── */}
            <div className='flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#0f1729] via-[#131c2e] to-[#0f1729] border-t border-blue-500/10 shrink-0'>
                <div className='flex items-center gap-4'>
                    <span className='flex items-center gap-2 text-[11px] text-slate-400'>
                        <span className='relative flex h-2 w-2'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
                            <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500' />
                        </span>
                        Encrypted & Secure
                    </span>
                    <span className='text-slate-600 text-xs'>·</span>
                    <span className='text-[11px] text-slate-500'>Docure Telehealth Platform</span>
                </div>
                <div className='flex items-center gap-2 text-[11px] text-slate-500'>
                    <svg
                        width='11'
                        height='11'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        className='text-blue-500/70'
                    >
                        <rect x='3' y='11' width='18' height='11' rx='2' />
                        <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                    </svg>
                    End-to-end encrypted
                </div>
            </div>
        </div>
    );
};

export default AppointmentCall;
