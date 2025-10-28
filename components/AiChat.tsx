
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Button } from './ui/Button';
import { Bot, X, Send, Sparkles } from './Icons';

interface AiChatButtonProps {
  onClick: () => void;
}

export const AiChatButton = ({ onClick }: AiChatButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-16 w-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white
                 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
      aria-label="Open AI Chat"
    >
      <div className="absolute inset-0 bg-black/20 rounded-full"></div>
      <Sparkles className="h-8 w-8 relative" />
      <div className="absolute top-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-indigo-600 animate-pulse"></div>
    </button>
  );
};

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  financialData: string;
}

const PROMPT_SUGGESTIONS = [
    "Summarize our performance",
    "What are our biggest expenses?",
    "How can we improve profitability?",
    "Identify any financial risks.",
];

export const AiChatModal = ({ isOpen, onClose, financialData }: AiChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = useMemo(() => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        return new GoogleGenAI({ apiKey });
      } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
        return null;
      }
    }
    console.warn("GEMINI_API_KEY environment variable not found.");
    return null;
  }, []);

  const systemInstruction = `You are an 'AI Financial Analyst', an expert AI financial advisor for healthcare institutions. Your tone is professional, insightful, and encouraging. 
  Analyze the provided financial data context to give clear, actionable advice. Base your entire analysis strictly on the data provided.
  Do not mention that you are an AI.
  **FORMATTING RULES:**
  - Use standard HTML tags for structure: <p> for paragraphs, <strong> for bold, <ul> and <li> for lists.
  - To highlight key financial insights, wrap them in <span> tags with specific classes:
    - For POSITIVE insights (e.g., profit increase, cost reduction), use: <span class="insight-positive">text</span>.
    - For NEGATIVE insights or RISKS (e.g., expense increase, low margin), use: <span class="insight-negative">text</span>.
  - Start the conversation by greeting the user and offering to analyze their financial data.`;

  useEffect(() => {
    if (isOpen) {
      setMessages([]); // Reset on open
      setIsLoading(true);

      if (!ai) {
        setMessages([{ role: 'model', content: '<p>The AI Analyst is currently unavailable. Please ensure the API key is configured correctly by the administrator.</p>' }]);
        setIsLoading(false);
        return;
      }

      const sendInitialMessage = async () => {
        try {
          const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: "Hello, introduce yourself and offer to help." }] }],
            config: { systemInstruction },
          });

          let text = '';
          setMessages([{ role: 'model', content: '' }]);
          for await (const chunk of response) {
            text += chunk.text;
            setMessages([{ role: 'model', content: text }]);
          }
        } catch (error) {
          console.error("Error sending initial message:", error);
          setMessages([{ role: 'model', content: '<p>Hello! I am ready to analyze your financial data. How can I assist you today?</p>' }]);
        } finally {
          setIsLoading(false);
        }
      };
      sendInitialMessage();
    }
  }, [isOpen, ai, systemInstruction]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading || !ai) return;

    const newUserMessage: Message = { role: 'user', content: messageText };
    const messagesForApi = [...messages, newUserMessage];
    
    setMessages(prev => [...prev, newUserMessage, { role: 'model', content: '' }]);
    setInput('');
    setIsLoading(true);

    const fullPromptForLastMessage = `
      CONTEXT:
      ${financialData}

      QUESTION:
      ${messageText}
    `;

    const historyForApi = messagesForApi.map((msg, index) => {
      if (msg.role === 'user' && index === messagesForApi.length - 1) {
        return { role: msg.role, parts: [{ text: fullPromptForLastMessage }] };
      }
      if (msg.role === 'model') {
         return { role: msg.role, parts: [{ text: msg.content }] };
      }
      return { role: 'user', parts: [{ text: msg.content }] };
    });
    
    const cleanHistory = historyForApi.filter(msg => msg.parts[0].text.trim() !== '');


    try {
      const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: cleanHistory,
        config: { systemInstruction },
      });

      let text = '';
      for await (const chunk of response) {
          text += chunk.text;
          setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: 'model', content: text };
              return newMessages;
          });
      }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', content: '<p>Sorry, I encountered an error. Please try again.</p>' };
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl h-[80vh] bg-[#1A1D31]/80 backdrop-blur-2xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-700"><Sparkles className="h-6 w-6 text-purple-400" /></div>
            <h2 className="text-xl font-bold text-white">AI Financial Analyst</h2>
          </div>
          <Button onClick={onClose} className="text-white hover:bg-white/10 rounded-full p-2 h-auto"><X className="h-5 w-5" /></Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-purple-500/80 flex items-center justify-center flex-shrink-0"><Sparkles className="w-5 h-5 text-white" /></div>}
              <div className={`max-w-md p-4 rounded-2xl prose prose-invert prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-strong:text-white/95 ${msg.role === 'user' ? 'bg-blue-600/80 rounded-br-none text-white/90' : 'bg-slate-800/80 rounded-bl-none text-slate-300'}`}>
                 {msg.role === 'user' 
                   ? <div>{msg.content}</div>
                   : <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                 }
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length-1]?.role === 'user' && (
             <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-purple-500/80 flex items-center justify-center flex-shrink-0"><Sparkles className="w-5 h-5 text-white" /></div>
                 <div className="max-w-md p-4 rounded-2xl bg-slate-800/80 rounded-bl-none flex items-center space-x-2">
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-slate-700 flex-shrink-0">
         {messages.length <= 1 && !isLoading && ai && (
            <div className="flex flex-wrap gap-2 mb-3">
                {PROMPT_SUGGESTIONS.map(prompt => (
                    <button key={prompt} onClick={() => handleSendMessage(prompt)} className="px-3 py-1 bg-slate-800/60 text-sm text-blue-300 rounded-full hover:bg-slate-700/80 transition-colors">
                        {prompt}
                    </button>
                ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={!ai ? "AI is unavailable." : "Ask about your financial data..."}
              disabled={isLoading || !ai}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <Button type="submit" disabled={isLoading || !input.trim() || !ai} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-2 h-auto disabled:bg-slate-600">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
};