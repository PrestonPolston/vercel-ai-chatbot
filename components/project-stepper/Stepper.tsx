import React from 'react'
import { Button } from '../ui/button'

interface IStep<S> {
  label: S
  content: React.ReactNode
}

interface StepperProps<S> {
  activeStep: number
  steps: IStep<S>[]
  onStepChange: (newStep: number) => void
}

const Stepper: React.FC<StepperProps<string>> = ({
  activeStep,
  steps,
  onStepChange
}) => {
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      onStepChange(activeStep + 1)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      onStepChange(activeStep - 1)
    }
  }

  return (
    <div className="rounded-lg bg-secondary p-4 shadow-md">
      <div className="mb-4">{steps[activeStep].content}</div>
      {activeStep < steps.length - 1 && (
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={activeStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      )}
    </div>
  )
}

export default Stepper
