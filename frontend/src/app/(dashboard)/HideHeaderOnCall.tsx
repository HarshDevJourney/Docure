"use client";

import { usePathname } from "next/navigation";

export function HideHeaderOnCall({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname.startsWith("/call")) return null;
    return <>{children}</>;
}

export function CallAwareMain({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCall = pathname.startsWith("/call");
    return <main className={isCall ? "" : "mt-16"}>{children}</main>;
}
