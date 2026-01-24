import { getWithAuth } from './../service/httpService';
import { Doctor, DoctorFilters } from "@/lib/types";
import { create } from "zustand";

interface DoctorState {
    doctors : Doctor[],
    currentDoc : Doctor | null,
    dashboard : any,
    error : string | null,
    loading : boolean,
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
    fetchDoctorByID : (id : string) => Promise<void>
}

export const useDoctorState = create<DoctorState>((set, get) => ({
    doctors : [],
    currentDoc : null,
    dashboard : [],
    loading : false,
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
                if(!value){
                    queryParam.append(key, value.toString())
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
        catch(error : any){
            set({ error : error.message })
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
        catch(error : any){
            set({ error : error.message })
        }
        finally {
            set({ loading : false, error : null })
        }
    },
}))