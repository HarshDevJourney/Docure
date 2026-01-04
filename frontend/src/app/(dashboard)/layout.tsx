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
            <h1>docuer doc</h1>
        </header>
        <main>
            {children}
        </main>
    </div>
  )
}

export default layout