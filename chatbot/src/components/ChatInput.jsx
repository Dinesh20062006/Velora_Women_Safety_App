import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  X, 
  Sparkles
} from 'lucide-react';

export default function ChatInput() {
  const { sendMessage, isGenerating } = useChat();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e?.preventDefault();
    if ((!text.trim() && !imageFile) || isGenerating) return;

    sendMessage(text, imageFile);
    setText('');
    setImageFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Keyboard Shortcuts (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Voice Dictation (Speech-to-Text)
  const toggleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
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

  // File Picker
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div style={{
      padding: '14px 24px 20px 24px',
      background: 'transparent',
      zIndex: 10
    }}>
      <div className="glass-panel" style={{
        maxWidth: '860px',
        margin: '0 auto',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--surface-border-active)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Attachment Preview Chip */}
        {imageFile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-3)',
            width: 'fit-content',
            fontSize: '0.8rem'
          }}>
            <Paperclip size={14} color="var(--accent-cyan)" />
            <span>{imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)</span>
            <button 
              onClick={() => setImageFile(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          {/* File Upload Hidden Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.txt"
            style={{ display: 'none' }}
          />

          {/* Attachment Button */}
          <button 
            type="button"
            className="btn-icon" 
            onClick={() => fileInputRef.current?.click()}
            title="Attach file or image"
          >
            <Paperclip size={18} />
          </button>

          {/* Text Area Prompt */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift + Enter for new line)"
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              lineHeight: '1.5',
              resize: 'none',
              padding: '6px 4px',
              maxHeight: '180px'
            }}
          />

          {/* Speech Dictation Button */}
          <button 
            type="button"
            className={`btn-icon ${isListening ? 'active' : ''}`}
            onClick={toggleVoiceDictation}
            title={isListening ? "Listening... Click to stop" : "Voice dictation"}
          >
            {isListening ? <MicOff size={18} color="var(--accent-rose)" /> : <Mic size={18} />}
          </button>

          {/* Send Button */}
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={(!text.trim() && !imageFile) || isGenerating}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              padding: 0,
              opacity: (!text.trim() && !imageFile) || isGenerating ? 0.5 : 1,
              cursor: (!text.trim() && !imageFile) || isGenerating ? 'not-allowed' : 'pointer'
            }}
            title="Send Message"
          >
            {isGenerating ? <Sparkles size={18} className="animate-glow" /> : <Send size={18} />}
          </button>
        </form>

        {/* Footer Sub-Info */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          paddingTop: '4px'
        }}>
          <span>Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for newline</span>
          <span>{text.length} characters</span>
        </div>
      </div>
    </div>
  );
}
