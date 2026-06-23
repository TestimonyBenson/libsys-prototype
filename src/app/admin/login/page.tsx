'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLibraryStore } from '@/store/useLibraryStore';
import { ShieldAlert, KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('');
  const router = useRouter();
  const login = useLibraryStore((state) => state.login);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Admin Auth: Login as admin and redirect to secure dashboard
    login('System Administrator', 'admin');
    router.push('/admin');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>

        <div className="p-8 sm:p-10 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Staff Portal</h1>
            <p className="text-sm text-gray-400 mt-2">Authorized library personnel only.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Passcode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="password" 
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter access code"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>

      <Link href="/" className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Return to Public Catalog
      </Link>
    </div>
  );
}