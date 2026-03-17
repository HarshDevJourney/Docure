import { getWithAuth } from './../service/httpService';
import { Doctor, DoctorFilters } from "@/lib/types";
import { create } from "zustand";

interface DashboardScheduleItem {
    _id: string;
    time: string;
    patient: string;
    profilePic: string | null;
    type: "video" | "audio";
    status: "Scheduled" | "Completed" | "Cancelled" | "Progress";
}

interface DashboardRecentPatient {
    _id: string;
    name: string;
    profilePic: string | null;
    reason: string;
    lastVisit: string;
}

interface WeekDailyItem {
    day: string;
    total: number;
    completed: number;
    cancelled: number;
    revenue: number;
}

export interface DoctorDashboard {
    stats: {
        todayTotal: number;
        todayDone: number;
        weekTotal: number;
        weekCompleted: number;
        weekCancelled: number;
        weekRevenue: number;
        pendingPayments: number;
        totalPatients: number;
        totalRevenue: number;
        totalCompleted: number;
        totalCancelled: number;
    };
    weekDaily: WeekDailyItem[];
    todaySchedule: DashboardScheduleItem[];
    recentPatients: DashboardRecentPatient[];
    pendingActions: {
        prescriptionsPending: number;
        unpaidConsultations: number;
        followUpsThisWeek: number;
    };
}

interface DoctorState {
    doctors : Doctor[],
    currentDoc : Doctor | null,
    dashboard : DoctorDashboard | null,
    error : string | null,
    loading : boolean,
    dashboardLoading : boolean,
    pagination : {
        page : number,
        limit : number,
        total : number
    },

    // action
    clearError: () => void,
    setCurrentDoctor : (doctor : Doctor) => void,

    // api action
    fetchDoctors : (filters : DoctorFilters) => Promise<void>,
    fetchDoctorByID : (id : string) => Promise<void>,
    fetchDashboard : () => Promise<void>,
}

export const useDoctorState = create<DoctorState>((set) => ({
    doctors : [],
    currentDoc : null,
    dashboard : null,
    loading : false,
    dashboardLoading : false,
    error : null,
    pagination : {
        page : 1,
        limit : 20,
        total : 0
    },

    clearError : () => set({ error : null }),
    setCurrentDoctor : (doctor) => set({ currentDoc : doctor }),

    fetchDoctors : async (filters = {}) => {
        set({ loading : true, error : null })
        try {
            const queryParam = new URLSearchParams()

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    queryParam.append(key, String(value));
                }
            })

            const response = await getWithAuth(`doctor/doc-list?${queryParam.toString()}`)

            set({
                doctors : response.data,
                pagination : {
                    page : response.meta?.page || 1,
                    limit : response.meta?.limit || 20,
                    total : response.meta?.total || 0
                }
            })
        }
        catch(error : unknown){
            set({ error : error instanceof Error ? error.message : "Failed to fetch doctors" })
        }
        finally {
            set({ loading : false, error : null })
        }
    },

    fetchDoctorByID : async (id : string) => {
        set({ loading : true, error : null })
        try{
            const response = await getWithAuth(`doctor/${id}`)
            set({ currentDoc : response.data })
        }
        catch(error : unknown){
            set({ error : error instanceof Error ? error.message : "Failed to fetch doctor" })
        }
        finally {
            set({ loading : false, error : null })
        }
    },

    fetchDashboard : async () => {
        set({ dashboardLoading : true, error : null })
        try {
            const response = await getWithAuth(`doctor/dashboard`)
            set({ dashboard : response.data })
        }
        catch(error : unknown){
            set({ error : error instanceof Error ? error.message : "Failed to fetch dashboard" })
        }
        finally {
            set({ dashboardLoading : false })
        }
    },
}))