'use client'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Code Collab
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/sheets" className="hover:text-gray-300">
                My Sheets
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
              <div className="flex items-center gap-2">
              <Image
                src={session.user?.image || ''}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
                />
                <span>{session.user?.name}</span>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}