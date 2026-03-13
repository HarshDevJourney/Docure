import { getWithAuth, getWithoutAuth, postWithAuth, putWithAuth, putFileWithAuth, deleteWithAuth } from "@/service/httpService";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PaymentDetails {
  doctorFees: number;
  platformFees: number;
  totalFees: number;
  paymentStatus: "Pending" | "Paid" | "Refunded" | "Failed";
  paidAt?: string;
}

interface Prescription {
  fileUrl: string;
  fileType: "image" | "pdf";
  fileName?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Appointment {
  _id : string;

  patientID: any;
  doctorID: any;

  date: string;
  slotStart: string;
  slotEnd: string;

  consultationType: "video" | "audio";
  status: "Scheduled" | "Completed" | "Cancelled" | "Progress";

  symptoms: string;
  notes?: string;

  zegocloudRoomID: string;

  pescription?: Prescription;

  paymentDetails: PaymentDetails;

  payoutDetails: {
    payoutStatus: "Pending" | "Paid" | "Cancelled";
    payoutDate: string;
  };

  paymentExpiresAt?: string;
  isFollowUp : boolean;
  createdAt: string;
  updatedAt: string;
}


interface AppointmentFilters {
    status ?: string | string[]
    from ?: string
    to ?: string
    date ?: string
    sortBy ?: 'date' | 'createdAt' | 'status'
    sortOrder ?: 'asc' | 'desc'
}


interface BookingData {
    doctorID: unknown;
    date: string;
    slotStart: string;
    slotEnd: string;
    consultationType: "video" | "audio";
    symptoms: string;
    medicalHistory : string,
    paymentDetails: PaymentDetails,
    paymentExpiresAt : Date
}

interface Slot {
    slotStart : string | Date,
    slotEnd : string | Date
}

interface appointmentStore {
    appointments : Appointment[],
    bookedSlot : Slot[],
    currentAppointment : Appointment | null,
    loading : boolean,
    error : string | null,

    // action
    clearError : () => void,
    resetStore: () => void;
    setCurrentAppointment : (appointment : Appointment) => void,

    // api action
    fetchAppointment : (role : 'patient' | 'doctor', tab ?: string, filters ?: AppointmentFilters) => Promise<void>,
    fetchBookedSlot : (doctorID : string, date : string) => Promise<void>,
    fetchAppointmentByID : (appointmentID : string) => Promise<Appointment | null>,

    bookAppointment : (data : BookingData) => Promise<any>,
    cancelConsultation : (appointmentID : string) => Promise<void>,
    rescheduleAppointment?: (appointmentID: string, newSlotStart: string, newSlotEnd: string) => Promise<void>,

    joinConsultation : (appointmentID : string) => Promise<void>,
    endConsultation : (appointmentID : string, notes ?: string) => Promise<void>,

    updateAppointmentStatus : (appointmentID : string, status : "Scheduled" | "Completed" | "Cancelled" | "Progress") => Promise<void>,
    updatePrecription : (appointmentId : string, file : File) => Promise<void>,
    deletePrescription : (appointmentId : string) => Promise<void>,
    markAsFollowUp : (appointmentID : string) => Promise<void>,

}


export const useAppointmentStore = create<appointmentStore>((set, get) => ({
    appointments : [],
    bookedSlot : [],
    currentAppointment : null,
    loading : false,
    error : null,

    clearError : () => set({ error : null }),
    resetStore: () => set({
        appointments: [],
        bookedSlot: [],
        currentAppointment: null,
        loading: false,
        error: null
    }),

    setCurrentAppointment : (appointment) => set({ currentAppointment : appointment }),

    fetchAppointment : async(role, tab='', filters={}) => {
        set({ loading : true, error : null })

        try{
            const endPoint = `appointment/${role}`
            const queryParam = new URLSearchParams()

            if(tab == 'upcoming'){
                queryParam.append('status', 'Progress')
                queryParam.append('status', 'Scheduled')
            }
            else if(tab == 'past'){
                queryParam.append('status', 'Completed')
                queryParam.append('status', 'Cancelled')
            }

            Object.entries(filters).forEach(([key, value]) => {
                if(value !== null && value !== '' && value !== undefined && key !== 'status'){
                    if(Array.isArray(value)){
                        value.forEach((val) => queryParam.append(key, val.toString()))
                    }
                    else{
                        queryParam.append(key, value.toString())
                    }
                }
            })

            const res = await getWithAuth(`${endPoint}?${queryParam.toString()}`)
            set({ appointments : res.data || [] })
            toast.success("Appointment List Fetched Successfully");
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Fail to Fetch Appointment List");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    fetchAppointmentByID : async(appointmentID) => {
        set({ loading : true, error : null })

        try{
            const res = await getWithAuth(`appointment/details/${appointmentID}`)
            set({ currentAppointment : res?.data?.appointment })
            toast.success("Appointment Fetched Successfully");
            return res?.data?.appointment
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Fail to Fetch Required Appointment Details");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    fetchBookedSlot : async(doctorID, date) => {
        set({ loading : true, error : null })

        try{
            const res = await getWithAuth(`appointment/booked-slot/${doctorID}/${date}`)
            set({ bookedSlot : res?.data })
            toast.success("Booked Slot Details Fetched Successfully");
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Fail to Fetch Booked Slot Details");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    bookAppointment : async(data) => {
        set({ loading : true, error : null })

        try{
            const res = await postWithAuth(`appointment/book-slot`, data)
            set(state => ({
                appointments : [res.data, ...state.appointments]
            }))
            toast.success("Appointment Booked Successfully");
            return res.data
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Fail to Appointment Booked");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    cancelConsultation: async (appointmentID) => {
        set({ loading: true, error: null });

        try {
            await putWithAuth(`appointment/cancel/${appointmentID}`);
            set((state) => ({
                appointments: state.appointments.map((apt) =>
                    apt._id === appointmentID ? { ...apt, status: "Cancelled" } : apt
                ),
            }));
            toast.success("Appointment cancelled");
        }catch(err: any) {
            set({ error: err.message });
            toast.error("Cancel failed");
            throw err;
        }finally {
            set({ loading: false });
        }
    },

    joinConsultation : async(appointmentID) => {
        set({ loading : true, error : null })
        console.log(appointmentID)

        try{
            const res = await getWithAuth(`appointment/join/${appointmentID}`)
            console.log(res)
            set((state) => ({ 
                appointments : state.appointments.map(apt => apt._id === appointmentID ? {...apt, status : 'Progress' as const} : apt),
                currentAppointment : state.currentAppointment?._id === appointmentID ? {...state.currentAppointment, status : 'Progress' as const} : state.currentAppointment
            }))
            toast.success("Appointment Joined Successfully");
            return res.data
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Fail to Join Appointment");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    endConsultation : async(appointmentID, notes) => {
        set({ loading : true, error : null })

        try{
            const res = await putWithAuth(`appointment/end/${appointmentID}`, { notes })
            set((state) => ({ 
                appointments : state.appointments.map(apt => apt._id === appointmentID ? {...apt, status : 'Completed' as const} : apt),
                currentAppointment : state.currentAppointment?._id === appointmentID ? {...state.currentAppointment, status : 'Completed' as const} : state.currentAppointment
            }))
            toast.success("Appointment Ended Successfully");
            return res.data
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Fail to End Appointment");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    updateAppointmentStatus : async(appointmentID, status) => {
        set({ loading : true, error : null })

        try{
            await putWithAuth(`appointment/end/${appointmentID}`, { status })
            set((state) => ({ 
                appointments : state.appointments.map(apt => apt._id === appointmentID ? {...apt, status} : apt),
                currentAppointment : state.currentAppointment?._id === appointmentID ? {...state.currentAppointment, status} : state.currentAppointment
            }))
            toast.success("Appointment status updated");
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Failed to update appointment status");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    updatePrecription : async(appointmentID, file) => {
        set({ loading : true, error : null })

        try{
            const formData = new FormData()
            formData.append('file', file)
            
            const res = await putFileWithAuth(`appointment/prescription/${appointmentID}`, formData)
            const pescription = res.data?.pescription

            if(pescription) {
                set((state) => ({
                    appointments : state.appointments.map(apt => apt._id === appointmentID ? {...apt, pescription: pescription} : apt),
                    currentAppointment : state.currentAppointment?._id === appointmentID ? {...state.currentAppointment, pescription: pescription} : state.currentAppointment
                }))
            }
            toast.success("Prescription uploaded successfully");
            return pescription;
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Failed to upload prescription");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    deletePrescription : async(appointmentID) => {
        set({ loading : true, error : null })

        try{
            await deleteWithAuth(`appointment/prescription/${appointmentID}`)

            set((state) => ({
                appointments : state.appointments.map(apt => apt._id === appointmentID ? {...apt, pescription: undefined} : apt),
                currentAppointment : state.currentAppointment?._id === appointmentID ? {...state.currentAppointment, pescription: undefined} : state.currentAppointment
            }))
            toast.success("Prescription deleted successfully");
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Failed to delete prescription");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

    markAsFollowUp : async(appointmentID) => {
        set({ loading : true, error : null })

        try{
            const res = await putWithAuth(`appointment/follow-up/${appointmentID}`, {})
            set((state) => ({
                appointments : state.appointments.map(apt => apt._id === appointmentID ? {...apt, isFollowUp: true} : apt),
                currentAppointment : state.currentAppointment?._id === appointmentID ? {...state.currentAppointment, isFollowUp: true} : state.currentAppointment
            }))
            toast.success("Appointment marked as follow-up");
        }
        catch(err : any){
            set({ error : err.message })
            toast.error("Failed to mark as follow-up");
            throw err;
        }
        finally{
            set({ loading : false })
        }
    },

}))
