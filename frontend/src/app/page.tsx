"use client"

import { Footer } from "@/components/landing/Footer";
import { FOQsection } from "@/components/landing/FOQsection";
import { Header } from "@/components/landing/Header";
import { Herosection } from "@/components/landing/Herosection";
import InviteDoc from "@/components/landing/inviteDoc";
import { Testimonial } from "@/components/landing/Testimonial";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const user = {
    type: "docto",
  };

  const router = useRouter();

  useEffect(() => {
    if (user.type === "doctor") {
      router.replace("/doctor/dashboard");
    }
  });

  return (
    <div className="h-[100vh] bg-white text-black">
      <Header showDashboardNav={true} />
      <main className="pt-16">
        <Herosection />
        <InviteDoc />
        <Testimonial />
        <FOQsection />
      </main>
      <Footer />
    </div>
  );
}
