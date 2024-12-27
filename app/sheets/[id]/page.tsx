'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CodeEditor from '@/components/CodeEditor'
import ShareButton from '@/components/ShareButton'
import { Sheet } from '@/types'
import Spinner from '@/components/Spinner'

export default function SheetPage() {
  const params = useParams()
  const [sheet, setSheet] = useState<Sheet | null>(null)

  const loadSheet = useCallback(async () => {
    const { data } = await supabase
      .from('sheets')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data) setSheet(data)
  }, [params.id])

  useEffect(() => {
    loadSheet()
  }, [loadSheet])

  if (!sheet) return <Spinner/>

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{sheet.title}</h1>
        <ShareButton sheetId={sheet.id} />
      </div>
      <CodeEditor sheetId={sheet.id} initialContent={sheet.content} />
    </div>
  )
}