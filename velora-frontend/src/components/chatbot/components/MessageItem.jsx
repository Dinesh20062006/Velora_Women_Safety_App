import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check, Volume2, VolumeX } from 'lucide-react';

export default function MessageItem({ message }) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.sender === 'user';

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = message.text.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="cb-animate-fade"
      style={{
        display: 'flex',
        gap: '12px',
        margin: '14px 0',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start'
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: isUser ? 'var(--cb-user-bg)' : 'var(--cb-surface-3)',
        border: isUser ? 'none' : '1px solid var(--cb-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isUser ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
      }}>
        {isUser ? <User size={18} color="#ffffff" /> : <Bot size={18} color="#38bdf8" />}
      </div>

      {/* Bubble Container */}
      <div style={{
        maxWidth: '84%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }}>
        {/* Header Label & Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: 'var(--cb-text-dim)',
          marginBottom: '4px',
          padding: '0 4px'
        }}>
          <span style={{ fontWeight: '600', color: isUser ? '#a5b4fc' : 'var(--cb-text-muted)' }}>
            {isUser ? 'You' : 'Velora AI'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Content Bubble */}
        <div style={{
          background: isUser ? 'var(--cb-user-bg)' : 'var(--cb-bot-bg)',
          color: '#ffffff',
          padding: '14px 18px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          border: isUser ? 'none' : '1px solid var(--cb-border)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          wordBreak: 'break-word',
          position: 'relative'
        }}>
          <div className="cb-markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          </div>
        </div>

        {/* Action Toolbar (Copy & Read aloud for bot messages) */}
        {!isUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '6px',
            padding: '0 4px'
          }}>
            <button
              onClick={handleCopyText}
              title="Copy Response"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cb-text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleSpeak}
              title={isSpeaking ? "Stop Reading" : "Read Aloud"}
              style={{
                background: 'transparent',
                border: 'none',
                color: isSpeaking ? '#10b981' : 'var(--cb-text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
