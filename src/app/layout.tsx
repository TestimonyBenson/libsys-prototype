import Navigation from './components/Navigation';
import { Toaster } from 'sonner'; // NEW: Import Toaster
import './globals.css';

export const metadata = {
  title: 'LibSys | Premium Library Management',
  description: 'Open-source, highly functional library management system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased selection:bg-gray-200 selection:text-gray-900">
      <body className="bg-[#fafafa] text-gray-900 min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
        
        {/* NEW: Add the global toaster with premium styling */}
        <Toaster 
          position="bottom-right" 
          richColors 
          toastOptions={{
            style: { borderRadius: '12px', padding: '16px' },
            className: 'font-medium shadow-xl border-gray-100'
          }} 
        />
      </body>
    </html>
  );
}