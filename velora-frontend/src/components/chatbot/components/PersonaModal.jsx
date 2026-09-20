import React from 'react';
import { useChat } from '../context/ChatContext';
import { X, Shield, BarChart3, AlertOctagon, Sparkles } from 'lucide-react';

const PERSONAS = [
  {
    id: 'analyst',
    name: 'Safety & Database Analyst',
    icon: BarChart3,
    badge: 'Recommended',
    description: 'Expert in querying database incident complaints, safe zone distributions, and statistical crime patterns.',
    systemPrompt: 'Provide data-driven, precise safety insights, crime pattern analyses, and proactive emergency prevention advice using live database numbers.'
  },
  {
    id: 'emergency',
    name: 'Emergency Dispatch Guide',
    icon: AlertOctagon,
    badge: 'Crisis Support',
    description: 'Specialized in immediate emergency response, 112/100 dispatch, 1-tap SOS actions, and active danger protocols.',
    systemPrompt: 'Focus on urgent safety, emergency contact coordination, quick action checklists, and immediate distress assistance.'
  },
  {
    id: 'navigator',
    name: 'Safe Route & Zone Navigator',
    icon: Shield,
    badge: 'Navigation',
    description: 'Specialized in night travel precautions, street lighting evaluation, and verified safe zone shelters.',
    systemPrompt: 'Provide route precautions, transit guidance, well-lit street recommendations, and safe zone navigation instructions.'
  }
];

export default function PersonaModal({ isOpen, onClose }) {
  const { persona, setPersona } = useChat();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div className="cb-glass-panel cb-animate-fade" style={{
        maxWidth: '520px',
        width: '100%',
        borderRadius: '16px',
        background: '#111827',
        border: '1px solid var(--cb-border)',
        boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--cb-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#818cf8" />
            <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1rem' }}>Select AI Assistant Persona</h3>
          </div>
          <button onClick={onClose} className="cb-btn-icon" style={{ width: '28px', height: '28px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Persona Options */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PERSONAS.map((p) => {
            const isSelected = persona.id === p.id;
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setPersona(p);
                  onClose();
                }}
                className="cb-glass-card"
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--cb-border-active)' : 'var(--cb-border)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--cb-surface-2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isSelected ? 'var(--cb-accent-gradient)' : 'var(--cb-surface-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} color="#ffffff" />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.9rem' }}>{p.name}</span>
                    <span className="cb-pill-badge" style={{ fontSize: '0.7rem' }}>{p.badge}</span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--cb-text-muted)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
