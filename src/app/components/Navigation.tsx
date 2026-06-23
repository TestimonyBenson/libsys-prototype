'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLibraryStore } from '@/store/useLibraryStore';
import { BookOpen, User, LayoutDashboard, Database, LogOut, Menu, X } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { borrowings, user, logout } = useLibraryStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeBorrowings = borrowings.length;

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              L.
            </div>
            <span className="font-bold tracking-tight text-gray-900 hidden sm:block">
              LibSys
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/catalog" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                pathname.includes('/catalog') ? 'bg-gray-100/80 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Catalog
            </Link>

            {user?.role === 'member' && (
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                  pathname.includes('/dashboard') ? 'bg-gray-100/80 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> My Workspace
                {activeBorrowings > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                    {activeBorrowings}
                  </span>
                )}
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                  pathname === '/admin' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Database className="w-4 h-4" /> System Admin
              </Link>
            )}
          </div>
        </div>
        
        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-600">
                Hi, {user.name}
              </span>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors z-50"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 top-16 bg-white z-40 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6 gap-2 h-full overflow-y-auto">
          
          <div className="pb-4 mb-4 border-b border-gray-100 flex flex-col gap-2">
            <Link 
              href="/catalog" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                pathname.includes('/catalog') ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5 text-gray-400" /> Catalog
            </Link>

            {user?.role === 'member' && (
              <Link 
                href="/dashboard" 
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  pathname.includes('/dashboard') ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 text-gray-400" /> My Workspace
                </div>
                {activeBorrowings > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                    {activeBorrowings}
                  </span>
                )}
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  pathname === '/admin' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Database className="w-5 h-5 text-gray-400" /> System Admin
              </Link>
            )}
          </div>

          <div className="mt-auto pb-8">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="font-bold text-gray-900 truncate">{user.name}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-base font-bold text-red-600 bg-red-50 rounded-xl active:scale-95 transition-all"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-base font-bold text-white bg-gray-900 rounded-xl shadow-md active:scale-95 transition-all"
              >
                <User className="w-5 h-5" /> Sign In to Workspace
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}