/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from "@/lib/types";
import { getWithAuth, postWithAuth, postWithoutAuth } from "@/service/httpService";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

interface AuthState {
    user: User;
    token: string | null;
    isloading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // actions
    setUser: (user: User, token: string) => void;
    clearError: () => void;
    logout: () => void;

    // api actions
    loginDoctor: (email: string, password: string) => Promise<void>;
    loginPatient: (email: string, password: string) => Promise<void>;
    registerDoctor: (data: any) => Promise<void>;
    registerPatient: (data: any) => Promise<void>;
    fetchProfile: () => Promise<User | null>;
    updateProfile: (data: any) => Promise<void>;
}

export const userAuthStore = create<AuthState>()(
    // store our data in local storage
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isloading: false,
            error: null,
            isAuthenticated: false,

            setUser: (user, token) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    error: null,
                });
                localStorage.setItem("token", token);
            },

            clearError: () => {
                set({ error: null });
            },

            logout: () => {
                localStorage.removeItem("token");
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
                toast.success("Logout Done Successfully")
            },

            loginDoctor: async (email, password) => {
                set({ isloading: true, error: null });

                try {
                    const res = await postWithoutAuth("auth/doctor/login", {
                        email,
                        password,
                    });
                    get().setUser(res.data.user, res.data.token);
                    toast.success("Doctor logged in successfully");
                } catch (err: any) {
                    set({ error: err.message });
                    toast.error(err.message || "Login failed");
                    throw err;
                } finally {
                    set({ isloading: false });
                }
            },

            loginPatient: async (email, password) => {
                set({ isloading: true, error: null });

                try {
                    const res = await postWithoutAuth("auth/patient/login", {
                        email,
                        password,
                    });
                    get().setUser(res.data.user, res.data.token);
                    toast.success("Patient logged in successfully");
                } catch (err: any) {
                    set({ error: err.message });
                    toast.error(err.message || "Login failed");
                    throw err;
                } finally {
                    set({ isloading: false });
                }
            },

            registerDoctor: async (data) => {
                set({ isloading: true, error: null });

                try {        
                    const res = await postWithoutAuth("auth/doctor/register", data);
                    
                    get().setUser(res.data.user, res.data.token);
                    toast.success("Doctor registered successfully");
                } catch (err: any) {
                    set({ error: err.message });
                    toast.error(err.message || "Registration failed");
                    throw err;
                } finally {
                    set({ isloading: false });
                }
            },

            registerPatient: async (data) => {
                set({ isloading: true, error: null });

                try {
                    const res = await postWithoutAuth("auth/patient/register", data);
                    get().setUser(res.data.user, res.data.token);
                    toast.success("Patient registered successfully");
                } catch (err: any) {
                    set({ error: err.message });
                    toast.error(err.message || "Registration failed");
                    throw err;
                } finally {
                    set({ isloading: false });
                }
            },

            fetchProfile: async (): Promise<User | null> => {
                set({ isloading: true, error: null });

                try {
                    const { user } = get();
                    if (!user) throw new Error("User Not Found");
                    const endPoint = user.type === "doctor" ? "/doctor/me" : "/patient/me";
                    const res = await getWithAuth(endPoint);
                    set({
                        user: { ...user, ...res.data },
                    });
                    return res.data;
                } catch (err: any) {
                    set({ error: err.message });
                    return null;
                } finally {
                    set({ isloading: false });
                }
            },

            updateProfile: async (data: any) => {
                set({ isloading: true, error: null });

                try {
                    const { user } = get();
                    if (!user) throw new Error("User Not Found");
                    const endPoint =
                        user.type === "doctor"
                            ? "doctor/onboarding/update"
                            : "patient/onboarding/update";
                    const res = await postWithAuth(endPoint, data);
                    set({
                        user: { ...user, ...res.data },
                    });
                    return res.data;
                } catch (err: any) {
                    set({ error: err.message });
                    throw err;
                } finally {
                    set({ isloading: false });
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
