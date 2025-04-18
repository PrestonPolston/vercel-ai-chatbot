import React, { useState } from 'react'
import { Greeting } from './steps/Greeting'
import { StartForm } from './steps/StartForm'
import { StartFormConfirmation } from './steps/StartFormConfirmation'
import { AddTask } from './steps/AddTask'
import { MeasureRoom } from './steps/MeasureRoom'

const ChatStepper = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const goToNextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1))
  }

  const steps = [
    { component: <Greeting nextStep={goToNextStep} /> },
    { component: <StartForm nextStep={goToNextStep} /> },
    { component: <StartFormConfirmation nextStep={goToNextStep} /> },
    { component: <AddTask nextStep={goToNextStep} /> },
    { component: <MeasureRoom nextStep={goToNextStep} /> }
  ]

  const goToPreviousStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0))
  }

  return (
    <div>
      {steps[currentStep].component}
      <div>
        {currentStep > 0 && <button onClick={goToPreviousStep}>Back</button>}
        {currentStep < steps.length - 1 && (
          <button onClick={goToNextStep}>Next</button>
        )}
      </div>
    </div>
  )
}

export default ChatStepper
