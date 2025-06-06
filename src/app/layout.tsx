import '../styles/main.css'
import { cn } from '@/shared/utils/cn'
import { Sidebar } from '@/components/layout/Sidebar'
import { ToasterClient } from '@/shared/lib/components/ToasterClient'

export const metadata = {
  title: 'SanaSpace Dashboard',
  description: 'Admin dashboard for managing doctors, built to slay',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={cn(
          'bg-gray-50 text-gray-900 font-sans min-h-screen',
          'transition-colors duration-300 ease-in-out'
        )}
      >
        <div className="flex min-h-screen">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <main
            id="main-content"
            className="flex-1 transition-all duration-300 ease-in-out"
            role="main"
          >
            {children}
          </main>
        </div>

        {/* Toast Notifications */}
        <ToasterClient />
      </body>
    </html>
  )
}