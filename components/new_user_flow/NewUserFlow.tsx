'use client'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import ProfileStep from './ProfileStep'
import RoleSpecificStep from './RoleSpecificStep'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '../ui/button'

// Create a Supabase client configured for component usage
const supabase = createClientComponentClient()

// Define the FormState interface
interface FormState {
  user_id: number
  firstName: string
  lastName: string
  userType: 'homeowner' | 'contractor'
  address?: string
  companyName?: string
  skills?: string
}

const NewUserFlow = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formState, setFormState] = useState<FormState>({
    user_id: 0,
    firstName: '',
    lastName: '',
    userType: 'homeowner',
    address: '',
    companyName: '',
    skills: ''
  })

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }

  const handleFinalSubmit = async () => {
    const { firstName, lastName, userType, address, companyName, skills } =
      formState

    // Get the current user from Supabase
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      toast.error('Unable to retrieve user information.')
      return
    }

    // Create the user's profile in the profiles table and return the inserted row
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          user_type: userType
        }
      ])
      .select()
      .single() // Get just the newly created row

    if (profileError) {
      toast.error(profileError.message)
      return
    }

    const profileId = profileData.id // Get the profile_id from the created profile

    // Populate role-specific information
    if (userType === 'homeowner') {
      const { error: addressError } = await supabase
        .from('user')
        .insert([{ profile_id: profileId, address }]) // Use profile_id
      if (addressError) {
        toast.error(addressError.message)
        return
      }
    } else if (userType === 'contractor') {
      const { error: contractorError } = await supabase
        .from('contractor')
        .insert([{ profile_id: profileId, company_name: companyName, skills }]) // Use profile_id
      if (contractorError) {
        toast.error(contractorError.message)
        return
      }
    }

    toast.success('Account created successfully!')

    // Redirect to the appropriate home page based on user type
    router.push(userType === 'homeowner' ? '/user/home' : '/contractor/home')
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm">
        {currentStep === 1 && (
          <ProfileStep
            formState={formState}
            setFormState={setFormState}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <>
            <RoleSpecificStep
              formState={formState}
              setFormState={setFormState}
              userType={formState.userType}
              onNext={nextStep} // Handle any next steps if necessary
            />
            <Button
              onClick={handleFinalSubmit}
              className="mt-4" // Add margin for spacing
            >
              Submit
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default NewUserFlow
