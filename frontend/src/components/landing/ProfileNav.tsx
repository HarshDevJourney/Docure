'use client'

import React, { FC } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Settings, User } from "lucide-react";
import { Button } from '../ui/button';
import Link from 'next/link';
import { userAuthStore } from '@/store/authStore';
import Router from 'next/router';
import { useRouter } from 'next/navigation';

interface UserProfile {
    type : string,
    name : string,
    email : string,
    profilePic : string
}

interface ProfileNavProps {
  user: UserProfile;
}

export const ProfileNav: FC<ProfileNavProps> = ({ user } : ProfileNavProps ) => {
  const router = useRouter()
  const { logout } = userAuthStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center justify-center md:space-x-1 md:px-2 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePic} alt={user.name}></AvatarImage>
            <AvatarFallback className="text-blue-700 font-bold border-3 text-lg">
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-start">
            <p className="text-blue-600 font-bold text-medium">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 capitalize ">
              {user.type}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-100 bg-white">
        <DropdownMenuItem className="flex flex-col items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePic} alt={user.name}></AvatarImage>
            <AvatarFallback className="bg-blue-200 text-blue-700 font-bold border-2 border-blue-400 text-lg">
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-center">
            <p className="text-medium font-bold tracking-widest text-gray-900">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 font-mono">
              {user.email}
            </p>
          </div>
        </DropdownMenuItem>
        <div className="py-2">
          <Link
            href="/profile"
            className="flex items-center mx-auto gap-2 px-4 py-2 text-sm border-y border-y-gray-500 text-gray-700 hover:bg-gray-100 rounded"
          >
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-serif ">Profile</span>
          </Link>
          <Link
            href={`/${user.type}/dashboard`}
            className="flex items-center gap-2 px-4 py-2 text-sm border-b border-b-gray-500 text-gray-700 hover:bg-gray-100 rounded"
          >
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-serif ">Dashboard</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 border-b border-b-gray-500 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Settings className="w-4 h-4 text-2xl text-gray-500" />
            <span className="font-serif">Settings</span>
          </Link>
          <DropdownMenuSeparator />
          <button
            className="w-full text-center py-3 text-sm text-white rounded"
            
          >
            <span className="bg-red-500 hover:bg-red-400 px-4 py-1.5 rounded-lg font-semibold font-mono">
              <Button onClick={() => {logout(); router.push('/')}}>Logout</Button>
            </span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
