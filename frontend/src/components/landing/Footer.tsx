import { socials } from "@/lib/constant";
import { Stethoscope } from "lucide-react";
import React from "react";

export const Footer = () => {
  return (
    <footer className='bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white py-10'>
      <div className='container mx-auto px-6'>
        {/* Top Section */}
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-20'>
          {/* Branding & Contact */}
          <div className='flex flex-col flex-1 min-w-[250px]'>
            <div className='flex items-center mb-4'>
              <div className='w-10 h-10 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg flex items-center justify-center'>
                <Stethoscope className='w-7 h-7 text-white' />
              </div>
              <div className='font-extrabold bg-gradient-to-b pl-4 from-white to-white bg-clip-text text-transparent'>
                <span className='text-3xl sm:text-4xl font-serif'>D</span>
                <span className='text-xl sm:text-2xl font-sans'>OCURE</span>
              </div>
            </div>
            <p className='mb-4 text-sm sm:text-base'>
              Your trusted healthcare partner providing quality medical consultations with certified
              doctors online, anytime, anywhere.
            </p>
            <div className='space-y-2 text-sm sm:text-base font-sans'>
              <div className='flex items-center gap-2'>
                <span>📞</span>
                <span>1-888-DOCURE (1-888-633-4227)</span>
              </div>
              <div className='flex items-center gap-2'>
                <span>✉️</span>
                <span>support@docure-plus.com</span>
              </div>
              <div className='flex items-center gap-2'>
                <span>📍</span>
                <span>Available across India</span>
              </div>
            </div>
          </div>
          {/* Link Sections */}
          <div className='flex-[2] grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='font-bold text-base sm:text-lg mb-2'>Company</h3>
              <ul className='space-y-2 font-extralight text-gray-100/80 text-xs sm:text-sm'>
                <li>
                  <a href='#' className='hover:text-blue-100 '>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Support Center
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-2 text-base sm:text-lg'>For Healthcare</h3>
              <ul className='space-y-2 font-extralight text-gray-100/80 text-xs sm:text-sm'>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Join as Doctor
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Doctor Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-2 text-base sm:text-lg'>For Patients</h3>
              <ul className='space-y-2 font-extralight text-gray-100/80 text-xs sm:text-sm'>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Find Doctors
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Book Appointment
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-2 text-base sm:text-lg'>Legal</h3>
              <ul className='space-y-2 font-extralight text-gray-100/80 text-xs sm:text-sm'>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-blue-100'>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className='border-t border-blue-500 mt-10 pt-6 pb-3 flex flex-col md:flex-row md:justify-between md:items-center'>
          <div className='mb-4 md:mb-0'>
            <h4 className='font-semibold mb-2 text-base sm:text-lg'>Stay Updated</h4>
            <p className='text-xs sm:text-sm text-blue-100 mb-3'>
              Get health tips and product updates delivered to your inbox.
            </p>
            <form className='flex flex-col sm:flex-row w-full max-w-7xl'>
              <input
                type='email'
                placeholder='Enter your email'
                className='px-4 py-2 rounded-t-md sm:rounded-l-md sm:rounded-tr-none bg-blue-900 text-white placeholder-blue-300 border-none outline-none w-full sm:w-auto'
              />
              <button
                type='submit'
                className='bg-blue-500 px-4 py-2 rounded-b-md sm:rounded-r-md sm:rounded-bl-none font-semibold hover:bg-blue-400 transition w-full sm:w-auto mt-2 sm:mt-0'
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-base hidden lg:block sm:text-lg font-semibold mr-2 px-3'>
              Follow us :
            </span>
            {/* Replace emojis with SVGs or icon components if needed */}
            {socials.map(({ name, icon: Icon, url }) => (
              <a
                key={name}
                href={url}
                className='bg-blue-900 rounded-full p-2 hover:bg-blue-700 transition'
              >
                <Icon className='sm:w-6 w-4 h-4 sm:h-6 text-white'></Icon>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className='text-xs sm:text-sm text-blue-200 text-center mt-6'>
          &copy; 2025 Docure, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
