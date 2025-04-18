// AddTask.js
import React from 'react'

// Define the props interface
interface AddTaskProps {
  nextStep: () => void // specify that nextStep is a function
}

// Update the component to accept props
export const AddTask: React.FC<AddTaskProps> = ({ nextStep }) => {
  return (
    <>
      <p>
        "That's a great addition! A fresh coat of paint or new wallpaper will
        really enhance the bathroom's overall look. Here’s the updated list of
        what we have for your renovation:
      </p>
      <ul>
        <li>
          A walk-in shower with wall-to-ceiling tiles and built-in shower nooks
        </li>
        <li>A new mirror above the vanity</li>
        <li>Updated towel rods</li>
        <li>Keeping the existing toilet, vanity, and floor tile</li>
        <li>Repainting the walls or using wallpaper</li>
      </ul>
      <p>
        Is everything on this list okay with you, or is there anything else
        you’d like to adjust before we move forward?"
      </p>
    </>
  )
}
