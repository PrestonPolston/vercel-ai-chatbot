import 'server-only'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Handle image uploads
export async function POST(req: Request) {
  try {
    const files = await req.formData() // Parse the incoming FormData
    const uploadPromises = Array.from(files.entries()).map(
      async ([key, file]) => {
        if (file instanceof Blob) {
          const uniqueFileName = `${Date.now()}_${file.name}`

          // Upload the file to the Supabase bucket
          const { data, error } = await supabase.storage
            .from('images')
            .upload(`uploads/${uniqueFileName}`, file, {
              cacheControl: '3600',
              upsert: false
            })

          if (error) {
            console.error('Error uploading file:', error)
            return null
          }

          // Get the public URL of the uploaded file
          const publicUrl = supabase.storage
            .from('images')
            .getPublicUrl(data.path).publicURL

          return publicUrl
        }
        return null
      }
    )

    // Resolve all promises and filter out null values
    const publicUrls = (await Promise.all(uploadPromises)).filter(
      url => url !== null
    )

    return NextResponse.json({ urls: publicUrls }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error during image upload:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred', error: error.message },
      { status: 500 }
    )
  }
}
