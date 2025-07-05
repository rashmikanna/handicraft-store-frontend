import React from 'react';

export default function VoiceInput({ setValue }) {
  const handleVoiceInput = () => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // you can change this as needed
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input:', transcript);

      if (typeof setValue === 'function') {
        setValue(transcript); // ✅ safely update parent
      } else {
        console.error('setValue is not a function');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('Speech recognition failed. Try again.');
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleVoiceInput}
      style={{
        marginLeft: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
      title="Speak"
    >
      🎤
    </button>
  );
}
