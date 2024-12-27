"use client"

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { StickyNote, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" />
          Code Collab
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="relative" ref={popoverRef}>
              <button
                onClick={() => setShowPopover(!showPopover)}
                className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <Image
                  src={session.user?.image || ''}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>{session.user?.name}</span>
                {showPopover ? 
                  <ChevronUp className="w-4 h-4" /> : 
                  <ChevronDown className="w-4 h-4" />
                }
              </button>

              {showPopover && (
                <div className="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg py-2 min-w-[200px]">
                  <Link
                    href="/sheets"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-600 transition-colors"
                  >
                    <StickyNote className="w-4 h-4" />
                    <span>My Sheets</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-gray-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}