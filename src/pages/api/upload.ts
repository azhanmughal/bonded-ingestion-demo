import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File as FormidableFile, Fields, Files } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'

// Disable Next.js built-in body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const form = formidable({ uploadDir: '/tmp', keepExtensions: true })

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ detail: err.message })

    const fileArray = files.file as FormidableFile[]
    const file = fileArray[0]

    const stream = fs.createReadStream(file.filepath)

    const formData = new FormData()
    formData.append('file', stream, {
      filename: file.originalFilename ?? 'upload.pdf', // Fixes string | null
      contentType: file.mimetype ?? 'application/pdf',
    })

    try {
      const ingestRes = await fetch(
        'https://your-fastapi-api.onrender.com/ingest',
        {
          method: 'POST',
          body: formData as unknown as BodyInit, // Fixes any
          headers: formData.getHeaders() as Record<string, string>, // Fixes any
        }
      )

      const data = await ingestRes.json()
      return res.status(ingestRes.status).json(data)
    } catch (error) {
      const err = error as Error
      return res.status(500).json({ detail: err.message })
    }
  })
}
