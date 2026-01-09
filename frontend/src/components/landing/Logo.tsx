import { Stethoscope } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
        <Stethoscope className="w-7 h-7 text-white" />
      </div>
      <div className="font-extrabold bg-gradient-to-b from-blue-600 to-blue-700 bg-clip-text text-transparent">
        <span className="text-4xl font-serif">D</span><span className="text-2xl font-sans">OCURE</span>
      </div>
    </Link>
  );
};
