import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PROVIDERS } from '../services/aiService';
import { 
  Plus, 
  MessageSquare, 
  Pin, 
  Trash2, 
  Search, 
  Settings, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, onOpenSettings, onOpenPersona }) {
  const { 
    threads, 
    activeThreadId, 
    setActiveThreadId, 
    createNewThread, 
    deleteThread, 
    togglePinThread,
    provider
  } = useChat();

  const [filterText, setFilterText] = useState('');

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const pinnedThreads = filteredThreads.filter(t => t.pinned);
  const unpinnedThreads = filteredThreads.filter(t => !t.pinned);

  const currentProviderInfo = PROVIDERS[provider.toUpperCase()] || PROVIDERS.LOCAL;

  return (
    <aside className={`sidebar-drawer glass-panel ${isOpen ? 'open' : ''}`} style={{
      width: '280px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--surface-border)',
      transition: 'transform 0.3s ease',
      zIndex: 20
    }}>
      {/* Top Header & New Chat Button */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => { createNewThread(); if (onClose) onClose(); }}
          style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
        >
          <Plus size={18} />
          New Conversation
        </button>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search chats..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Threads List Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 12px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Pinned Section */}
        {pinnedThreads.length > 0 && (
          <div>
            <div style={{ 
              fontSize: '0.72rem', 
              fontWeight: '700', 
              color: 'var(--text-dim)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '6px',
              paddingLeft: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Pin size={12} /> Pinned Chats
            </div>
            {pinnedThreads.map(t => (
              <ThreadItem 
                key={t.id} 
                thread={t} 
                isActive={t.id === activeThreadId}
                onSelect={() => { setActiveThreadId(t.id); if (onClose) onClose(); }}
                onPin={() => togglePinThread(t.id)}
                onDelete={() => deleteThread(t.id)}
              />
            ))}
          </div>
        )}

        {/* Regular Threads */}
        <div>
          <div style={{ 
            fontSize: '0.72rem', 
            fontWeight: '700', 
            color: 'var(--text-dim)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginBottom: '6px',
            paddingLeft: '8px'
          }}>
            Recent Conversations
          </div>
          {unpinnedThreads.length === 0 && pinnedThreads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              No chats found.
            </div>
          ) : (
            unpinnedThreads.map(t => (
              <ThreadItem 
                key={t.id} 
                thread={t} 
                isActive={t.id === activeThreadId}
                onSelect={() => { setActiveThreadId(t.id); if (onClose) onClose(); }}
                onPin={() => togglePinThread(t.id)}
                onDelete={() => deleteThread(t.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer Info & Quick Controls */}
      <div style={{
        padding: '14px',
        borderTop: '1px solid var(--surface-border)',
        background: 'var(--surface-1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-2)',
          border: '1px solid var(--surface-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="var(--accent-cyan)" />
            <div style={{ fontSize: '0.78rem', lineHeight: '1.2' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{currentProviderInfo.name}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{currentProviderInfo.badge}</div>
            </div>
          </div>

          <button 
            className="btn-icon" 
            onClick={onOpenSettings}
            title="Configure AI Provider"
            style={{ width: '28px', height: '28px' }}
          >
            <Settings size={14} />
          </button>
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={onOpenPersona}
          style={{ width: '100%', padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <Sparkles size={14} color="var(--accent-primary)" />
          Change AI Persona
        </button>
      </div>
    </aside>
  );
}

function ThreadItem({ thread, isActive, onSelect, onPin, onDelete }) {
  return (
    <div 
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 10px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
        border: isActive ? '1px solid var(--surface-border-active)' : '1px solid transparent',
        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
        transition: 'all 0.15s ease',
        marginBottom: '3px'
      }}
      className="thread-item-row"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
        <MessageSquare size={15} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
        <span style={{ 
          fontSize: '0.85rem', 
          fontWeight: isActive ? '600' : '400',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {thread.title}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); onPin(); }}
          title={thread.pinned ? "Unpin chat" : "Pin chat"}
          style={{ background: 'none', border: 'none', color: thread.pinned ? 'var(--accent-primary)' : 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
        >
          <Pin size={13} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete chat"
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
