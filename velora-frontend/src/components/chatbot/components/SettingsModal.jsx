import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PROVIDERS } from '../services/aiService';
import { X, Settings, Check, Key, Cpu, Database } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const { provider, setProvider, apiKey, setApiKey } = useChat();
  const [tempKey, setTempKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

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
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--cb-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="#818cf8" />
            <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1rem' }}>AI & Database Settings</h3>
          </div>
          <button onClick={onClose} className="cb-btn-icon" style={{ width: '28px', height: '28px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Active Model Info */}
          <div className="cb-glass-card" style={{ padding: '14px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px' }}>
              <Cpu size={16} />
              <span>Primary Engine: Google Gemini 3.6 Flash</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--cb-text-muted)', lineHeight: 1.4 }}>
              The system uses Google Gemini Free Tier with built-in access to the live Velora MySQL database for real-time complaint, safe zone, and SOS telemetry.
            </p>
          </div>

          {/* Database Live Telemetry Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px' }}>
            <Database size={16} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#6ee7b7' }}>Live Database Telemetry: ACTIVE</div>
              <div style={{ fontSize: '0.74rem', color: '#9ca3af' }}>Connected to Complaints (:8088), Safe Zones (:8083), SOS (:8086), & ML (:8000)</div>
            </div>
          </div>

          {/* Provider Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#e5e7eb', marginBottom: '8px', fontWeight: '600' }}>
              Select Intelligence Engine
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`cb-btn ${provider === 'gemini' ? 'cb-btn-primary' : 'cb-btn-secondary'}`}
                style={{ flex: 1, padding: '10px' }}
              >
                Google Gemini (AI + DB)
              </button>
              <button
                type="button"
                onClick={() => setProvider('local')}
                className={`cb-btn ${provider === 'local' ? 'cb-btn-primary' : 'cb-btn-secondary'}`}
                style={{ flex: 1, padding: '10px' }}
              >
                Offline Local Engine
              </button>
            </div>
          </div>

          {/* Optional Custom Key */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#e5e7eb', marginBottom: '6px', fontWeight: '600' }}>
              <Key size={14} /> Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Leave empty to use built-in system key"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--cb-surface-2)',
                border: '1px solid var(--cb-border)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--cb-text-dim)', display: 'block', marginTop: '4px' }}>
              Built-in key is pre-configured and operational for 100% free usage.
            </span>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              className="cb-btn cb-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="cb-btn cb-btn-primary"
              style={{ gap: '6px' }}
            >
              {saved ? <Check size={16} /> : null}
              <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
