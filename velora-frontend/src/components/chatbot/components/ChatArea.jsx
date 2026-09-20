import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageItem from './MessageItem';
import { Sparkles, Database, Shield, AlertTriangle, MapPin, Loader } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  {
    icon: Database,
    title: 'Analyze Database Reports',
    prompt: 'Analyze all incident reports and complaints currently recorded in the database. Give me the breakdown by status, category, and location hotspots.'
  },
  {
    icon: Shield,
    title: 'Audit Verified Safe Zones',
    prompt: 'How many verified safe zones are recorded in the database? What are the top locations and safety scores?'
  },
  {
    icon: AlertTriangle,
    title: 'Check Active SOS Alerts',
    prompt: 'Are there any active SOS distress alerts or emergencies logged in the system right now? What is their status?'
  },
  {
    icon: MapPin,
    title: 'Live Location & ML Risk',
    prompt: 'Evaluate the current location safety score and lighting breakdown using the live ML model.'
  }
];

export default function ChatArea({ onOpenPersona }) {
  const { activeThread, sendMessage, persona, isGenerating } = useChat();
  const messagesEndRef = useRef(null);

  const messages = activeThread?.messages || [];
  const hasUserMessages = messages.some(m => m.sender === 'user');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isGenerating]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {!hasUserMessages && (
        <div style={{
          margin: 'auto',
          maxWidth: '680px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '24px 16px'
        }} className="cb-animate-fade">
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--cb-accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
            marginBottom: '4px'
          }}>
            <Sparkles size={28} color="#ffffff" />
          </div>

          <div>
            <h2 className="cb-gradient-text" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 6px 0' }}>
              Velora AI Safety & Database Intelligence
            </h2>
            <p style={{ color: 'var(--cb-text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              Powered by <strong>Google Gemini Free AI</strong> & live connected to the <strong>Velora microservices database</strong>.
            </p>
          </div>

          <button
            onClick={onOpenPersona}
            className="cb-pill-badge"
            style={{ cursor: 'pointer', border: '1px solid rgba(99, 102, 241, 0.4)' }}
          >
            Active Role: <strong>{persona.name}</strong> (Click to change)
          </button>

          {/* Suggested Starter Prompts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            width: '100%',
            marginTop: '8px'
          }}>
            {SUGGESTED_PROMPTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="cb-glass-card"
                  onClick={() => sendMessage(item.prompt)}
                  style={{
                    padding: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: '600', fontSize: '0.88rem' }}>
                    <Icon size={16} />
                    <span>{item.title}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--cb-text-muted)', lineHeight: 1.4 }}>
                    {item.prompt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      {hasUserMessages && messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}

      {/* Typing / Generating Indicator */}
      {isGenerating && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          background: 'var(--cb-bot-bg)',
          borderRadius: '12px',
          border: '1px solid var(--cb-border)',
          width: 'fit-content',
          margin: '8px 0',
          color: '#38bdf8',
          fontSize: '0.82rem'
        }}>
          <Loader size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Analyzing database & generating AI intelligence...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
