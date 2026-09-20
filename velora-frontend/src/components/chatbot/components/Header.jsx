import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { 
  Bot, 
  Sparkles, 
  Trash2, 
  Download, 
  Settings, 
  Menu, 
  Database,
  ArrowLeft
} from 'lucide-react';

export default function Header({ onOpenSettings, onOpenPersona, onToggleSidebar, onBackToAnalytics }) {
  const { persona, clearCurrentMessages, exportChat } = useChat();
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="cb-glass-panel" style={{
      height: '60px',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10,
      borderBottom: '1px solid var(--cb-border)',
      background: 'var(--cb-surface-1)'
    }}>
      {/* Left: Branding & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          className="cb-btn-icon" 
          onClick={onToggleSidebar}
          title="Conversation History"
          style={{ width: '32px', height: '32px' }}
        >
          <Menu size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'var(--cb-accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Bot size={18} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>
                Velora AI Safety Assistant
              </span>
              <span className="cb-pill-badge cb-badge-db" style={{ padding: '2px 8px', fontSize: '0.68rem', gap: '4px' }}>
                <Database size={11} />
                <span>Live DB</span>
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--cb-text-muted)' }}>
              Google Gemini 3.6 Flash Engine
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Persona */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenPersona}
          className="cb-btn cb-btn-secondary"
          style={{ padding: '5px 12px', borderRadius: '18px', fontSize: '0.78rem' }}
        >
          <Sparkles size={13} color="#818cf8" />
          <span>Role: <strong style={{ color: '#ffffff' }}>{persona.name}</strong></span>
        </button>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Export Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="cb-btn cb-btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            title="Export Conversation"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {showExportMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '6px',
              background: '#111827',
              border: '1px solid var(--cb-border)',
              borderRadius: '8px',
              padding: '4px',
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              width: '130px'
            }}>
              <button
                onClick={() => { exportChat('txt'); setShowExportMenu(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#f3f4f6',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                Text File (.txt)
              </button>
              <button
                onClick={() => { exportChat('json'); setShowExportMenu(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#f3f4f6',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                JSON Data (.json)
              </button>
            </div>
          )}
        </div>

        {/* Clear Chat */}
        <button
          onClick={clearCurrentMessages}
          className="cb-btn-icon"
          title="Clear Conversation"
          style={{ width: '32px', height: '32px' }}
        >
          <Trash2 size={14} />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="cb-btn-icon"
          title="AI Settings"
          style={{ width: '32px', height: '32px' }}
        >
          <Settings size={14} />
        </button>
      </div>
    </header>
  );
}
