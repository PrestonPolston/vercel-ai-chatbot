// components/project-stepper/steps/RoomStep.tsx
import React from 'react'

interface RoomStepProps {
  selectedRoom: string
  setSelectedRoom: (room: string) => void
}

const RoomStep: React.FC<RoomStepProps> = ({
  selectedRoom,
  setSelectedRoom
}) => {
  return (
    <div>
      <h3>Please select the room you want to renovate</h3>
      <select
        value={selectedRoom}
        onChange={e => setSelectedRoom(e.target.value)}
      >
        <option value="">Select Room</option>
        <option value="Bathroom">Bathroom</option>
      </select>
    </div>
  )
}

export default RoomStep
