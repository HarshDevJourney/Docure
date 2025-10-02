import React from "react";
import { Button } from "../ui/button";
import { healthcareCategories } from "@/lib/constant";

export const Herosection = () => {
  return (
    <section className="px-4 py-10 md:py-18 bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto text-center container">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-snug">
          Every <span className="text-blue-600">Symptom</span> Isn’t a{" "}
          <span className="text-blue-600 font-extrabold">Disaster</span>
          <br />
          Ask a <span className="text-blue-600">Doctor</span> Who Gets Your{" "}
          <span className="text-blue-400 italic">Overthinking</span>
        </h1>

        <p className="mt-4 lg:mt-7 md:text-xl text-gray-700 ">
          Life’s little worries don’t need to feel like emergencies. <br /> Our
          friendly <span className="text-blue-600 font-semibold">doctors</span>{" "}
          are here to listen and help you navigate your health questions <br />{" "}
          Because a calm mind makes better decisions than panic ever could.
        </p>

        <div className="flex flex-col items-center justify-center my-10 sm:space-x-5 md:space-x-8 gap-4 sm:flex-row mx-auto">
          <Button className="font-bold md:text-lg rounded-full px-17 sm:px-10.5 bg-blue-600 text-white">
            Book a Visit
          </Button>
          <Button className="font-bold md:text-lg px-12 sm:px-6 rounded-full bg-gray-100 border border-blue-600 text-blue-600">
            Login As A Doctor
          </Button>
        </div>

        <section className="py-4 sm:py-8">
          <div className="container mx-auto px-5 lg:px-13">
            <div
              className="flex flex-nowrap items-baseline gap-x-6 pb-2 
                 overflow-x-auto scrollbar-hide 
                 snap-x snap-mandatory scroll-smooth scrollbar-hide
                 -mx-5 px-5"
            >
              {healthcareCategories.map((el) => (
                <button
                  key={el.id}
                  className="flex flex-col min-w-[100px]  items-center group transition-transform shrink-0 snap-start "
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
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
