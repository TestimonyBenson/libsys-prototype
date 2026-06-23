'use client';

import { useLibraryStore } from '@/store/useLibraryStore';
import { Clock, BookOpenCheck, AlertTriangle, ArrowRight, Hourglass, History, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { borrowings, history, books, returnBook, user } = useLibraryStore();

  // Filter items specific to the logged-in user
  const userBorrowings = borrowings.filter(record => record.userName === user?.name);
  const userWaitlists = books.filter(book => book.waitlist.includes(user?.name || ''));
  const userHistory = history.filter(record => record.userName === user?.name).reverse(); // Reverse for newest first

  const handleReturn = (recordId: string, bookId: string, title: string) => {
    returnBook(recordId, bookId);
    toast.success('Book returned', {
      description: `"${title}" has been removed from your workspace and logged in your history.`,
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Workspace</h1>
        <p className="text-gray-500 mt-2 font-medium">
          Manage your active borrowings, waitlists, and view your reading history.
        </p>
      </div>

      {/* Active Borrowings Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpenCheck className="w-5 h-5 text-gray-400" /> Currently Borrowed
        </h2>
        
        {userBorrowings.length > 0 ? (
          <div className="grid gap-4">
            {userBorrowings.map((record) => {
              const isOverdue = new Date(record.dueDate) < new Date() || record.status === 'overdue';

              return (
                <div key={record.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border bg-white transition-all duration-200 ${isOverdue ? 'border-red-200 shadow-sm' : 'border-gray-200 hover:shadow-md'}`}>
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className={`p-3 rounded-xl ${isOverdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                      {isOverdue ? <AlertTriangle className={`w-6 h-6 text-red-500`} /> : <BookOpenCheck className="w-6 h-6 text-gray-700" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{record.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Borrowed: {new Date(record.borrowDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <p className={`text-sm font-bold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        Due: {new Date(record.dueDate).toLocaleDateString()}
                      </p>
                      {isOverdue && <span className="inline-block mt-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-extrabold tracking-wide rounded-md">OVERDUE</span>}
                    </div>
                    <button onClick={() => handleReturn(record.id, record.bookId, record.title)} className="w-full sm:w-auto px-5 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95">
                      Return Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-6 bg-white rounded-2xl border border-gray-200 border-dashed text-center">
            <p className="text-gray-500 font-medium mb-4">Your workspace is clear.</p>
            <Link href="/catalog" className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95">
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Waitlist Section */}
      {userWaitlists.length > 0 && (
        <div className="pt-8 border-t border-gray-200/60">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-gray-400" /> My Waitlist
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userWaitlists.map((book) => {
              const queuePosition = book.waitlist.indexOf(user?.name || '') + 1;
              return (
                <div key={book.id} className="p-5 rounded-2xl border border-gray-200 bg-white flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{book.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100">
                      Position: {queuePosition}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reading History Section */}
      {userHistory.length > 0 && (
        <div className="pt-8 border-t border-gray-200/60">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" /> Reading History
          </h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="py-4 px-6">Book Title</th>
                  <th className="py-4 px-6 hidden sm:table-cell">Borrowed On</th>
                  <th className="py-4 px-6">Returned On</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{record.title}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-500 hidden sm:table-cell">
                      {new Date(record.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-500">
                      {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}