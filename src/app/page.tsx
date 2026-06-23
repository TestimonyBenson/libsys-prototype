'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-900 mb-8 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          LibSys v1.0 is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl">
          The modern standard for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
            library management.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl">
          A high-performance, open-source system for cataloging resources, tracking active loans, and automating return reminders seamlessly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/catalog" 
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Browse Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 border border-gray-200 font-medium rounded-xl hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center"
          >
            Sign In to Workspace
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-5xl py-16 border-t border-gray-200/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Live Inventory</h3>
            <p className="text-gray-500">Real-time tracking of available assets, total copies, and active circulation across the entire catalog.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Logistics</h3>
            <p className="text-gray-500">Intelligent due-date calculation and automated flagging for overdue materials to ensure rotation.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Oversight</h3>
            <p className="text-gray-500">Dedicated high-level dashboards for administrators to manage user records and system health.</p>
          </div>
        </div>
      </section>
    </div>
  );
}