import { Stethoscope } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
        <Stethoscope className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold bg-gradient-to-b from-blue-600 to-blue-700 bg-clip-text text-transparent">
        Docure
      </div>
    </Link>
  );
};
