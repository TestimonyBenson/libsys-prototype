'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Search, BookMarked, AlertCircle, Library, Hourglass } from 'lucide-react';
import { toast } from 'sonner';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const { books, borrowBook, joinWaitlist, user } = useLibraryStore();

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  const handleBorrow = (bookId: string, bookTitle: string) => {
    // SECURITY GATE: Redirect unauthenticated users
    if (!user) {
      router.push('/login');
      return;
    }
    
    borrowBook(bookId);
    
    // Premium Toast Notification
    toast.success('Successfully borrowed', {
      description: `"${bookTitle}" has been added to your workspace.`,
    });
  };

  const handleWaitlist = (bookId: string, bookTitle: string, waitlist: string[]) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!waitlist.includes(user.name)) {
      joinWaitlist(bookId);
      toast.success('Joined Waitlist', { 
        description: `You will receive "${bookTitle}" when it is returned.` 
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Library className="w-8 h-8 text-gray-700" />
            Library Catalog
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl font-medium">
            Browse our collection of engineering, architecture, and design resources. 
            Select a book to instantly borrow it to your workspace.
          </p>
        </div>

        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all sm:text-sm shadow-sm"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isAvailable = book.available > 0;
            const isWaiting = user ? book.waitlist.includes(user.name) : false;

            return (
              <div 
                key={book.id} 
                className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Book Cover Placeholder */}
                <div className={`h-32 w-full ${book.coverColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white font-mono text-xs font-medium opacity-90">
                    ISBN: {book.isbn}
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 mt-1">{book.author}</p>
                    </div>
                  </div>

                  {/* Availability & Actions */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
                      <span className="text-sm font-bold text-gray-700">
                        {book.available} <span className="font-medium text-gray-400">of {book.total} available</span>
                      </span>
                    </div>

                    {isAvailable ? (
                      <button
                        onClick={() => handleBorrow(book.id, book.title)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md active:scale-95 transition-all duration-200"
                      >
                        <BookMarked className="w-4 h-4" /> Borrow
                      </button>
                    ) : (
                      <button
                        onClick={() => handleWaitlist(book.id, book.title, book.waitlist)}
                        disabled={isWaiting}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                          isWaiting
                            ? 'bg-orange-50 text-orange-700 cursor-not-allowed border border-orange-200'
                            : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 active:scale-95 shadow-sm'
                        }`}
                      >
                        {isWaiting ? (
                          <>
                            <Hourglass className="w-4 h-4" /> On Waitlist
                          </>
                        ) : (
                          'Join Waitlist'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No books found</h3>
          <p className="mt-2 font-medium text-gray-500">
            We couldn't find anything matching "{searchQuery}". Try adjusting your search.
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 px-5 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}