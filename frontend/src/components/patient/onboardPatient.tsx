"use client"

import { userAuthStore } from '@/store/authStore'
import { ArrowLeftIcon, ArrowRightIcon, Heart, Loader, Phone, User } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from 'next/navigation';
import { Form } from '../ui/form';
import PatientOnboardForm1 from './patientOnboardForm1';
import PatientOnboardForm2 from './patientOnboardForm2';
import PatientOnboardForm3 from './patientOnboardForm3';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

function Step({ activeStep }: { activeStep: number }) {
  return (
    <>
      {[1, 2, 3].map((item: number) => (
        <div
          key={item}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-md font-medium
            ${
              activeStep >= item
                ? "bg-blue-600 text-white"
                : "border text-gray-400"
            }
            ${activeStep === item && "w-12 h-12 text-lg" }`}
        >
          {item}
        </div>
      ))}
    </>
  );
}

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

const basicInfoSchema = z.object({
  name: z
    .string(),

  email: z
    .string(),

  // page 1
  phone: z
    .string()
    .min(10, "Phone number is required"),

  dob: z
    .string()
    .min(1, "Date of birth is required"),

  gender: z
    .string()
    .min(1, "Gender is required"),

  bloodGrp: z.string(),

  // ---------- Page 2: Emergency Details ----------
  emergencyContact: z.object({
    name: z.string().min(2, "Contact name is required"),
    phone: z.string().min(10, "Valid phone number required"),
    relation: z.string().min(1, "Relationship is required"),
  }),

  // ---------- Page 3: Medical History ----------
  medicalHistory: z.object({
    allergies: z.string().optional(),
    currentMedications: z.string().optional(),
    chronicConditions: z.string().optional(),
  }),
}); 


const PatientOnboardForm = () => {
  const { user , updateProfile } = userAuthStore()
  const [ step, setStep ] = useState(1)
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const router = useRouter()


  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,

      phone: "",
      dob: "",
      gender: "",
      bloodGrp: "",

      emergencyContact: {
        name: "",
        phone: "",
        relation: ""
      },

      medicalHistory: {
        allergies: "",
        currentMedications: "",
        chronicConditions: ""
      }
    },
    shouldUnregister: false, // IMPORTANT for multi-step forms
  });

  const onSubmit = async (data : BasicInfoFormData) => {
    setIsSubmitting(true);

    try {
      console.log(data);
      await updateProfile(data)
      toast.success('Patient Information Updated Successfully')
      router.replace('/patient/dashboard')
    } finally {
      setIsSubmitting(false);
    }
  };

  function stepBack(){
    if(step > 1){
      setStep((step) => step-1)
    }
  }

  function stepForward(){
    if(step < 3){
      setStep((step) => step+1)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 px-2 space-y-6 my-2">
      <div className='text-center space-y-8'>
        <div className='space-y-1.5'>
          <h1 className='text-black text-2xl font-bold font-sans'>Welcome <span className='text-blue-600 text-4xl font-extrabold capitalize'>{user?.name}</span>, Ready to Onboard !</h1>
          <p className='text-gray-500 text-sm font-semibold '>Complete your profile to start booking Appointments</p>
        </div>
        <div className="flex justify-center items-center gap-10">
          <Step activeStep={step} />
        </div>
      </div>
      
      <div className='flex items-center gap-3 relative justify-center'>
        <Button onClick={stepBack} disabled={step === 1} className='cursor-pointer' size={'icon'}><ArrowLeftIcon className="w-6 h-6"/></Button>
        <div className='bg-white my-auto max-w-xl w-md border-b-gray-600 rounded-2xl shadow-sm px-4 py-8'>
          {step == 1 &&
            <div className="flex items-center gap-4 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-blue-700">
                  Basic Information
                </h2>
            </div>
          }
          {step == 2 &&
            <div className="flex items-center gap-4 mb-6">
                <Phone className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-blue-600">
                  Emergency Contact
                </h2>
            </div>
          }
          {step == 3 &&
            <div className="flex items-center gap-4 mb-6">
                <Heart className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-blue-600">
                  Medical Information
                </h2>
            </div>
          }
          <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)}>

            {step == 1 &&
              <div>
                <PatientOnboardForm1 form={form}/>
              </div>
            }
            {step == 2 &&
              <div>
                <PatientOnboardForm2 form={form}/> 
              </div>
            }
            {step == 3 &&
              <div>
                <PatientOnboardForm3 form={form}/>
                <Button variant={'secondary'} type='submit' className='bg-blue-600 mt-8 w-full cursor-pointer text-white'>{isSubmitting ? <Loader /> : 'Submit'}</Button>
              </div> 
            }
            </form>
          </Form>
        </div>
        <Button onClick={stepForward} className='cursor-pointer' disabled={step === 3} size={'icon'} variant={'ghost'}><ArrowRightIcon className="w-6 h-6"/></Button>
      </div>

    </div>
  )
}

export default PatientOnboardForm

