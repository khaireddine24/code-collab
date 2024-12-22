'use client'

import { useState } from 'react'

interface ShareButtonProps {
  sheetId: string
}

export default function ShareButton({ sheetId }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/sheets/${sheetId}`
    await navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {isCopied ? 'Link Copied!' : 'Share Sheet'}
    </button>
  )
}