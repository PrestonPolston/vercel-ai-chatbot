'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-label'
import { cn } from '@/lib/utils' // Ensure this utility function exists for classNames

interface FormState {
  profile_id?: number
  address?: string
  companyName?: string
  skills?: string
}

interface RoleSpecificStepProps {
  formState: FormState
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  userType: 'homeowner' | 'contractor'
  onSubmit: () => void
}

const RoleSpecificStep: React.FC<RoleSpecificStepProps> = ({
  formState,
  setFormState,
  userType,
  onSubmit
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentInput, setCurrentInput] = useState(formState.address || '')
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false) // Close dropdown if clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleFindAddress = useCallback(async (text: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
    if (!apiKey) {
      console.error('API key is not defined')
      return
    }
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: text,
            format: 'json',
            apiKey: apiKey
          }
        }
      )

      if (response.data && response.data.results) {
        const results = response.data.results.map(
          (result: any) => result.formatted
        )
        setSuggestions(results)
        setIsDropdownOpen(results.length > 0)
      } else {
        setSuggestions([])
        setIsDropdownOpen(false)
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }, [])

  const handleSelectAddress = (address: string) => {
    setCurrentInput(address)
    setFormState(prev => ({ ...prev, address }))
    setSuggestions([])
    setIsDropdownOpen(false) // Close dropdown after selection
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value
    setCurrentInput(address)
    setFormState(prev => ({ ...prev, address }))
    handleFindAddress(address)
  }

  return (
    <fieldset className="flex flex-col gap-y-4">
      {userType === 'homeowner' && (
        <div className="relative flex flex-col gap-y-1">
          <Label>Address</Label>
          <Input
            name="address"
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            placeholder="Type your address..."
            onFocus={() => setIsDropdownOpen(true)} // Open dropdown on input focus
          /><div>
          {isDropdownOpen && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className={cn(
                'absolute z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-md',
                'mt-0' // Add margin-top to space below the input
              )}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAddress(suggestion)}
                  className={cn(
                    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    'hover:bg-gray-200 focus:bg-blue-500 focus:text-white'
                  )}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div></div>
      )}
      {userType === 'contractor' && (
        <div className="flex flex-col gap-y-1">
          <Label>Company Name</Label>
          <Input
            name="companyName"
            type="text"
            value={formState.companyName || ''}
            onChange={e =>
              setFormState(prev => ({ ...prev, companyName: e.target.value }))
            }
          />
          <Label>Skills (JSON Format)</Label>
          <Input
            name="skills"
            type="text"
            value={formState.skills || ''}
            onChange={e =>
              setFormState(prev => ({ ...prev, skills: e.target.value }))
            }
          />
        </div>
      )}
    </fieldset>
  )
}

export default RoleSpecificStep
