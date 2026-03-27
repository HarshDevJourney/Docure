"use client";

import { userAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

interface AuthFormProp {
  type: "login" | "signup";
  userRole: "patient" | "doctor";
}

const AuthForm = ({ type, userRole }: AuthFormProp) => {
  // states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {
    registerDoctor,
    registerPatient,
    loginDoctor,
    loginPatient,
    isloading,
    isAuthenticated,
    user,
  } = userAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.isVerified) {
        router.push(`/onboarding/${user.type}`);
      } else {
        if (user.type === "doctor") router.push(`/${user.type}/dashboard`);
        else router.push(`/${user.type}/appointments`);
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "signup" && !agreeTerms) return;

    try {
      if (type === "signup") {
        if (userRole === "doctor") {
          await registerDoctor({ ...formData });
        } else await registerPatient({ ...formData });
        // Redirect handled by useEffect
      } else {
        if (userRole === "doctor") {
          await loginDoctor(formData.email, formData.password);
        } else {
          await loginPatient(formData.email, formData.password);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleAuth = () => {
    const intent = type === "login" ? "login" : "signup";
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?type=${userRole}&intent=${intent}`;
  };

  const islogin = type === "login";
  const title = islogin ? "Welcome Back Again" : "Create New Account";
  const butText = islogin ? "Login" : "Sign Up";
  const altTextLink = islogin ? "Don't have an Account" : "Already a Member";
  const altLinkAction = islogin ? "Sign Up" : "Login";
  const altLinkPath = !islogin ? `/login/${userRole}` : `/signup/${userRole}`;

  return (
    <div className='-translate-y-1/12'>
      <div className=' w-screen bg-gradient-to-br rounded-4xl mt-4 pt-10 pb-5 from-blue-600 via-blue-700 to to-blue-800 flex lg:hidden justify-center items-center'>
        <div className='text-center text-white p-8 max-w-md'>
          <div className='bg-white/20 text-center flex justify-center mx-auto mb-7 items-center w-20 h-20 rounded-2xl'>
            <svg
              className='w-12 h-12  text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
          </div>
          <p className='text-3xl font-bold font-serif -mb-6  mx-auto'>Welcome to</p>
          <p className='text-8xl font-extrabold font-sans border-b-3 pb-2'>Docure</p>
          <p className='text-3xl font-bold pt-2 font-sans'>Your Health, Our Priority</p>
        </div>
      </div>
      <div className='w-full max-w-md mx-auto mt-15 bg-white rounded-2x lg:p-8'>
        {/* Title Section */}
        <div className='text-center mb-6 hidden lg:block'>
          <h1 className='font-extrabold border-b-4 border-blue-500 bg-gradient-to-b from-blue-600 to-blue-500 bg-clip-text text-transparent text-3xl lg:text-4xl'>
            {title}
          </h1>
        </div>

        {/* Card Section */}
        <Card className='border-0 shadow-none mx-8 bg-transparent '>
          <CardContent className='p-0 '>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Name (only for signup) */}
              {!islogin && (
                <div>
                  <Label htmlFor='name' className='text-blue-600 font-bold text-lg font-sans'>
                    Full Name
                  </Label>
                  <Input
                    id='name'
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='mt-1 border-2 border-blue-400 focus:ring-1 text-blue-700 text-lg font-semibold focus:border-blue-600 focus:ring-blue-600'
                    placeholder='Enter your full name'
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <Label htmlFor='email' className='text-blue-600 font-bold text-lg font-sans'>
                  Email Address
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='mt-1 border-2 border-blue-400 focus:ring-1 text-blue-700 text-lg font-semibold focus:border-blue-600 focus:ring-blue-600'
                  placeholder='Enter your email'
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor='password' className='text-blue-600 font-bold text-lg font-sans'>
                  {islogin ? "Enter your Password" : "Create a Password"}
                </Label>
                <div className='relative mt-1'>
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className='mt-1 border-2 border-blue-400 focus:ring-1 text-blue-700 text-lg font-semibold focus:border-blue-600 focus:ring-blue-600'
                    placeholder='Enter your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-3 flex items-center text-blue-500 hover:text-blue-700'
                  >
                    {!showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Terms (only for signup) */}
              {!islogin && (
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='terms'
                    checked={agreeTerms}
                    onClick={() => setAgreeTerms(!agreeTerms)}
                  />
                  <Label htmlFor='terms' className='text-blue-700 text-sm'>
                    I agree to the{" "}
                    <Link href='#' className='text-blue-600 underline'>
                      Terms & Conditions
                    </Link>
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold font-serif py-2 mt-4 rounded-lg transition duration-200'
              >
                {isloading ? `${!islogin ? "Creating..." : "Fetching..."}` : `${butText}`}
              </Button>
            </form>

            {/* Separator */}
            <div className='flex items-center justify-center my-6'>
              <div className='w-full h-px bg-blue-200'></div>
              <span className='px-3 text-blue-600 text-sm font-medium'>OR</span>
              <div className='w-full h-px bg-blue-200'></div>
            </div>

            {/* Google Auth Button */}
            <Button
              type='button'
              onClick={handleGoogleAuth}
              variant='outline'
              className='w-full flex items-center justify-center gap-2 border-blue-400 text-blue-700 hover:bg-blue-50 font-semibold'
            >
              <svg className='w-5 h-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path
                  fill='#EA4335'
                  d='M24 9.5c3.9 0 7 1.6 9.1 3.1l6.8-6.8C35.3 2.2 30.1 0 24 0 14.6 0 6.5 5.3 2.5 13.1l7.9 6.1C12.1 13.2 17.4 9.5 24 9.5z'
                />
                <path
                  fill='#34A853'
                  d='M46.1 24.6c0-1.5-.1-2.9-.3-4.3H24v8.1h12.5c-.6 3-2.4 5.6-5 7.4l7.8 6c4.5-4.1 7.1-10.1 7.1-17.2z'
                />
                <path
                  fill='#4A90E2'
                  d='M24 48c6.5 0 12-2.1 16-5.8l-7.8-6c-2.2 1.5-5 2.4-8.2 2.4-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.1C6.5 42.7 14.6 48 24 48z'
                />
                <path
                  fill='#FBBC05'
                  d='M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.7 0 20.3 0 24c0 3.7 1 7.3 2.6 10.4l7.9-5.7z'
                />
              </svg>
              <span className='font-serif'>Continue with Google</span>
            </Button>
          </CardContent>
        </Card>

        {/* Alternate Link */}
        <p className='text-center font-serif text-blue-700 mt-5'>
          {altTextLink} ?
          <Link
            href={altLinkPath}
            className='text-blue-600 font-bold font-serif pl-2 hover:underline'
          >
            {altLinkAction}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
