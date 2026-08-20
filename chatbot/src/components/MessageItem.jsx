import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  FileText,
  Sparkles
} from 'lucide-react';

export default function MessageItem({ message }) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.sender === 'user';

  // Copy full message text
  const handleCopyText = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text to Speech
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

    // Clean markdown symbols for natural speech reading
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
      className="animate-fade-in"
      style={{
        display: 'flex',
        gap: '14px',
        margin: '16px 0',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start'
      }}
    >
      {/* Sender Avatar */}
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        background: isUser ? 'var(--user-msg-bg)' : 'var(--surface-3)',
        border: isUser ? 'none' : '1px solid var(--bot-msg-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isUser ? 'var(--shadow-glow)' : 'none'
      }}>
        {isUser ? <User size={20} color="#ffffff" /> : <Bot size={20} color="var(--accent-cyan)" />}
      </div>

      {/* Message Bubble Container */}
      <div style={{
        maxWidth: '82%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }}>
        {/* Header Label & Timestamp */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          marginBottom: '4px',
          padding: '0 4px'
        }}>
          <span style={{ fontWeight: '600', color: isUser ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
            {isUser ? 'You' : 'Velora AI'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Content Box */}
        <div 
          className={isUser ? '' : 'glass-card'}
          style={{
            padding: '14px 18px',
            borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
            background: isUser ? 'var(--user-msg-bg)' : 'var(--bot-msg-bg)',
            color: isUser ? 'var(--user-msg-text)' : 'var(--text-main)',
            border: isUser ? 'none' : '1px solid var(--bot-msg-border)',
            boxShadow: isUser ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
            wordBreak: 'break-word'
          }}
        >
          {/* Image Attachment Chip */}
          {message.imageAttachment && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.25)',
              marginBottom: '10px',
              fontSize: '0.8rem'
            }}>
              <FileText size={14} color="var(--accent-cyan)" />
              <span>{message.imageAttachment.name}</span>
            </div>
          )}

          {/* Text / Markdown Render */}
          {isUser ? (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {message.text}
            </div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ _node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');

                    if (!inline && match) {
                      return (
                        <CodeBlock language={match[1]} code={codeString} />
                      );
                    } else if (!inline) {
                      return (
                        <CodeBlock language="code" code={codeString} />
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.text}
              </ReactMarkdown>

              {/* Streaming Dots Indicator */}
              {message.isStreaming && (
                <span className="animate-glow" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '6px',
                  color: 'var(--accent-cyan)',
                  fontWeight: 'bold'
                }}>
                  <Sparkles size={14} /> Generating...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions Bar for Bot Messages */}
        {!isUser && message.text && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            paddingLeft: '4px'
          }}>
            <button 
              onClick={handleCopyText}
              title="Copy message text"
              style={{
                background: 'none',
                border: 'none',
                color: copied ? 'var(--accent-emerald)' : 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button 
              onClick={handleSpeak}
              title={isSpeaking ? "Stop voice reading" : "Read message aloud"}
              style={{
                background: 'none',
                border: 'none',
                color: isSpeaking ? 'var(--accent-rose)' : 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                marginLeft: '8px'
              }}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Syntax Block Component
function CodeBlock({ language, code }) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{language.toUpperCase()}</span>
        <button onClick={handleCopyCode}>
          {copiedCode ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
          <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>
      <div className="code-block-body">
        <code>{code}</code>
      </div>
    </div>
  );
}
