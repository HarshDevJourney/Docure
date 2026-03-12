import { Header } from "@/components/landing/Header";
import { HideHeaderOnCall, CallAwareMain } from "./HideHeaderOnCall";
// import React, { useEffect } from 'react'

function layout({ children }: { children: React.ReactNode }) {
    // const { isAuthenticated } = userAuthStore()
    // useEffect(() => {

    //     if(!isAuthenticated){
    //         redirect('/login/patient')
    //     }
    // },[isAuthenticated])

    // if(!isAuthenticated) return null;

    return (
        <div>
            <HideHeaderOnCall>
                <header>
                    <Header showDashboardNav={true} />
                </header>
            </HideHeaderOnCall>
            <CallAwareMain>{children}</CallAwareMain>
        </div>
    );
}

export default layout;
