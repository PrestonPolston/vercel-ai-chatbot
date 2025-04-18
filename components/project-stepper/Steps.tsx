// components/project-stepper/Steps.ts
import BudgetStep from './steps/BudgetStep'
import RoomStep from './steps/RoomStep'
import DetailsStep from './steps/DetailsStep'

export const steps = [
  { label: 'Room', content: (props: any) => <RoomStep {...props} /> },
  // { label: 'Budget', content: (props: any) => <BudgetStep {...props} /> },
  { label: 'Details', content: (props: any) => <DetailsStep {...props} /> }
]
