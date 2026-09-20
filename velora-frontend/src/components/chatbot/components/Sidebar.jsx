import React from 'react';
import { useChat } from '../context/ChatContext';
import { Plus, MessageSquare, Trash2, X, ShieldAlert } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { threads, activeThreadId, setActiveThreadId, createNewThread, deleteThread } = useChat();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '280px',
      background: '#0f172a',
      borderRight: '1px solid var(--cb-border)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '10px 0 25px rgba(0,0,0,0.5)',
      animation: 'cbFadeIn 0.2s ease'
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--cb-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} color="#818cf8" />
          <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>History</span>
        </div>
        <button onClick={onClose} className="cb-btn-icon" style={{ width: '28px', height: '28px' }}>
          <X size={16} />
        </button>
      </div>

      {/* New Chat Button */}
      <div style={{ padding: '12px 16px' }}>
        <button
          onClick={() => {
            createNewThread();
            onClose();
          }}
          className="cb-btn cb-btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: '0.84rem', gap: '6px' }}
        >
          <Plus size={16} />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Threads List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {threads.map((t) => {
          const isActive = t.id === activeThreadId;
          return (
            <div
              key={t.id}
              onClick={() => {
                setActiveThreadId(t.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                color: isActive ? '#ffffff' : 'var(--cb-text-muted)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <MessageSquare size={14} color={isActive ? '#818cf8' : '#64748b'} />
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '600' : 'normal',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {t.title}
                </span>
              </div>

              {threads.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(t.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                  title="Delete Thread"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Emergency Notice Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--cb-border)',
        background: 'rgba(239, 68, 68, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <ShieldAlert size={16} color="#ef4444" />
        <div style={{ fontSize: '0.72rem', color: '#fca5a5', lineHeight: 1.3 }}>
          National Emergency: <strong>112</strong> | Police: <strong>100</strong>
        </div>
      </div>
    </div>
  );
}
