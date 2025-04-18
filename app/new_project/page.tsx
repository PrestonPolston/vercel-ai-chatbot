'use client'

import React, { useState } from 'react'
import { redirect } from 'next/navigation'
import { Chat } from '@/components/chat'
import Stepper from '@/components/project-stepper/Stepper'
import { steps } from '@/components/project-stepper/Steps'

const NewProject: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [projectData, setProjectData] = useState({
    budget: undefined as number | undefined,
    selectedRoom: '',
    description: '',
    currentImages: [] as File[],
    inspirationImages: [] as File[]
  })

  const updateProjectData = (field: string, value: any) => {
    setProjectData(prevData => ({
      ...prevData,
      [field]: value
    }))
  }

  const createProject = async () => {
    const formData = new FormData()

    // Append current images and inspiration images to formData
    projectData.currentImages.forEach(file => {
      console.log('Appending current image file to FormData:', file)
      formData.append('images', file)
    })

    projectData.inspirationImages.forEach(file => {
      console.log('Appending inspiration image file to FormData:', file)
      formData.append('images', file)
    })

    console.log('FormData before upload:', formData)

    // Upload images to the API
    const uploadResponse = await fetch('/api/images', {
      method: 'POST',
      body: formData
    })

    let currentImageUrls: string[] = []
    let inspirationImageUrls: string[] = []

    if (uploadResponse.ok) {
      console.log('Upload response:', uploadResponse)

      const { urls } = await uploadResponse.json()
      console.log('Uploaded image URLs:', urls)

      // Split the URLs into current and inspiration images
      currentImageUrls = urls.slice(0, projectData.currentImages.length)
      inspirationImageUrls = urls.slice(projectData.currentImages.length)

      console.log('Current Image URLs:', currentImageUrls)
      console.log('Inspiration Image URLs:', inspirationImageUrls)
    } else {
      const error = await uploadResponse.json()
      console.error('Error uploading images:', error)
      return
    }

    // Prepare the final project data with the image URLs
    const finalProjectData = {
      ...projectData,
      currentImages: projectData.currentImages,
      inspirationImages: projectData.currentImages
    }

    console.log('Final Project Data before sending to API:', finalProjectData)

    // Call the project creation API with the complete project data
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalProjectData)
    })

    if (response.ok) {
      const responseData = await response.json()
      console.log('Project created successfully:', responseData)
      redirect('/')
    } else {
      const error = await response.json()
      console.error('Error creating project:', error)
    }
  }

  return (
    <>
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
        <div className="w-full max-w-sm">
          {/* <h1>New Project</h1>
          <Stepper
            activeStep={activeStep}
            steps={steps.map(step => {
              return {
                ...step,
                content: step.content({
                  budget: projectData.budget,
                  setBudget: (value: number) =>
                    updateProjectData('budget', value),
                  selectedRoom: projectData.selectedRoom,
                  setSelectedRoom: (value: string) =>
                    updateProjectData('selectedRoom', value),
                  description: projectData.description,
                  setDescription: (value: string) =>
                    updateProjectData('description', value),
                  currentImages: projectData.currentImages,
                  setCurrentImages: (files: File[]) =>
                    updateProjectData('currentImages', files),
                  inspirationImages: projectData.inspirationImages,
                  setInspirationImages: (files: File[]) =>
                    updateProjectData('inspirationImages', files),
                  onSubmit: createProject
                })
              }
            })}
            onStepChange={setActiveStep}
          /> */}
          <Chat />
        </div>
      </div>
    </>
  )
}

export default NewProject
