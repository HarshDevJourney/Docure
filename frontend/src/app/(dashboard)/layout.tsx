import { Header } from '@/components/landing/Header'
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
    <div>
      <header>
        <Header showDashboardNav={true} />
      </header>
        <main className='mt-16'>
            {children}
        </main>
    </div>
  )
}

export default layout