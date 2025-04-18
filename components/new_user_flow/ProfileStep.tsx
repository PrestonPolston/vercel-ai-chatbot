'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'

interface ProfileStepProps {
  formState: {
    firstName: string
    lastName: string
    userType: 'user' | 'contractor'
  }
  setFormState: React.Dispatch<
    React.SetStateAction<{
      firstName: string
      lastName: string
      userType: 'user' | 'contractor'
    }>
  >
  onNext: () => void
  onBack: () => void
}

const ProfileStep: React.FC<ProfileStepProps> = ({
  formState,
  setFormState,
  onNext,
  onBack
}) => {
  return (
    <fieldset className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <Label>First Name</Label>
        <Input
          name="firstName"
          type="text"
          value={formState.firstName}
          onChange={e =>
            setFormState(prev => ({ ...prev, firstName: e.target.value }))
          }
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <Label>Last Name</Label>
        <Input
          name="lastName"
          type="text"
          value={formState.lastName}
          onChange={e =>
            setFormState(prev => ({
              ...prev,
              lastName: e.target.value
            }))
          }
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <Label>User Type</Label>
        <select
          name="userType"
          value={formState.userType}
          onChange={e =>
            setFormState(prev => ({
              ...prev,
              userType: e.target.value as 'user' | 'contractor'
            }))
          }
          className="rounded-md border border-gray-300 bg-background p-2 text-foreground" // Apply similar styles to match your Input
        >
          <option value="user">Homeowner</option>
          <option value="contractor">Contractor</option>
        </select>
      </div>
      <div className="flex gap-x-2">
        <Button onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </fieldset>
  )
}

export default ProfileStep
