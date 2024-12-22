'use client'

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import { Sheet } from '@/types'

interface CodeEditorProps {
  sheetId: string;
  initialContent: string;
}

export default function CodeEditor({ sheetId, initialContent }: CodeEditorProps) {
  const [content, setContent] = useState(initialContent)
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.email) return;
  
    const channel = supabase
      .channel(`sheet:${sheetId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sheets',
          filter: `id=eq.${sheetId}`,
        },
        (payload) => {
          const newContent = (payload.new as Sheet).content;
          if (newContent !== content) {
            setContent(newContent);
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sheetId, session?.user?.email, content]);

  const handleEditorChange = async (value: string | undefined) => {
    if (!value) return

    setContent(value)
    await supabase
      .from('sheets')
      .update({ content: value, updated_at: new Date().toISOString() })
      .eq('id', sheetId)
  }

  return (
    <Editor
      height="70vh"
      defaultLanguage="javascript"
      value={content}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  )
}