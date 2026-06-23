'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLibraryStore, Book } from '@/store/useLibraryStore';
import { Database, Users, Activity, Lock, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const { books, borrowings, user, addBook, updateBook, deleteBook } = useLibraryStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    total: 1,
    coverColor: 'bg-blue-500'
  });

  // Calculate metrics
  const totalBooks = books.reduce((acc, book) => acc + book.total, 0);
  const totalAvailable = books.reduce((acc, book) => acc + book.available, 0);
  const activeLoans = borrowings.length;

  // Route Protection
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [user, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 animate-pulse">
        <Lock className="w-10 h-10 mb-4 text-gray-300" />
        <p className="font-medium">Verifying credentials...</p>
      </div>
    );
  }

  // Modal Handlers
  const openModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({ 
        title: book.title, 
        author: book.author, 
        isbn: book.isbn, 
        total: book.total, 
        coverColor: book.coverColor 
      });
    } else {
      setEditingBook(null);
      setFormData({ 
        title: '', 
        author: '', 
        isbn: '', 
        total: 1, 
        coverColor: 'bg-blue-500' 
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook.id, formData);
      toast.success('Book updated', { description: 'Inventory details have been saved.' });
    } else {
      addBook(formData);
      toast.success('Book added', { description: `"${formData.title}" added to catalog.` });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (editingBook && confirm('Are you sure you want to delete this book? This will clear all active loans for it.')) {
      deleteBook(editingBook.id);
      toast.error('Book deleted', { description: 'The book and all its loan records were removed.' });
      closeModal();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Admin</h1>
          <p className="text-gray-500 mt-2">Manage library inventory and monitor system metrics.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 hover:shadow-md transition-all active:scale-95"
        >
          + Add New Book
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Inventory</p>
            <p className="text-2xl font-bold text-gray-900">{totalBooks} <span className="text-sm font-normal text-gray-500">books</span></p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Available on Shelf</p>
            <p className="text-2xl font-bold text-gray-900">{totalAvailable} <span className="text-sm font-normal text-gray-500">books</span></p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Loans</p>
            <p className="text-2xl font-bold text-gray-900">{activeLoans} <span className="text-sm font-normal text-gray-500">records</span></p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="py-4 px-6">Book Title & Author</th>
                <th className="py-4 px-6">ISBN</th>
                <th className="py-4 px-6 text-right">Availability</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500 font-medium">{book.author}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-mono font-medium">{book.isbn}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                      <span className={`w-2 h-2 rounded-full ${book.available > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm font-bold text-gray-700">
                        {book.available} <span className="text-gray-400 font-medium">/ {book.total}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => openModal(book)} 
                      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Edit details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Action Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingBook ? 'Edit Book Details' : 'Add New Book'}</h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Book Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 font-semibold rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
                  placeholder="e.g. The Pragmatic Programmer" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Author</label>
                <input 
                  type="text" 
                  required 
                  value={formData.author} 
                  onChange={e => setFormData({...formData, author: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 font-semibold rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
                  placeholder="e.g. David Thomas" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">ISBN</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.isbn} 
                    onChange={e => setFormData({...formData, isbn: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 font-mono font-semibold rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
                    placeholder="978-..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Total Copies</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    value={formData.total} 
                    onChange={e => setFormData({...formData, total: parseInt(e.target.value) || 1})} 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 font-semibold rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Cover Color</label>
                <div className="flex gap-3">
                  {['bg-blue-500', 'bg-emerald-600', 'bg-slate-800', 'bg-purple-600', 'bg-rose-500'].map(color => (
                    <button 
                      key={color} 
                      type="button" 
                      onClick={() => setFormData({...formData, coverColor: color})} 
                      className={`w-8 h-8 rounded-full shadow-sm transition-transform ${color} ${formData.coverColor === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-900' : 'hover:scale-105'}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                {editingBook ? (
                  <button 
                    type="button" 
                    onClick={handleDelete} 
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                ) : <div></div>}
                
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                  >
                    {editingBook ? 'Save Changes' : 'Add Book'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}