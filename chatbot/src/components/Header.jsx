import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PROVIDERS } from '../services/aiService';
import { 
  Bot, 
  Sun, 
  Moon, 
  Settings, 
  Sparkles, 
  Trash2, 
  Download, 
  Menu,
  ChevronDown
} from 'lucide-react';

export default function Header({ onOpenSettings, onOpenPersona, onToggleSidebar }) {
  const { 
    theme, 
    toggleTheme, 
    provider, 
    persona, 
    clearCurrentMessages, 
    exportChat 
  } = useChat();

  const [showExportMenu, setShowExportMenu] = useState(false);

  const currentProviderInfo = PROVIDERS[provider.toUpperCase()] || PROVIDERS.LOCAL;

  return (
    <header className="glass-panel" style={{
      height: '64px',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10,
      borderBottom: '1px solid var(--surface-border)'
    }}>
      {/* Left: Mobile Drawer Trigger & App Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="btn-icon mobile-only-btn" 
          onClick={onToggleSidebar}
          title="Toggle Sidebar Menu"
          style={{ display: 'none' }} // Controlled by CSS media query
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Bot size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.15rem', fontWeight: '700', lineHeight: 1.2 }}>
              Velora AI Free
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span className="pill-badge" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                {currentProviderInfo.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Persona & Model Selection Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          className="btn btn-secondary"
          onClick={onOpenPersona}
          style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem' }}
        >
          <Sparkles size={15} color="var(--accent-primary)" />
          <span>Role: <strong>{persona.name}</strong></span>
        </button>
      </div>

      {/* Right: Actions (Theme, Clear, Export, Settings) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Export Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowExportMenu(!showExportMenu)}
            style={{ padding: '7px 12px', fontSize: '0.82rem' }}
            title="Export Conversation"
          >
            <Download size={16} />
            <span className="desktop-only-text">Export</span>
            <ChevronDown size={14} />
          </button>

          {showExportMenu && (
            <div className="glass-panel animate-fade-in" style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '160px',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              boxShadow: 'var(--shadow-md)',
              zIndex: 100
            }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => { exportChat('md'); setShowExportMenu(false); }}
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '8px 12px' }}
              >
                Markdown (.md)
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => { exportChat('json'); setShowExportMenu(false); }}
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '8px 12px' }}
              >
                JSON (.json)
              </button>
            </div>
          )}
        </div>

        {/* Clear Current Chat */}
        <button 
          className="btn-icon" 
          onClick={clearCurrentMessages}
          title="Clear Current Chat Messages"
        >
          <Trash2 size={18} />
        </button>

        {/* Dark/Light Theme Toggle */}
        <button 
          className="btn-icon" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Settings Modal Launcher */}
        <button 
          className="btn btn-primary" 
          onClick={onOpenSettings}
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
        >
          <Settings size={16} />
          <span className="desktop-only-text">Settings</span>
        </button>
      </div>
    </header>
  );
}
