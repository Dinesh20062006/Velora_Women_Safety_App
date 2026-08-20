import React, { useState } from 'react';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import PersonaModal from './components/PersonaModal';
import './index.css';

function MainLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const isEmbed = searchParams.get('embed') === 'true' || searchParams.get('hideSidebar') === 'true';

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      {!isEmbed && (
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenPersona={() => setIsPersonaOpen(true)}
        />
      )}

      {/* Main Chat Workspace */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Header 
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenPersona={() => setIsPersonaOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <ChatArea 
          onOpenPersona={() => setIsPersonaOpen(true)}
        />

        <ChatInput />
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Persona Selector Modal */}
      <PersonaModal 
        isOpen={isPersonaOpen} 
        onClose={() => setIsPersonaOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <MainLayout />
    </ChatProvider>
  );
}
