/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bell, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { FC } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Logo } from "./Logo";
import { ProfileNav } from "./ProfileNav";


interface HeaderProps {
  showDashboardNav?: boolean;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  active: boolean;
}

export const Header: FC<HeaderProps> = ({ showDashboardNav = false }) => {
  const pathname = usePathname();
  const isAuthenticated = false;
  const user = {
    type: "patient",
    name : 'Harsh',
    profilePic : "harsh",
    email : "harsh.exe123@gmail.com"
  };

  const getHeaderNavigation = (): NavItem[] => {
    if (!user || !showDashboardNav) return [];

    if (user?.type === "patient") {
      return [
        {
          label: "Appointments",
          icon: Calendar,
          href: "/patient/appointments",
          active: pathname?.includes("/patient/appointments") || false,
        },
      ];
    } else if (user?.type === "doctor") {
      return [
        {
          label: "Appointments",
          icon: Calendar,
          href: "/doctor/appointments",
          active: pathname?.includes("/doctor/appointments") || false,
        },
        {
          label: "DashBoard",
          icon: Calendar,
          href: "/doctor/dashboard",
          active: pathname?.includes("/doctor/dashboard") || false,
        },
      ];
    }

    return [];
  };

  return (
    <header className="bg-white border-b rounded-b-2xl border-b-gray-400 fixed top-0 left-0 right-0 backdrop-blur-sm z-50 shadow-md">
      <div className="container mx-auto h-16 px-4 flex items-center justify-between ">
        <div className="flex items-center space-x-8">
          <Logo />
          {isAuthenticated && showDashboardNav && (
            <nav className="hidden md:block">
              {getHeaderNavigation().map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`flex items-center space-x-1 transition-colors ${
                    item.active
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="h-4 w-4 mx-1.5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {isAuthenticated && showDashboardNav ? (
          <div className="flex items-center space-x-0 md:space-x-5">
            <ProfileNav user={user} />

            <Button className="relative">
              <Bell className="h-5 w-5 size-6 text-gray-600" />
              <Badge className="absolute w-5 h-5 text-xs text-white -top-1 -right-1 bg-red-600 rounded-full">
                2
              </Badge>
            </Button>
          </div>
        ) : (
          <div className="flex">
            <Link href={"/login/patient"} className="mx-4">
              <Button
                variant={"ghost"}
                className="text-blue-700 font-bold font-mono text-lg cursor-pointer rounded-2xl hover:bg-gray-200"
              >
                Login
              </Button>
            </Link>
            <Link href={"/patient/login"} className="hidden md:flex">
              <Button className="font-bold font-mono text-lg rounded-full bg-blue-600 hover:bg-blue-400 text-white cursor-pointer">
                Book Consultation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
