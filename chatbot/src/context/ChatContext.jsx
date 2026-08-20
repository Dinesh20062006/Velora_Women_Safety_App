import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendChatMessage } from '../services/aiService';

const ChatContext = createContext();

const INITIAL_THREAD = {
  id: 'default-thread-1',
  title: 'Welcome to Velora AI',
  createdAt: new Date().toISOString(),
  pinned: false,
  messages: [
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `👋 Welcome to **Velora AI** — the AI-Powered Community-Based Women's Safety & Intelligence Platform! 

I'm ready to assist you right now — 100% free out-of-the-box! Here is what you can ask me:

- 🛡️ **Area Safety & Risk Checks**: Ask *"Is Railway Road safe at 10 PM?"* or *"What is the risk level here?"*
- 🗺️ **Safe Route Guidance**: Ask *"Which route is safer to travel home?"*
- 📝 **Incident Reports & SOS**: Learn about community report verification, risk scores, and police command center workflows.
- 💻 **Software & Development**: Ask coding questions in React, Python, JavaScript, Java, C++, etc.
- 🔑 **Free Cloud APIs**: Optionally connect free API keys for Llama 3, Mistral, or Gemini in **Settings**.

Try typing a prompt below or select one of the starter options!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]
};

export function ChatProvider({ children }) {
  // Theme State
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('chatbot_theme') || 'dark';
  });

  // Settings State
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('chatbot_provider') || 'local';
  });

  const [apiKeys, setApiKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chatbot_apikeys')) || { huggingface: '', groq: '', gemini: '' };
    } catch {
      return { huggingface: '', groq: '', gemini: '' };
    }
  });

  const [selectedModels, setSelectedModels] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chatbot_models')) || {
        huggingface: 'meta-llama/Meta-Llama-3-8B-Instruct',
        groq: 'llama-3.1-8b-instant',
        gemini: 'gemini-1.5-flash'
      };
    } catch {
      return {
        huggingface: 'meta-llama/Meta-Llama-3-8B-Instruct',
        groq: 'llama-3.1-8b-instant',
        gemini: 'gemini-1.5-flash'
      };
    }
  });

  const [persona, setPersona] = useState({
    id: 'assistant',
    name: 'Smart Assistant',
    systemPrompt: 'You are a helpful, knowledgeable, and polite AI assistant.'
  });

  // Threads State
  const [threads, setThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('chatbot_threads');
      return saved ? JSON.parse(saved) : [INITIAL_THREAD];
    } catch {
      return [INITIAL_THREAD];
    }
  });

  const [activeThreadId, setActiveThreadId] = useState(() => {
    return threads[0]?.id || INITIAL_THREAD.id;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply theme attribute to root body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('chatbot_theme', theme);
  }, [theme]);

  // Persist state updates
  useEffect(() => {
    localStorage.setItem('chatbot_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('chatbot_provider', provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('chatbot_apikeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('chatbot_models', JSON.stringify(selectedModels));
  }, [selectedModels]);

  // Active Thread Helper
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0] || INITIAL_THREAD;

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const createNewThread = () => {
    const newId = 'thread-' + Date.now();
    const newThread = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      pinned: false,
      messages: []
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
  };

  const deleteThread = (threadId) => {
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== threadId);
      if (filtered.length === 0) {
        return [INITIAL_THREAD];
      }
      return filtered;
    });
    if (activeThreadId === threadId) {
      setActiveThreadId(threads.find(t => t.id !== threadId)?.id || INITIAL_THREAD.id);
    }
  };

  const clearCurrentMessages = () => {
    setThreads(prev =>
      prev.map(t => (t.id === activeThreadId ? { ...t, messages: [] } : t))
    );
  };

  const togglePinThread = (threadId) => {
    setThreads(prev =>
      prev.map(t => (t.id === threadId ? { ...t, pinned: !t.pinned } : t))
    );
  };

  // Send Message Logic
  const sendMessage = async (userPrompt, imageAttachment = null) => {
    if (!userPrompt.trim() && !imageAttachment) return;
    if (isGenerating) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'msg-user-' + Date.now();
    const botMsgId = 'msg-bot-' + Date.now();

    const userMessage = {
      id: userMsgId,
      sender: 'user',
      text: userPrompt,
      imageAttachment: imageAttachment ? { name: imageAttachment.name, size: imageAttachment.size } : null,
      timestamp
    };

    const initialBotMessage = {
      id: botMsgId,
      sender: 'bot',
      text: '',
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active thread title if first message
    setThreads(prev =>
      prev.map(t => {
        if (t.id === activeThreadId) {
          const isFirstUserMsg = t.messages.filter(m => m.sender === 'user').length === 0;
          const newTitle = isFirstUserMsg
            ? userPrompt.slice(0, 28) + (userPrompt.length > 28 ? '...' : '')
            : t.title;

          return {
            ...t,
            title: newTitle,
            messages: [...t.messages, userMessage, initialBotMessage]
          };
        }
        return t;
      })
    );

    setIsGenerating(true);

    try {
      const apiKey = apiKeys[provider] || '';
      const model = selectedModels[provider] || '';

      await sendChatMessage({
        prompt: userPrompt,
        history: activeThread.messages,
        provider,
        apiKey,
        model,
        systemPrompt: persona.systemPrompt,
        imageAttachment,
        onChunk: (chunkText) => {
          setThreads(prev =>
            prev.map(t => {
              if (t.id === activeThreadId) {
                return {
                  ...t,
                  messages: t.messages.map(m =>
                    m.id === botMsgId ? { ...m, text: chunkText } : m
                  )
                };
              }
              return t;
            })
          );
        }
      });
    } catch (error) {
      setThreads(prev =>
        prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: t.messages.map(m =>
                m.id === botMsgId
                  ? { ...m, text: `⚠️ Error generating response: ${error.message}` }
                  : m
              )
            };
          }
          return t;
        })
      );
    } finally {
      setIsGenerating(false);
      setThreads(prev =>
        prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: t.messages.map(m =>
                m.id === botMsgId ? { ...m, isStreaming: false } : m
              )
            };
          }
          return t;
        })
      );
    }
  };

  // Export Chat
  const exportChat = (format = 'md') => {
    const thread = activeThread;
    let content = '';

    if (format === 'json') {
      content = JSON.stringify(thread, null, 2);
    } else {
      content = `# ${thread.title}\n*Exported on ${new Date().toLocaleString()}*\n\n`;
      thread.messages.forEach(m => {
        content += `### ${m.sender === 'user' ? 'User' : 'AI Assistant'} (${m.timestamp})\n${m.text}\n\n---\n\n`;
      });
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${thread.title.toLowerCase().replace(/\s+/g, '_')}_chat.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ChatContext.Provider
      value={{
        theme,
        toggleTheme,
        threads,
        activeThread,
        activeThreadId,
        setActiveThreadId,
        createNewThread,
        deleteThread,
        clearCurrentMessages,
        togglePinThread,
        sendMessage,
        isGenerating,
        provider,
        setProvider,
        apiKeys,
        setApiKeys,
        selectedModels,
        setSelectedModels,
        persona,
        setPersona,
        searchQuery,
        setSearchQuery,
        exportChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
