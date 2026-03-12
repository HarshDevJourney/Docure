import React from "react";
import { Button } from "../ui/button";
import { healthcareCategories } from "@/lib/constant";
import Link from "next/link";
import { userAuthStore } from "@/store/authStore";
import { CalendarCheck, LayoutDashboard, Stethoscope } from "lucide-react";

export const Herosection = () => {
  const { user, isAuthenticated } = userAuthStore()
  return (
    <section className="px-4 py-10 md:py-18 bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto text-center container">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-snug">
          Every <span className="text-blue-600 ">Symptom</span> Isn’t a{" "}
          <span className="text-blue-600  font-extrabold italic">
            Disaster
          </span>
          <br />
          Ask a <span className="text-blue-600 ">Doctor</span> Who Gets
          Your{" "}
          <span className="text-blue-400 italic  ">Overthinking</span>
        </h1>

        <p className="mt-4 lg:mt-7 md:text-xl text-gray-700 ">
          Life’s little worries don’t need to feel like emergencies. <br /> Our
          friendly <span className="text-blue-600 font-semibold">doctors</span>{" "}
          are here to listen and help you navigate your health questions <br />{" "}
          Because a calm mind makes better decisions than panic ever could.
        </p>

        {isAuthenticated && user?.type === 'doctor' ? (
          <div className="flex items-center justify-center my-8 px-4 animate-fade-in">
            <Link href="/doctor/dashboard" className="group w-full sm:w-auto">
              <Button className="cursor-pointer font-bold md:text-lg rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out w-full sm:w-auto min-w-[320px]">
                <LayoutDashboard className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span>Doctor Dashboard</span>
              </Button>
            </Link>
          </div>
        ) : isAuthenticated && user?.type === 'patient' ? (
          <div className="flex items-center justify-center my-8 animate-fade-in">
            <Link href="/doctor-list" className="group w-full sm:w-auto">
              <Button className="cursor-pointer font-bold md:text-lg rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out w-full sm:w-auto min-w-[340px]">
                <CalendarCheck className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Book a Visit</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center my-12 sm:flex-row sm:space-x-6 md:space-x-8 gap-4 mx-auto max-w-2xl px-4 animate-fade-in">
            <Link href="/doctor-list" className="group w-full sm:w-auto">
              <Button className="cursor-pointer font-bold md:text-lg rounded-full px-12 sm:px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out w-full sm:w-auto min-w-[200px]">
                <CalendarCheck className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Book a Visit</span>
              </Button>
            </Link>
            
            <div className="relative flex items-center justify-center w-full sm:w-auto">
              <div className="absolute inset-0 flex items-center justify-center sm:hidden">
                <span className="text-gray-400 text-sm bg-white px-2">or</span>
              </div>
              <span className="hidden sm:inline text-gray-400 font-medium px-4">or</span>
            </div>
            
            <Link href="/login/doctor" className="group w-full sm:w-auto">
              <Button className="cursor-pointer font-bold md:text-lg rounded-full px-12 sm:px-10 py-6 bg-gray-100 hover:bg-gray-200 border-2 border-blue-600 text-blue-600 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out w-full sm:w-auto min-w-[220px]">
                <Stethoscope className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span>Login as Doctor</span>
              </Button>
            </Link>
          </div>
        )}

        <section className="py-4 sm:py-8">
          <div className="container mx-auto px-5 lg:px-13">
            <div
              className="flex flex-nowrap items-baseline gap-x-6 pb-2 
                 overflow-x-auto scrollbar-hide 
                 snap-x snap-mandatory scroll-smooth scrollbar-hide
                 -mx-5 px-5"
            >
              {healthcareCategories.map((el) => (
                <Link href={el.href}>
                  <button
                    key={el.id}
                    className="flex flex-col min-w-[100px] cursor-pointer items-center group transition-transform shrink-0 snap-start "
                    type="button"
                  >
                    <div
                      className={`w-12 h-12 hover:scale-80 hover:shadow-blue-500 hover:shadow-2xl transition-all duration-300 rounded-2xl flex justify-center items-center ${el.color}`}
                    >
                      <svg
                        className="w-7 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d={el.icon} />
                      </svg>
                    </div>
                    <span className="mt-2 text-sm md:text-base font-light font-serif text-center">
                      {el.title}
                    </span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
