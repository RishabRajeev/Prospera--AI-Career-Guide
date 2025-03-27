import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prospera - AI Career Guidance',
  description: 'Your AI-powered career guidance platform',
  icons: {
    icon: '/prospera-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 transition-all duration-300">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
