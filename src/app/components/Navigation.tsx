'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLibraryStore } from '@/store/useLibraryStore';
import { BookOpen, User, LayoutDashboard, Database, LogOut } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { borrowings, user, logout } = useLibraryStore();
  const activeBorrowings = borrowings.length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">L.</div>
            <span className="font-semibold tracking-tight text-gray-900 hidden sm:block">LibSys</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/catalog" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${pathname.includes('/catalog') ? 'bg-gray-100/80 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
              <BookOpen className="w-4 h-4" /> Catalog
            </Link>

            {/* Only show Dashboard to regular logged-in users */}
            {user?.role === 'member' && (
              <Link href="/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${pathname.includes('/dashboard') ? 'bg-gray-100/80 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <LayoutDashboard className="w-4 h-4" /> My Workspace
                {activeBorrowings > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">{activeBorrowings}</span>
                )}
              </Link>
            )}

            {/* Only show Admin panel to Admins */}
            {user?.role === 'admin' && (
              <Link href="/admin" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${pathname === '/admin' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Database className="w-4 h-4" /> System Admin
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                Hi, {user.name}
              </span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all">
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}