// StartFormConfirmation.js
import React from 'react'

// Define the props interface
interface StartFormConfirmationProps {
  nextStep: () => void // specify that nextStep is a function
}

// Update the component to accept props
export const StartFormConfirmation: React.FC<StartFormConfirmationProps> = ({
  nextStep
}) => {
  return (
    <>
      <p>
        "Thank you for sharing your description and the images! They’re very
        helpful in understanding your vision. Based on what you’ve mentioned,
        here are the details for your bathroom updates:
      </p>
      <ul>
        <li>
          A walk-in shower with wall-to-ceiling tiles and built-in shower nooks
        </li>
        <li>A new mirror above the vanity</li>
        <li>Updated towel rods</li>
        <li>Keeping the existing toilet, vanity, and floor tile</li>
      </ul>
      <p>
        These updates sound fantastic and will definitely enhance the
        functionality and style of your bathroom! Next, we will discuss specific
        materials and styles to consider for these updates. Before we do so, is
        there anything else you’d like to add or any questions I can answer for
        you?
      </p>
    </>
  )
}
