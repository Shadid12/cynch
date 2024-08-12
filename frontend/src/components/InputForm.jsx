import { useState, useContext } from 'react';
import UserContext from '../UserContext';

import './InputForm.css';
import upIcon from '../assets/arrow.svg';

export default function InputForm() {
  const [message, setMessage] = useState('');
  const context = useContext(UserContext);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted', message);

    try {
      const response = await fetch('http://localhost:3000/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error:', error);
        return;
      }

      const data = await response.json();
      console.log('Success:', data);
      context.setSentiment(data.sentiment);
    } catch (error) {
      console.error('Error:', error);
    }

    setMessage('');
  }
  return (
    <form className="form" onSubmit={onFormSubmit}>
      <input
        type="text" 
        className="input-field" 
        placeholder="Chat with Cynch.ai"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="submit-button" disabled={!message}>
        <img src={upIcon} alt="Send" />
      </button>
    </form>
  )
}
