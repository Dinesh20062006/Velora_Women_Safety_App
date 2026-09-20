import React, { useState } from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import PersonaModal from './components/PersonaModal';
import SettingsModal from './components/SettingsModal';
import './chatbot.css';

function ChatbotWorkspace() {
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="velora-chatbot-root">
      {/* Main Full-Screen Chat Workspace (Without redundant inner header) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <ChatArea
          onOpenPersona={() => setIsPersonaOpen(true)}
        />

        <ChatInput />
      </div>

      {/* Persona Selection Modal */}
      <PersonaModal
        isOpen={isPersonaOpen}
        onClose={() => setIsPersonaOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function VeloraChatbot({ currentPosition, mlData }) {
  return (
    <ChatProvider currentPosition={currentPosition} mlData={mlData}>
      <ChatbotWorkspace />
    </ChatProvider>
  );
}
