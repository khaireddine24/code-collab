import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Code Collaboration App',
  description: 'Real-time code collaboration platform',
  icons:{
    icon: '/logo.svg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg"/>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}