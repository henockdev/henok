'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send, Loader2, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

const suggestions = [
  "What AI projects has Henok built?",
  "Tell me about his banking experience.",
  "What's his strongest stack?",
  "Is he available to hire?",
  "Show me his mobile work.",
];

export function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi — I'm Ask Henok AI. Ask me anything about Henok's work, experience, or availability." },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.answer, sources: data.sources }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: "Sorry — I couldn't reach the assistant right now. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: 'var(--gradient-primary)', boxShadow: '0 10px 40px rgba(56, 189, 248, 0.4)' }}
        aria-label="Open Ask Henok AI"
      >
        <Sparkles size={20} className="text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-bg animate-pulse" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[min(420px,calc(100vw-3rem))] h-[min(640px,calc(100vh-6rem))] glass-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]" style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(139,92,246,0.1))' }}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Ask Henok AI</div>
                  <div className="text-[11px] text-text-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    RAG over Henok's portfolio
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition" aria-label="Close">
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'glass rounded-bl-sm'
                    }`}
                    style={m.role === 'user' ? { background: 'var(--gradient-primary)' } : {}}
                  >
                    {m.content}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-text-secondary">
                        Sources: {m.sources.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="glass px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2 text-sm text-text-secondary">
                    <Loader2 size={14} className="animate-spin" />
                    Thinking…
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-2.5 py-1 text-xs rounded-full glass hover:bg-white/[0.08] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-3 border-t border-white/[0.06]"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] focus-within:border-accent-blue/40 transition">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, skills, experience…"
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-text-secondary"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40 transition"
                  style={{ background: 'var(--gradient-primary)' }}
                  aria-label="Send"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
