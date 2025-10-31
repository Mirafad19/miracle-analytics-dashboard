
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
      <Bot className="h-8 w-8 relative" />
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
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = useMemo(() => {
    const apiKey = process.env.API_KEY;
    // The build script replaces process.env.API_KEY with its string value.
    // If the key is not set in Vercel, it becomes the string "undefined".
    if (apiKey && apiKey !== "undefined") {
      try {
        setError(null);
        return new GoogleGenAI({ apiKey });
      } catch (e: any) {
        console.error("Failed to initialize GoogleGenAI:", e);
        setError(`Could not initialize the AI Analyst. The API key might be invalid. Details: ${e.message}`);
        return null;
      }
    }
    console.warn("API_KEY environment variable not found or is 'undefined'.");
    setError("The AI Analyst is not configured. Please contact the administrator to set up the API key in the deployment environment.");
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

      if (error || !ai) {
        setMessages([{ role: 'model', content: `<p class="text-red-500 dark:text-red-400">${error || 'The AI Analyst is currently unavailable.'}</p>` }]);
        setIsLoading(false);
        return;
      }

      const sendInitialMessage = async () => {
        try {
          const initialPrompt = `The user has opened the chat. Please greet them and offer to analyze their financial data. Here is the data for context, but do not show it to the user unless they ask for specific figures: \n\n${financialData}`;
          const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: initialPrompt }] }],
            config: { systemInstruction },
          });
          
          let content = '';
          for await (const chunk of response) {
              content += chunk.text;
          }

          setMessages([{ role: 'model', content }]);
        } catch (error: any) {
          console.error('Error with initial AI message:', error);
          const errorMessage = error.message || 'An unknown error occurred.';
          setMessages([{ role: 'model', content: `<p class="text-red-500 dark:text-red-400">Sorry, I encountered an error. Please check your API key and network connection. <br/><br/><strong>Details:</strong> ${errorMessage}</p>` }]);
        } finally {
          setIsLoading(false);
        }
      };

      sendInitialMessage();
    }
  }, [isOpen, ai, financialData, systemInstruction, error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent, prompt?: string) => {
    e.preventDefault();
    const userMessage = prompt || input;
    if (!userMessage.trim() || !ai) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null); // Clear previous errors on new submission

    try {
        const fullPrompt = `CONTEXT:\n${financialData}\n\nUSER QUESTION: ${userMessage}`;
        
        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: fullPrompt }] }],
            config: { systemInstruction }
        });

        let newContent = '';
        for await (const chunk of response) {
            newContent += chunk.text;
        }
        setMessages(prev => [...prev, { role: 'model', content: newContent }]);
    } catch (error: any) {
        console.error('Error generating content:', error);
        const errorMessage = error.message || 'An unknown error occurred.';
        setMessages(prev => [...prev, { role: 'model', content: `<p class="text-red-500 dark:text-red-400">There was an issue processing your request. <br/><br/><strong>Details:</strong> ${errorMessage}</p>` }]);
    } finally {
        setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl h-[80vh] bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"><Bot className="h-6 w-6 text-purple-500 dark:text-purple-400" /></div>
            <h2 className="text-xl font-bold text-black dark:text-white">AI Financial Analyst</h2>
          </div>
          <Button onClick={onClose} className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full p-2 h-auto"><X className="h-5 w-5" /></Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-100/50 dark:bg-zinc-950/50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-purple-500 dark:text-purple-300" /></div>}
              <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500/10 dark:bg-blue-500/20 rounded-br-none text-black dark:text-white' : 'bg-transparent rounded-bl-none text-zinc-800 dark:text-zinc-200'}`}>
                <div className="prose prose-p:my-2 prose-strong:text-black dark:prose-strong:text-white prose-ul:my-2" dangerouslySetInnerHTML={{ __html: msg.content }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-purple-500 dark:text-purple-300" /></div>
              <div className="max-w-xl p-4 rounded-2xl bg-transparent rounded-bl-none">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
            <div className="flex gap-2">
                {PROMPT_SUGGESTIONS.map(prompt => (
                    <button key={prompt} onClick={(e) => handleSubmit(e, prompt)} disabled={isLoading} className="px-3 py-1 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs rounded-full transition-colors disabled:opacity-50">
                        {prompt}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your financial data..."
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 dark:bg-zinc-950 px-4 py-3 text-black dark:text-white border border-zinc-300 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:bg-purple-600/50">
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </footer>
      </div>
    </div>
  );
};
