'use client'
import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleUpload = async () => {
    console.log('Upload button clicked')
    if (!file) return
    setStatus('Uploading...')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    if (res.ok) {
      setStatus(`✅ Ingested ${data.chunks_ingested} chunks (doc ID: ${data.document_id})`)
    } else {
      setStatus(`❌ Error: ${data.detail || 'Unknown error'}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl mb-4">🦷 Bonded Ingestion Demo</h1>
      <input
        type="file"
        onChange={(e) => {
          console.log("File selected", e.target.files?.[0])
          setFile(e.target.files?.[0] || null)
        }}
        className="mb-4" 
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload & Ingest
      </button>
      {status && <p className="mt-4">{status}</p>}
    </main>
  )
}
