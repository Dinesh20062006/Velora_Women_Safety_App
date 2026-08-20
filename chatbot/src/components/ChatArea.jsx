import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageItem from './MessageItem';
import { Sparkles, Code2, Shield, Navigation, FileText } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  {
    icon: Shield,
    title: 'Check Area Safety',
    prompt: 'Is Railway Road safe at 10 PM?'
  },
  {
    icon: Navigation,
    title: 'Safe Route Guidance',
    prompt: 'Which route is safer to travel home?'
  },
  {
    icon: FileText,
    title: 'Incident Verification',
    prompt: 'How does community reporting and incident verification work in Velora AI?'
  },
  {
    icon: Code2,
    title: 'Safety Software Code',
    prompt: 'Write a React component for displaying dynamic Area Safety Risk Scores.'
  }
];

export default function ChatArea({ onOpenPersona }) {
  const { activeThread, sendMessage, persona } = useChat();
  const messagesEndRef = useRef(null);

  const messages = activeThread?.messages || [];

  // Auto scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {messages.length === 0 ? (
        /* Empty State Landing Splash */
        <div style={{
          margin: 'auto',
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '40px 20px'
        }} className="animate-fade-in">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: '8px'
          }}>
            <Sparkles size={34} color="#ffffff" />
          </div>

          <div>
            <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
              What can I help with today?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              100% Free AI assistant powered by local intelligent engine and cloud APIs.
            </p>
          </div>

          {/* Quick Persona Pill */}
          <button 
            className="pill-badge" 
            onClick={onOpenPersona}
            style={{ cursor: 'pointer', padding: '6px 16px', fontSize: '0.85rem' }}
          >
            Active Role: <strong>{persona.name}</strong> (Click to change)
          </button>

          {/* Suggestion Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            width: '100%',
            marginTop: '16px'
          }}>
            {SUGGESTED_PROMPTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="glass-card"
                  onClick={() => sendMessage(item.prompt)}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                    <Icon size={18} />
                    <span>{item.title}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {item.prompt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Messages Thread */
        <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto' }}>
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
