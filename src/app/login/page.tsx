'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLibraryStore } from '@/store/useLibraryStore';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const login = useLibraryStore((state) => state.login);

  // NEW: State to capture what the user actually types
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // PROTOTYPE MAGIC: For returning users, we extract a nice name from their email 
      // (e.g., "john.doe@email.com" becomes "John doe")
      const extractedName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      
      login(formattedName || 'Returning Member', 'member');
    } else {
      // For new sign-ups, we pass exactly what they typed into the "Full Name" box
      login(name || 'New Member', 'member');
    }
    
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 animate-in fade-in duration-500">
      
      <Link href="/" className="absolute top-8 md:top-12 left-6 md:left-12 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-6">
          <div className="p-8 sm:p-10">
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-sm">
                L.
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-2">
                {isLogin ? 'Enter your details to access your workspace.' : 'Sign up to start borrowing library resources.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    {/* NEW: Map the input directly to our 'name' state */}
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-medium rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all sm:text-sm" 
                      placeholder="e.g. David Thomas" 
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  {/* NEW: Map the input directly to our 'email' state */}
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-medium rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all sm:text-sm" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-gray-900">Password</label>
                  {isLogin && (
                    <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input 
                    type="password" 
                    required 
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-medium rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all sm:text-sm" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full mt-8 py-3.5 px-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all active:scale-95 shadow-md">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-gray-900 hover:underline transition-all">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
            
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <Link href="/admin/login" className="text-sm font-bold text-gray-700 hover:text-gray-900 hover:underline transition-all">
              Staff Portal Login
            </Link>
          </div>
          <p className="text-xs font-medium text-gray-500">
            Need administrative access? Please contact your system administrator to elevate your account privileges.
          </p>
        </div>

      </div>
    </div>
  );
}