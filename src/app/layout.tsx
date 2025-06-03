import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToasterClient } from '@/shared/lib/components/ToasterClient';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SanaSpace Dashboard',
  description: 'Hospital Healthcare Dashboard Integration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}>
        <div className="flex min-h-screen">
          {/* Sidebar - Always visible on desktop, toggled on mobile */}
          <aside className="w-64 flex-shrink-0 border-r border-border sm:flex hidden flex-col h-full fixed inset-y-0 left-0 z-30">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full p-space-md md:p-space-lg bg-surface rounded-l-radius-md sm:ml-64 shadow-sm">
            {children}
          </main>
        </div>
        <ToasterClient />
      </body>
    </html>
  );
}