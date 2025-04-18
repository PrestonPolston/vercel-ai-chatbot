import React, { createContext, useContext, useMemo } from 'react'

interface IStepperProviderProps<T, S extends string> {
  children: React.ReactNode
  initialData: T
  steps: IStep<S>[]
  activeStep: number 
  onStepChange: (newStep: number) => void 
  handleSetData: (partial: Partial<T>) => void 
}

interface IStep<S> {
  label: S
  content: React.ReactNode
}

interface IStepperContext<T, S> {
  activeStep: number
  navigateTo: (id: IStep<S>['label']) => void
  handleSetData: (partial: Partial<T>) => void
  data: T
  steps: IStep<S>[]
}

const StepperContext = createContext<IStepperContext<any, any> | undefined>(
  undefined
)

export const StepperProvider = <T, S extends string>({
  children,
  initialData,
  steps,
  activeStep,
  onStepChange,
  handleSetData
}: IStepperProviderProps<T, S>) => {
  const navigateTo = (id: IStep<S>['label']) => {
    const index = steps.findIndex(step => step.label === id)
    if (index !== -1) {
      onStepChange(index) // Call the prop function to change the step
    }
  }

  const value = useMemo(
    () => ({
      activeStep,
      navigateTo,
      handleSetData,
      steps
    }),
    [activeStep, steps]
  )

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  )
}

// Hook for using StepperContext
export const useStepperContext = () => {
  const context = useContext(StepperContext)
  if (context === undefined) {
    throw new Error('useStepperContext must be used within a StepperProvider')
  }
  return context
}
