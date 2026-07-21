import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TechPulse — Engineering & System Architecture',
  description: 'In-depth engineering articles, architecture benchmarks, and software design patterns.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-white text-gray-900 antialiased">
      <body className={`${inter.className} min-h-screen flex flex-col justify-between bg-white text-gray-900`}>
        <div>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 min-h-[calc(100vh-200px)]">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
