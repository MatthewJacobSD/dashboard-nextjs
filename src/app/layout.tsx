import type { Metadata } from "next";
// Loading Geist font for that clean, modern vibe
import { Geist } from "next/font/google";
// Global styles for consistent theming
import "./globals.css";
// Sidebar component for nav, responsive af
import { Sidebar } from "@/components/Sidebar";
// Toaster for those slick notifications
import { ToasterClient } from '@/components/ui/Toaster';

// Setting up Geist font with Latin subset
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Metadata for SEO and browser display
export const metadata: Metadata = {
  title: "SanaSpace Dashboard",
  description: "Admin dashboard for managing doctors, built to slay",
};

// Root layout for the app, sets up the main structure
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Render the app with a flexible, responsive layout
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-100 text-foreground`}>
        <div className="flex min-h-screen">
          {/* Sidebar, hidden on mobile for that clean mobile vibe */}
          <Sidebar className="hidden sm:block" />
          {/* Main content area, bright and responsive */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-inner">
            {children}
          </main>
          {/* Toaster for notifications, always ready to pop */}
          <ToasterClient />
        </div>
      </body>
    </html>
  );
}