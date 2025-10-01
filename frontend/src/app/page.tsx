"use client"

import { Header } from "@/components/landing/Header";
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
    <div className="h-[100vh] bg-white">
      <Header showDashboardNav={true} />
    </div>
  );
}
