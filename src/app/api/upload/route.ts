// import { IncomingForm, Files } from 'formidable'
// import type { IncomingMessage } from 'http'
// import fs from 'fs'
// import FormData from 'form-data'

// const parseForm = (req: IncomingMessage): Promise<{ files: Files }> =>
//   new Promise((resolve, reject) => {
//     const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true })
//     form.parse(req, (_err, _fields, files) => {
//       if (_err) reject(_err)
//       else resolve({ files })
//     })
//   })

export async function POST() {
    return new Response("Hello from /api/upload", { status: 200 });
//   const reqTyped = req as unknown as IncomingMessage

//   try {
//     const { files } = await parseForm(reqTyped)
//     const file = files.file?.[0]
//     if (!file) {
//       return new Response(JSON.stringify({ detail: 'No file provided' }), { status: 400 })
//     }

//     const stream = fs.createReadStream(file.filepath)
//     const formData = new FormData()
//     formData.append('file', stream, {
//       filename: file.originalFilename || 'upload.pdf',
//       contentType: file.mimetype || 'application/pdf',
//     })

//     const ingestRes = await fetch('https://bonded-ingestion-backend-production.up.railway.app/ingest', {
//       method: 'POST',
//       body: formData as unknown as BodyInit,
//       headers: formData.getHeaders() as HeadersInit,
//     })

//     const data = await ingestRes.json()
//     return new Response(JSON.stringify(data), { status: ingestRes.status })
//   } catch (err) {
//     return new Response(JSON.stringify({ detail: (err as Error).message }), { status: 500 })
//   }
}
