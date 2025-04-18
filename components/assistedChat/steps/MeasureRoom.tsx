// MeasureRoom.js
import React from 'react'

// Define the props interface
interface MeasureRoomProps {
  nextStep: () => void
}

// Update the component to accept props
export const MeasureRoom: React.FC<MeasureRoomProps> = ({ nextStep }) => {
  return (
    <>
      <p>
        "Perfect! Next, I’ll need to gather some measurements of your bathroom
        to ensure everything fits perfectly. I’ll provide you with a form to
        fill out these details. Just let me know if you have any questions about
        the measurements!"
      </p>
    </>
  )
}
