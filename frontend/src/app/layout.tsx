import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docure - Online Doctor Consultations",
  description:
    "Connect with certified doctors online for quality healthcare. Professional medical consultations from the comfort of your home.",
  keywords: [
    "telemedicine",
    "online doctor",
    "healthcare",
    "consultation",
    "medical advice",
    "teleconsultation",
    "docure",
    "doctor",
    "cure",
  ],
  authors: [{ name: "Docure" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
