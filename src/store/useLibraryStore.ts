import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  total: number;
  available: number;
  coverColor: string;
  waitlist: string[];
};

export type BorrowRecord = {
  id: string;
  bookId: string;
  title: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'overdue' | 'returned';
  userName: string;
};

export type User = {
  name: string;
  role: 'member' | 'admin';
};

interface LibraryState {
  books: Book[];
  borrowings: BorrowRecord[];
  history: BorrowRecord[];
  user: User | null;
  
  borrowBook: (bookId: string) => void;
  returnBook: (recordId: string, bookId: string) => void;
  joinWaitlist: (bookId: string) => void;
  
  login: (name: string, role: 'member' | 'admin') => void;
  logout: () => void;

  addBook: (book: Omit<Book, 'id' | 'available' | 'waitlist'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
}

const INITIAL_BOOKS: Book[] = [
  { id: '1', title: 'Refactoring UI', author: 'Adam Wathan & Steve Schoger', isbn: '978-0134494166', total: 5, available: 5, coverColor: 'bg-blue-500', waitlist: [] },
  { id: '2', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-1449373320', total: 3, available: 1, coverColor: 'bg-emerald-600', waitlist: [] },
  { id: '3', title: 'Clean Architecture', author: 'Robert C. Martin', isbn: '978-0134494166', total: 2, available: 0, coverColor: 'bg-slate-800', waitlist: [] },
];

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      books: INITIAL_BOOKS,
      borrowings: [],
      history: [],
      user: null,
      
      borrowBook: (bookId) => set((state) => {
        const book = state.books.find(b => b.id === bookId);
        if (!book || book.available === 0 || !state.user) return state;
        
        const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 14);
        
        const newRecord: BorrowRecord = { 
          id: Math.random().toString(36).substring(7), 
          bookId, 
          title: book.title, 
          borrowDate: new Date().toISOString(), 
          dueDate: dueDate.toISOString(), 
          status: 'active',
          userName: state.user.name
        };
        
        return { 
          books: state.books.map(b => b.id === bookId ? { ...b, available: b.available - 1 } : b), 
          borrowings: [...state.borrowings, newRecord] 
        };
      }),

      returnBook: (recordId, bookId) => set((state) => {
        const book = state.books.find(b => b.id === bookId);
        const recordToReturn = state.borrowings.find(r => r.id === recordId);
        const remainingBorrowings = state.borrowings.filter(r => r.id !== recordId);

        if (!recordToReturn) return state;

        const archivedRecord: BorrowRecord = {
          ...recordToReturn,
          status: 'returned',
          returnDate: new Date().toISOString()
        };

        if (book && book.waitlist.length > 0) {
          const nextUser = book.waitlist[0];
          const newWaitlist = book.waitlist.slice(1);
          
          const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 14);
          const newRecord: BorrowRecord = {
            id: Math.random().toString(36).substring(7),
            bookId,
            title: book.title,
            borrowDate: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
            status: 'active',
            userName: nextUser 
          };

          return {
            borrowings: [...remainingBorrowings, newRecord],
            history: [...state.history, archivedRecord],
            books: state.books.map(b => b.id === bookId ? { ...b, waitlist: newWaitlist } : b)
          };
        }

        return {
          borrowings: remainingBorrowings, 
          history: [...state.history, archivedRecord],
          books: state.books.map(b => b.id === bookId ? { ...b, available: b.available + 1 } : b)
        };
      }),

      joinWaitlist: (bookId) => set((state) => {
        if (!state.user) return state;
        return {
          books: state.books.map(b => 
            b.id === bookId && !b.waitlist.includes(state.user!.name) 
              ? { ...b, waitlist: [...b.waitlist, state.user!.name] } 
              : b
          )
        };
      }),

      login: (name, role) => set(() => ({ user: { name, role } })),
      
      logout: () => set(() => ({ user: null })),

      addBook: (bookData) => set((state) => ({
        books: [...state.books, { 
          ...bookData, 
          id: Math.random().toString(36).substring(7),
          available: bookData.total,
          waitlist: []
        }]
      })),

      updateBook: (id, updates) => set((state) => ({
        books: state.books.map(b => {
          if (b.id !== id) return b;
          const diff = updates.total !== undefined ? updates.total - b.total : 0;
          return { ...b, ...updates, available: Math.max(0, b.available + diff) };
        })
      })),

      deleteBook: (id) => set((state) => ({
        books: state.books.filter(b => b.id !== id),
        borrowings: state.borrowings.filter(record => record.bookId !== id)
      }))
    }),
    {
      name: 'libsys-storage', // This is the key used in localStorage
    }
  )
);