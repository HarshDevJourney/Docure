"use client"

import { userAuthStore } from '@/store/authStore'
import { ArrowLeftIcon, ArrowRightIcon, Heart, Loader, Phone, PlusIcon, Stethoscope, User } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from 'next/navigation';
import { Form } from '../ui/form';
import { toast } from 'sonner';
import DoctorOnboardForm1 from './doctorOnboardForm1';
import DoctorOnboardForm2 from './doctorOnboardForm2';
import DoctorOnboardForm3 from './doctorOnboardForm3';
import { useRouter } from 'next/navigation';

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

export type BasicDocInfoFormData = z.infer<typeof basicDocInfoSchema>;

const basicDocInfoSchema = z.object({
  name: z.string().min(3),
  email: z.string(),

  // page 1
  specialization: z.string().min(1),
  qualification: z.string().min(1),
  category: z.array(z.string()).min(1, "Select at least one category"),
  experience: z.number().int().min(0),
  about: z.string(),
  fees: z.number().int().min(0),

  // page 2
  hospitalInfo: z.object({
    name : z.string(),
    address: z.string(),
    cityName: z.string()
  }),

  // page 3
  availabilityRange: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
      excludedWeekdays: z.array(z.number().min(0).max(6)),
    }),
  dailyTimeRange: z
    .array(
      z.object({
        start: z.string(), // "09:00"
        end: z.string(),   // "17:00"
      })
    )
    .min(1, "At least one time range is required"),
  slotDurationMinutes: z.number().int().min(5).max(180),
}); 


const DoctorOnboardForm = () => {
  const { user , updateProfile } = userAuthStore()
  const [ step, setStep ] = useState(1)
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const router = useRouter()
  
  const form = useForm<BasicDocInfoFormData>({
    resolver: zodResolver(basicDocInfoSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
  
      specialization: "",
      qualification: "",
      category: [],
      experience: 0,
      about: "",
      fees: 0,
  
      hospitalInfo: {
        name: "",
        address: "",
        cityName: "",
      },
  
      availabilityRange: {
        startDate: "",
        endDate: "",
        excludedWeekdays: [],
      },
  
      dailyTimeRange: [
        {
          start: "09:00",
          end: "12:00",
        },
      ],
  
      slotDurationMinutes: 30
    }
  });

  const onSubmit = async (data : BasicDocInfoFormData) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      await updateProfile(data)
      toast.success('Doctor Information Updated Successfully')
      if(user) user.isVerified = true;
      router.replace('/doctor/dashboard')
    }
    catch(err){
      toast.warning('Something went Wrong')
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    toast.error("Incomplete form", {
      description: "Please fill all required fields before submitting.",
    });
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
          <p className='text-gray-500 text-sm font-semibold '>Complete your profile to start Practising as Doctor</p>
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
                  Professional Information
                </h2>
            </div>
          }
          {step == 2 &&
            <div className="flex items-center gap-4 mb-6">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-blue-600">
                  Hospilital / Clinic Information
                </h2>
            </div>
          }
          {step == 3 &&
            <div className="flex items-center gap-4 mb-6">
                <PlusIcon className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-blue-600">
                  Additional Information
                </h2>
            </div>
          }
          <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit, onError)}>

            {step == 1 &&
              <div>
                <DoctorOnboardForm1 form={form}/>
              </div>
            }
            {step == 2 &&
              <div>
                <DoctorOnboardForm2 form={form}/> 
              </div>
            }
            {step == 3 &&
              <div>
                <DoctorOnboardForm3 form={form}/>
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

export default DoctorOnboardForm

