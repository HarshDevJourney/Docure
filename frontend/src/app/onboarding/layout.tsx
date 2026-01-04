import { userAuthStore } from '@/store/authStore'
import { redirect } from 'next/navigation'
// import React, { useEffect } from 'react'

function layout({ children } : { children : React.ReactNode }) {

    // const { isAuthenticated } = userAuthStore()
    // useEffect(() => {

    //     if(!isAuthenticated){
    //         redirect('/login/patient')
    //     }
    // },[isAuthenticated])

    // if(!isAuthenticated) return null;

  return (
    <div className='min-h-screen flex flex-col'>
        <header>
            <div>docure</div>
        </header>
        <main className='flex justify-center items-center'>
            {children}
        </main>
    </div>
  )
}

export default layout