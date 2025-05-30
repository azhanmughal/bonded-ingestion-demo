export const runtime = 'nodejs'

import { IncomingForm, Files } from 'formidable'
import type { IncomingMessage } from 'http'
import fs from 'fs'
import FormData from 'form-data'

const parseForm = (req: IncomingMessage): Promise<{ files: Files }> =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })
    form.parse(req, (_err, _fields, files) => {
      if (_err) reject(_err)
      else resolve({ files })
    })
  })

// src/app/api/upload/route.ts
export async function POST(req: Request) {
  const reqTyped = req as unknown as IncomingMessage

  try {
    console.log("🔄 Received file upload POST")

    const { files } = await parseForm(reqTyped)
    console.log("✅ Parsed form data:", files)

    const file = files.file?.[0]
    if (!file) {
      console.log("⚠️ No file found in uploaded form data")
      return new Response(JSON.stringify({ detail: 'No file provided' }), { status: 400 })
    }

    console.log(`📄 Preparing to stream file: ${file.originalFilename}`)

    const stream = fs.createReadStream(file.filepath)
    const formData = new FormData()
    formData.append('file', stream, {
      filename: file.originalFilename || 'upload.pdf',
      contentType: file.mimetype || 'application/pdf',
    })

    console.log("📡 Sending file to ingestion backend...")

    const ingestRes = await fetch('https://bonded-ingestion-backend-production.up.railway.app/ingest', {
      method: 'POST',
      body: formData as unknown as BodyInit,
      headers: formData.getHeaders() as HeadersInit,
    })

    console.log("✅ Received response from ingestion backend:", ingestRes.status)

    const data = await ingestRes.json()
    console.log("📦 Parsed JSON response from ingestion backend:", data)

    return new Response(JSON.stringify(data), { status: ingestRes.status })
  } catch (err) {
    console.error("❌ Upload route failed:", err)
    return new Response(JSON.stringify({ detail: (err as Error).message }), { status: 500 })
  }
}
