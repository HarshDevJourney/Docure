"use client";

import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mode = pathname.includes("signup") ? "signup" : "login";

  return (
    <div className='flex min-h-[100dvh] h-auto overflow-y-scroll'>
      <div
        className={`w-full lg:w-1/2 flex justify-center items-center py-2 px-5 bg-white ${
          mode == "signup" ? "lg:translate-x-full" : ""
        }`}
      >
        {children}
      </div>
      <div
        className={`hidden lg:block w-1/2 relative overflow-hidden ${
          mode == "signup" ? "lg:-translate-x-full" : "translate-x-0"
        } transition-all duration-1200 `}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-black/10 to-transparent z-10'></div>
        <div className='w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to to-blue-800 flex justify-center items-center'>
          <div className='text-center text-white p-8 max-w-md'>
            <div className='bg-white/20 text-center flex justify-center mx-auto mb-7 items-center w-20 h-20 rounded-2xl'>
              <svg
                className='w-12 h-12  text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
            </div>
            <p className='text-3xl font-bold font-serif -mb-6  mx-auto'>Welcome to</p>
            <p className='text-8xl font-extrabold font-sans border-b-3 pb-2'>Docure</p>
            <p className='text-3xl font-bold pt-2 font-sans'>Your Health, Our Priority</p>
            <p className='font-serif font-thin py-8'>
              Healthcare doesn’t have to be intimidating. We’re here to turn your worries into
              answers, your questions into clarity, and your health journey into something you
              actually feel in control of
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
