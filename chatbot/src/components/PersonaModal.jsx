import React from 'react';
import { useChat } from '../context/ChatContext';
import { X, Sparkles, Code2, PenTool, Calculator, Briefcase, Check } from 'lucide-react';

const PERSONAS = [
  {
    id: 'assistant',
    name: 'Smart Assistant',
    icon: Sparkles,
    badge: 'General',
    description: 'Helpful, balanced AI ready to answer general questions, brainstorm, and chat.',
    systemPrompt: 'You are a helpful, knowledgeable, concise, and friendly AI assistant.'
  },
  {
    id: 'coder',
    name: 'Senior Developer',
    icon: Code2,
    badge: 'Coding Specialist',
    description: 'Specialized in clean code, debugging, refactoring, architecture, and syntax highlighting.',
    systemPrompt: 'You are a Senior Full-Stack Software Engineer. Provide complete, modular, error-free code examples with explanation headers.'
  },
  {
    id: 'writer',
    name: 'Creative Wordsmith',
    icon: PenTool,
    badge: 'Content & Copy',
    description: 'Draft compelling emails, stories, essays, marketing copy, and documentation.',
    systemPrompt: 'You are an expert Copywriter and Creative Writer. Focus on engaging tone, flawless grammar, and vivid vocabulary.'
  },
  {
    id: 'math',
    name: 'Math & STEM Tutor',
    icon: Calculator,
    badge: 'Reasoning & Logic',
    description: 'Breaks down complex mathematical equations, physics concepts, and algorithms step-by-step.',
    systemPrompt: 'You are a Mathematics and Science Professor. Break down problems step-by-step with clear logic and markdown math notation.'
  },
  {
    id: 'career',
    name: 'Tech Career Coach',
    icon: Briefcase,
    badge: 'Advice & Strategy',
    description: 'Mock technical interviews, review resumes, and give software career guidance.',
    systemPrompt: 'You are an experienced Tech Career Coach and Hiring Manager. Give actionable interview and career advancement advice.'
  }
];

export default function PersonaModal({ isOpen, onClose }) {
  const { persona, setPersona } = useChat();

  if (!isOpen) return null;

  const handleSelect = (selected) => {
    setPersona(selected);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--surface-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
              Choose AI Persona & Role
            </h2>
          </div>
          <button 
            className="btn-icon" 
            onClick={onClose}
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Personas Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isSelected = persona.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'var(--surface-2)',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--surface-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: isSelected ? 'var(--accent-gradient)' : 'var(--surface-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{p.name}</span>
                      <span className="pill-badge" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {p.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {p.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} color="#ffffff" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
