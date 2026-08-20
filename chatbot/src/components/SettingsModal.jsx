import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PROVIDERS } from '../services/aiService';
import { X, Key, Cpu, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const { 
    provider, 
    setProvider, 
    apiKeys, 
    setApiKeys, 
    selectedModels, 
    setSelectedModels 
  } = useChat();

  const [activeTab, setActiveTab] = useState(provider);
  const [tempKeys, setTempKeys] = useState(apiKeys);
  const [tempModels, setTempModels] = useState(selectedModels);
  const [saveMessage, setSaveMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setProvider(activeTab);
    setApiKeys(tempKeys);
    setSelectedModels(tempModels);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => {
      setSaveMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--surface-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
              AI Engine & Provider Settings
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

        {/* Provider Tabs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {Object.values(PROVIDERS).map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: activeTab === p.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--surface-2)',
                border: activeTab === p.id ? '2px solid var(--accent-primary)' : '1px solid var(--surface-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.name}</span>
                {activeTab === p.id && <CheckCircle2 size={16} color="var(--accent-primary)" />}
              </div>
              <span className="pill-badge" style={{ width: 'fit-content', fontSize: '0.68rem', padding: '1px 6px' }}>
                {p.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Active Provider Details & API Key Form */}
        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
          {activeTab === 'local' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                <ShieldCheck size={18} />
                <span>Zero Setup - Built-in Intelligent AI Generator</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                This built-in smart engine runs directly in your browser with zero latency. It responds to code requests, writing tasks, reasoning, and standard chat completely offline and 100% free!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <Key size={18} color="var(--accent-cyan)" />
                <span>Configure {PROVIDERS[activeTab.toUpperCase()]?.name} Key</span>
              </div>

              {/* API Key Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Paste Free API Key / Token:
                </label>
                <input 
                  type="password"
                  placeholder={PROVIDERS[activeTab.toUpperCase()]?.keyPlaceholder}
                  value={tempKeys[activeTab] || ''}
                  onChange={(e) => setTempKeys({ ...tempKeys, [activeTab]: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  🔒 Your API key is stored strictly in your browser's LocalStorage and is never sent to any middleman server.
                </span>
              </div>

              {/* Model Dropdown Selection */}
              {PROVIDERS[activeTab.toUpperCase()]?.models && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <Cpu size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    Select Model:
                  </label>
                  <select
                    value={tempModels[activeTab] || PROVIDERS[activeTab.toUpperCase()]?.defaultModel}
                    onChange={(e) => setTempModels({ ...tempModels, [activeTab]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-1)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    {PROVIDERS[activeTab.toUpperCase()].models.map(m => (
                      <option key={m.id} value={m.id} style={{ background: '#121826', color: '#fff' }}>
                        {m.name} ({m.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Save Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: '600' }}>
            {saveMessage}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
