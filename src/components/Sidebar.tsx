"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, FileText, Pill, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Doctors", path: "/doctors", icon: Stethoscope },
  { label: "Insurance", path: "/insurances", icon: ShieldCheck },
  { label: "Medication", path: "/medications", icon: Pill },
  { label: "Patients", path: "/patients", icon: Users },
  { label: "Prescriptions", path: "/prescriptions", icon: FileText },
  { label: "Visits", path: "/visits", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col min-h-screen">
      <h2 className="text-xl font-bold text-orange-500 mb-6">Doctor Admin</h2>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 transition-all",
              pathname === item.path
                ? "bg-purple-900 text-white"
                : "hover:bg-purple-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-800 text-sm text-gray-500">
        © 2025 Admin Panel
      </div>
    </aside>
  );
}