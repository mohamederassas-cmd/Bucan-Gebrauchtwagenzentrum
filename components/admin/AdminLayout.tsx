"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Car, Plus, LogOut, Home, Menu } from "lucide-react";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/admin/fahrzeuge", icon: <Car size={20} />, label: "Fahrzeuge" },
    { href: "/admin/fahrzeuge/neu", icon: <Plus size={20} />, label: "Neu hinzufügen" },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <Image
          src="/logo.svg"
          alt="BUCAN AUTOMOBILE"
          width={160}
          height={36}
          className="h-8 w-auto"
        />
        <p className="text-xs text-[#475569] mt-2 font-accent tracking-wider">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-accent text-sm tracking-wider ${
                active
                  ? "bg-[#2563EB] text-white font-bold"
                  : "text-[#475569] hover:text-[#1E3A8A] hover:bg-[#EFF6FF]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-[#E2E8F0] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all font-accent text-sm tracking-wider"
        >
          <Home size={20} /> Website ansehen
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#475569] hover:text-red-600 hover:bg-red-50 transition-all font-accent text-sm tracking-wider"
        >
          <LogOut size={20} /> Abmelden
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E2E8F0] fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
          <div className="flex-1 bg-[#0F172A]/40" />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
          <button
            className="lg:hidden text-[#475569] hover:text-[#2563EB] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="lg:hidden flex-1" />
          <p className="text-[#475569] text-sm font-accent tracking-wider hidden lg:block">
            BUCAN AUTOMOBILE Admin-Panel
          </p>
        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
