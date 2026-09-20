import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendChatMessage } from '../services/aiService';

const ChatContext = createContext();

const INITIAL_THREAD = {
  id: 'thread-default-1',
  title: 'Velora AI Safety & Database Intelligence',
  createdAt: new Date().toISOString(),
  messages: [
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `👋 Welcome to **Velora AI Safety Assistant**! 

I am powered by **Google Gemini Free Generative AI** and directly connected to the **live Velora database** (Complaints, Incident Reports, Safe Zones, Active SOS Alerts, and ML Spatial Safety Risk Predictions).

Here are quick actions you can ask me:
- 📊 **"Analyze all incident reports from the database"**
- 🛡️ **"How many safe zones are registered in the database?"**
- 🚨 **"Are there any active SOS alerts in the system right now?"**
- 📍 **"What is my evaluated area safety risk score?"**
- 🛑 **"What should I do if someone is following me?"**

Type any question below or pick one of the quick starter prompts!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]
};

export function ChatProvider({ children, currentPosition, mlData }) {
  // Provider settings
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('velora_chat_provider') || 'gemini';
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('velora_gemini_key') || '';
  });

  // Persona
  const [persona, setPersona] = useState({
    id: 'analyst',
    name: 'Safety & Database Analyst',
    systemPrompt: 'Provide data-driven, precise safety insights, crime pattern analyses, and proactive emergency prevention advice.'
  });

  // Threads
  const [threads, setThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_chatbot_threads');
      return saved ? JSON.parse(saved) : [INITIAL_THREAD];
    } catch {
      return [INITIAL_THREAD];
    }
  });

  const [activeThreadId, setActiveThreadId] = useState(() => {
    return threads[0]?.id || INITIAL_THREAD.id;
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('velora_chatbot_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('velora_chat_provider', provider);
  }, [provider]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('velora_gemini_key', apiKey);
    }
  }, [apiKey]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0] || INITIAL_THREAD;

  // Send message
  const sendMessage = async (userText) => {
    const trimmed = (userText || '').trim();
    if (!trimmed || isGenerating) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update thread title if first user message
    const isFirstUserMsg = activeThread.messages.filter(m => m.sender === 'user').length === 0;
    const newTitle = isFirstUserMsg ? (trimmed.length > 28 ? trimmed.substring(0, 28) + '...' : trimmed) : activeThread.title;

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          title: newTitle,
          messages: [...t.messages, userMsg]
        };
      }
      return t;
    }));

    setIsGenerating(true);

    try {
      const botReplyText = await sendChatMessage(trimmed, {
        provider,
        customApiKey: apiKey,
        persona,
        currentPosition,
        mlData
      });

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, botMsg]
          };
        }
        return t;
      }));
    } catch (err) {
      console.error("Error in chatbot response:", err);
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "⚠️ An error occurred while generating the response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return { ...t, messages: [...t.messages, errorMsg] };
        }
        return t;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Create new thread
  const createNewThread = () => {
    const newThread = {
      id: `thread-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: "👋 How can I help you today? Ask about live database reports, area risk, safe zones, or safety protocols.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
  };

  // Delete thread
  const deleteThread = (threadId) => {
    if (threads.length <= 1) {
      clearCurrentMessages();
      return;
    }
    const filtered = threads.filter(t => t.id !== threadId);
    setThreads(filtered);
    if (activeThreadId === threadId) {
      setActiveThreadId(filtered[0]?.id || INITIAL_THREAD.id);
    }
  };

  // Clear current messages
  const clearCurrentMessages = () => {
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: 'bot',
              text: "Conversation cleared. Ready for your next safety or database query!",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
  };

  // Export chat
  const exportChat = (format = 'txt') => {
    const thread = activeThread;
    if (!thread) return;

    let content = "";
    let mimeType = "text/plain";
    let extension = "txt";

    if (format === 'json') {
      content = JSON.stringify(thread, null, 2);
      mimeType = "application/json";
      extension = "json";
    } else {
      content = `VELORA AI CONVERSATION EXPORT\n`;
      content += `Title: ${thread.title}\nDate: ${new Date().toLocaleString()}\n`;
      content += `----------------------------------------\n\n`;
      thread.messages.forEach(m => {
        content += `[${m.timestamp}] ${m.sender === 'user' ? 'YOU' : 'VELORA AI'}:\n${m.text}\n\n`;
      });
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velora-chat-${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ChatContext.Provider value={{
      provider,
      setProvider,
      apiKey,
      setApiKey,
      persona,
      setPersona,
      threads,
      activeThread,
      activeThreadId,
      setActiveThreadId,
      createNewThread,
      deleteThread,
      clearCurrentMessages,
      exportChat,
      sendMessage,
      isGenerating
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
