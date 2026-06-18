import React from 'react';
import { Users, Box, ShoppingCart, DollarSign, ArrowUpRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '10,245', icon: Users, trend: '+12.5%' },
    { label: 'Total Products', value: '1,432', icon: Box, trend: '+3.2%' },
    { label: 'Pending Orders', value: '8,549', icon: ShoppingCart, trend: '+15.8%' },
    { label: 'Revenue', value: '$84,392', icon: DollarSign, trend: '+8.1%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor your store's performance and analytics.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl">
                <stat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};