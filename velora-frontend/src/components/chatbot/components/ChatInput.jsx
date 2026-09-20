import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Mic, MicOff } from 'lucide-react';

export default function ChatInput() {
  const { sendMessage, isGenerating } = useChat();
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || isGenerating) return;

    sendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setText(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech dictation error:", err);
      setIsListening(false);
    }
  };

  return (
    <div style={{
      padding: '12px 20px 16px 20px',
      background: 'var(--cb-surface-1)',
      borderTop: '1px solid var(--cb-border)',
      position: 'relative'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        background: 'var(--cb-surface-2)',
        borderRadius: '14px',
        padding: '8px 12px',
        border: '1px solid var(--cb-border)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
      }}>
        {/* Voice Dictation Button */}
        <button
          type="button"
          onClick={toggleVoiceDictation}
          className="cb-btn-icon"
          title={isListening ? "Stop Listening" : "Voice Dictation"}
          style={{
            background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            borderColor: isListening ? '#ef4444' : 'transparent',
            color: isListening ? '#ef4444' : 'var(--cb-text-muted)',
            flexShrink: 0
          }}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Velora AI to analyze database reports, check safe zones, or provide safety guidance..."
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--cb-text-main)',
            fontSize: '0.88rem',
            lineHeight: 1.4,
            resize: 'none',
            padding: '6px 0',
            fontFamily: 'inherit'
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isGenerating}
          className="cb-btn cb-btn-primary"
          style={{
            borderRadius: '10px',
            padding: '8px 14px',
            opacity: (!text.trim() || isGenerating) ? 0.4 : 1,
            cursor: (!text.trim() || isGenerating) ? 'not-allowed' : 'pointer',
            flexShrink: 0
          }}
        >
          <Send size={15} />
          <span style={{ fontSize: '0.82rem' }}>Send</span>
        </button>
      </form>
    </div>
  );
}
