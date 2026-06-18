import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Menu, LayoutDashboard, Users, Box, ShoppingCart, Settings, LogOut, Bell, Search } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Products', href: '/products', icon: Box },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className={cn("bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 hidden md:flex flex-col z-20", sidebarOpen ? 'w-64' : 'w-20')}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {sidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">NexusAdmin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link key={item.name} to={item.href} className={cn("flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-all", isActive ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100")}>
                <item.icon size={20} className={cn("mr-3", isActive ? "text-indigo-600 dark:text-indigo-400" : "")} />
                {sidebarOpen && item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
           <h1 className="text-lg font-bold">Workspace</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};