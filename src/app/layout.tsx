/*============Imports============*/
import { Sidebar } from '@/components/layout/Sidebar';
import { ToasterClient } from '@/shared/lib/components/ToasterClient';
import './globals.css';

/*============Metadata============*/
export const metadata = {
  title: 'SanaSpace Dashboard',
  description: 'Admin dashboard for managing doctors, built to slay',
  icons: {
    icon: '/favicon.ico', // Add your favicon path if available
  },
  openGraph: {
    title: 'SanaSpace Dashboard',
    description: 'Admin dashboard for managing doctors, built to slay',
    url: 'https://your-site-url.com', // Replace with your site URL
    siteName: 'SanaSpace',
    type: 'website',
  },
};

/*============RootLayout Component============*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className="bg-background text-foreground font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main 
            className="flex-1 transition-all duration-300 ease-in-out" 
            id="main-content"
            role="main"
          >
            {children}
          </main>
        </div>
        <ToasterClient />
      </body>
    </html>
  );
}