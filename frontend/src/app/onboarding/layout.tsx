'use client'

import { userAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

function layout({ children } : { children : React.ReactNode }) {

    const { isAuthenticated } = userAuthStore()
    useEffect(() => {
        if(!isAuthenticated){
          console.log(isAuthenticated)
            redirect('/login/patient')
        }
    },[isAuthenticated])

    if(!isAuthenticated) return null;

  return (
    <div className='min-h-screen flex flex-col  bg-gray-50'>
        <header>
            <div className='text-blue-600 h-22 text-center px-3 rounded-b-lg'>
              <Link href={'/'}>
                <p className="text-6xl font-extrabold font-sans text-blue-600 py-4">
                    Docure
                </p>
              </Link>
            </div>
        </header>
        <main className='flex justify-center items-center'>
            {children}
        </main>
    </div>
  )
}

export default layout