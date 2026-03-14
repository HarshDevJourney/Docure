'use client'

import React, { FC } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Settings, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { Button } from '../ui/button';
import Link from 'next/link';
import { userAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface UserProfile {
  type: string;
  name: string;
  email: string;
  profilePic: string;
}

interface ProfileNavProps {
  user: UserProfile;
}

export const ProfileNav: FC<ProfileNavProps> = ({ user }) => {
  const router = useRouter();
  const { logout } = userAuthStore();

  const initials = user.name?.charAt(0)?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400'>
          <Avatar className='w-8 h-8 ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-200'>
            <AvatarImage src={user?.profilePic} alt={user.name} />
            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-sm'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='hidden md:flex flex-col items-start leading-tight'>
            <span className='text-sm font-semibold text-blue-700 tracking-tight'>{user.name}</span>
            <span className='text-[11px] text-blue-400 capitalize font-medium'>{user.type}</span>
          </div>
          <ChevronDown className='hidden md:block w-3.5 h-3.5 text-blue-300 group-hover:text-blue-500 transition-colors duration-200' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='w-64 p-0 rounded-2xl border border-blue-100 bg-white shadow-xl shadow-blue-100/50 overflow-hidden z-50'
      >
        {/* Header */}
        <div className='bg-gradient-to-br from-blue-600 to-blue-800 px-5 py-4 flex flex-col items-center gap-2'>
          <Avatar className='w-14 h-14 ring-[3px] ring-white/40'>
            <AvatarImage src={user?.profilePic} alt={user.name} />
            <AvatarFallback className='bg-blue-400 text-white font-bold text-xl'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='text-center'>
            <p className='text-white font-semibold text-sm tracking-wide'>{user.name}</p>
            <p className='text-blue-200 text-xs font-mono mt-0.5'>{user.email}</p>
            <span className='inline-block mt-1.5 bg-blue-500/40 text-blue-100 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border border-blue-400/30'>
              {user.type}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className='p-2 flex flex-col gap-0.5'>
          <NavLink
            href={`/${user.type}/profile`}
            icon={<User className='w-4 h-4' />}
            label='Profile'
          />
          <NavLink
            href={`/${user.type}/dashboard`}
            icon={<LayoutDashboard className='w-4 h-4' />}
            label='Dashboard'
          />
          <NavLink href='/settings' icon={<Settings className='w-4 h-4' />} label='Settings' />
        </div>

        {/* Divider */}
        <div className='mx-3 border-t border-blue-50' />

        {/* Logout */}
        <div className='p-2'>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group'
          >
            <span className='flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors duration-150'>
              <LogOut className='w-3.5 h-3.5' />
            </span>
            Sign out
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Internal helper component
const NavLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 group"
  >
    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-150">
      {icon}
    </span>
    {label}
  </Link>
);