// Greeting.js
import React from 'react'

// Define the props interface
interface GreetingProps {
  nextStep: () => void // specify that nextStep is a function
}

// Update the component to accept props
export const Greeting: React.FC<GreetingProps> = ({ nextStep }) => {
  return (
    <>
      <p>
        "Hello! I’m Luna, your AI assistant here to simplify home renovation
        planning! You can ask me any question about home renovation and I can
        also help you plan your project from brainstorming all the way through
        to finalizing your idea with a go-forward plan, find you great
        contractors, and help you compare contractor quotes. Let’s begin! What
        room are you thinking about renovating?"
      </p>
    </>
  )
}
