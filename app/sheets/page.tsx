'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Sheet } from '@/types'

export default function SheetsPage() {
  const { data: session } = useSession()
  const [sheets, setSheets] = useState<Sheet[]>([])

  useEffect(() => {
    if (!session?.user?.email) return
    loadSheets()
  }, [session?.user?.email])

  const loadSheets = async () => {
    const { data } = await supabase
      .from('sheets')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (data) setSheets(data)
  }

  const createNewSheet = async () => {
    if (!session?.user?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('sheets')
        .insert({
          title: 'Untitled Sheet',
          content: '// Start coding here',
          owner_id: session.user.email
        })
        .select()
        .single();
  
      if (error) throw error;
      if (data) setSheets([data, ...sheets]);
      
    } catch (error) {
      console.error('Error creating sheet:', error);
    }
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Sheets</h1>
        <button
          onClick={createNewSheet}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New Sheet
        </button>
      </div>
      <div className="grid gap-4">
        {sheets.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/sheets/${sheet.id}`}
            className="p-4 border rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{sheet.title}</h2>
            <p className="text-gray-500">
              Last updated: {new Date(sheet.updated_at).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}