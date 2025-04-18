// components/project-stepper/steps/DetailsStep.tsx
import React from 'react'
import { Button } from '@/components/ui/button'

interface DetailsStepProps {
  description: string
  setDescription: (desc: string) => void
  currentImages: string[]
  setCurrentImages: (urls: string[]) => void
  inspirationImages: string[]
  setInspirationImages: (urls: string[]) => void
  onSubmit: (projectData: any) => void
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  description,
  setDescription,
  currentImages,
  setCurrentImages,
  inspirationImages,
  setInspirationImages,
  onSubmit
}) => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'current' | 'inspiration'
  ) => {
    const files = event.target.files
    const newUrls: string[] = []

    if (files) {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!

      // Loop through each selected file
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(
          `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${file.name}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: formData
          }
        )

        if (!response.ok) {
          const errorMessage = await response.text()
          console.error(`Error uploading file: ${errorMessage}`)

          continue
        }

        // Construct the public URL for accessing the uploaded file
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${file.name}`
        newUrls.push(publicUrl)
      }

      // Update the state with either current or inspiration images
      if (type === 'current') {
        setCurrentImages([...currentImages, ...newUrls])
      } else {
        setInspirationImages([...inspirationImages, ...newUrls])
      }
    }
  }

  const handleSubmit = () => {
    const projectData = {
      description,
      currentImages,
      inspirationImages
    }

    console.log('Submitting project data:', projectData)

    onSubmit(projectData)
  }

  return (
    <div>
      <h3>Project Details</h3>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Enter a short description of the project"
        rows={4}
        className="w-full resize-none rounded border border-border bg-input p-2 text-foreground focus:outline-none focus:ring focus:ring-ring"
      />

      <div>
        <h4 className="mb-2 text-lg font-semibold">
          Upload Current Area Images
        </h4>
        <input
          type="file"
          multiple
          onChange={e => handleFileUpload(e, 'current')}
          className="file-input"
        />
      </div>
      <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold">
          Upload Inspirational Images
        </h4>
        <input
          type="file"
          multiple
          onChange={e => handleFileUpload(e, 'inspiration')}
          className="file-input"
        />
      </div>

      <Button onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Submit Project
      </Button>
    </div>
  )
}

export default DetailsStep
