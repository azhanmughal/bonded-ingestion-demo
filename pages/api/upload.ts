import type { NextApiRequest, NextApiResponse } from 'next'
import type { IncomingMessage } from 'http'
import { IncomingForm, Files, File as FormidableFile } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Custom function to parse the incoming form
const parseForm = (
  req: IncomingMessage
): Promise<{ files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })
    form.parse(req, (err, _fields, files) => {
      if (err) reject(err)
      else resolve({ files })
    })
  })
}

// Main handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' })
  }

  try {
    const { files } = await parseForm(req)

    const rawFile = files.file;
    const file: FormidableFile | undefined = Array.isArray(rawFile) ? rawFile[0] : rawFile;
    
    if (!file) {
      return res.status(400).json({ detail: 'No file provided' })
    }

    const stream = fs.createReadStream(file.filepath)
    const formData = new FormData()
    formData.append('file', stream, {
      filename: file.originalFilename ?? 'upload.pdf',
      contentType: file.mimetype ?? 'application/pdf',
    })

    const ingestRes = await fetch('https://bonded-ingestion-backend-production.up.railway.app/ingest', {
      method: 'POST',
      body: formData as unknown as BodyInit,
      headers: formData.getHeaders() as HeadersInit,
    })

    const data = await ingestRes.json()
    return res.status(ingestRes.status).json(data)
  } catch (err) {
    return res.status(500).json({
      detail: (err instanceof Error ? err.message : 'Unknown error'),
    })
  }
}
