"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useParams, useRouter } from "next/navigation";
import AppointmentCall from "@/components/call/AppointmentCall";
import { userAuthStore } from "@/store/authStore";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const [isNavigating, setIsNavigating] = useState(false);

  const appointmentID = params?.appointmentID as string;
  const { user } = userAuthStore();
  const { currentAppointment, fetchAppointmentByID, joinConsultation } = useAppointmentStore();

  useEffect(() => {
    if (appointmentID) fetchAppointmentByID(appointmentID);
  }, [appointmentID, fetchAppointmentByID]);

  const currentUserData = {
    id: user?.id ?? "",
    name: user?.name ?? "",
    role: user?.type as "patient" | "doctor",
  };

  const handleCallEnd = useCallback(async () => {
    if (isNavigating) return;
    try {
      setIsNavigating(true);

      if (user?.type === "doctor") {
        router.push(`/doctor/dashboard?completedCall=${appointmentID}`);
      } else {
        router.push(`/patient/appointments?completedCall=${appointmentID}`);
      }
    } catch (err: unknown) {
      console.error(err);
      router.push("/");
    } finally {
      setIsNavigating(false);
    }
  }, [appointmentID, router, isNavigating, user?.type]);

  if (!currentAppointment?._id) {
    // appointment not yet fetched – show a simple loading state
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-slate-500'>Loading consultation…</p>
      </div>
    );
  }

  return (
    <AppointmentCall
      appointment={currentAppointment}
      currentUser={currentUserData}
      joinConsultation={joinConsultation}
      onCallEnd={handleCallEnd}
    />
  );
};

export default Page;
