"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useAppointmentStore } from '@/store/appointmentStore';
import { useParams, useRouter } from 'next/navigation';
import AppointmentCall from '@/components/call/AppointmentCall';
import { userAuthStore } from '@/store/authStore';

const page = () => {
    const router = useRouter();
    const params = useParams();
    const [isNavigating, setIsNavigating] = useState(false);

    const appointmentID = params?.appointmentID as string;
    const { user } = userAuthStore();
    const { currentAppointment, fetchAppointmentByID, joinConsultation } = useAppointmentStore();

    useEffect(() => {
      if(appointmentID) fetchAppointmentByID(appointmentID);
    }, [appointmentID, fetchAppointmentByID])

    const currentUserData = {
      id : user.id,
      name : user.name,
      role : user.type as 'patient' | 'doctor'
    }

    const handleCallEnd = useCallback(async () => {
      if(isNavigating) return;
      try{
        setIsNavigating(true);

      }catch(err : any){
        console.error(err);
        router.push('/')
      }finally{
        setIsNavigating(false);
      }
    }, [appointmentID, router, isNavigating, user.type])

  return (
    <AppointmentCall appointment={currentAppointment} currentUser={currentUserData} joinConsultation={joinConsultation} onCallEnd={handleCallEnd} />
  )
}

export default page;