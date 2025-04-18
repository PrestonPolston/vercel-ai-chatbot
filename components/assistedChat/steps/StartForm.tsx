// StartForm.js
import React from 'react'

// Define the props interface
interface StartFormProps {
  nextStep: () => void // specify that nextStep is a function
}

// Update the component to accept props
export const StartForm: React.FC<StartFormProps> = ({ nextStep }) => {
  return (
    <>
      <p>"Awesome! We’ll break this down into simple steps:</p>
      <ul>
        <li>
          Share a little bit about your idea for what you want (it’s okay if
          you’re not sure, just let me know whatever is on your mind).
        </li>
        <li>Upload a few pictures of your existing bathroom</li>
        <li>
          Upload any inspiration you have (pictures, product links, Pinterest
          boards) and let me know what it is you like about them.
        </li>
      </ul>
    </>
  )
}
