'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, Loader2, Wand2, Code2, Briefcase, ChevronRight, Cpu } from 'lucide-react';

/**
 * AIDemoSection
 * ─────────────────────────────────────────────────────────────
 * "Try my AI" hero feature. Three clickable example prompts
 * fire a real RAG-backed answer, showing visitors that the
 * assistant is live, not a marketing gimmick.
 */

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

const PROMPTS = [
  {
    icon: Code2,
    title: 'Show me your AI work',
    body: 'What AI projects has Henok built?',
    gradient: 'linear-gradient(135deg,#A78BFA,#8B5CF6)',
  },
  {
    icon: Briefcase,
    title: 'Banking experience',
    body: 'Tell me about his banking experience.',
    gradient: 'linear-gradient(135deg,#38BDF8,#22D3EE)',
  },
  {
    icon: Wand2,
    title: 'Should I hire him?',
    body: 'What are his strongest skills and is he available to hire?',
    gradient: 'linear-gradient(135deg,#F472B6,#EC4899)',
  },
];

const SYSTEM_HINT = "Hi — I'm Ask Henok AI, grounded in his actual portfolio. Pick a prompt or ask your own.";

export function AIDemoSection() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: SYSTEM_HINT },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(text: string, idx?: number) {
    const q = text.trim();
    if (!q || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setLoading(true);
    if (typeof idx === 'number') setActiveIdx(idx);
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.answer || "(No response)",
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: "Sorry — couldn't reach the assistant right now. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
      setActiveIdx(null);
    }
  }

  return (
    <section id="ai" className="section-pad relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.5), transparent 70%)' }}
        />
      </div>

      <div className="container-tight relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/[0.12] mb-6">
            <Sparkles size={14} className="text-accent-blue" />
            <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              Try my AI — live
            </span>
          </div>
          <h2 className="heading-2 mb-4 text-balance">
            <span className="text-white">Ask Henok</span>{' '}
            <span className="gradient-text">anything</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-base md:text-lg leading-relaxed text-balance">
            Real RAG over the portfolio — projects, experience, skills. Click a prompt and watch it answer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Prompt cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <div className="text-xs uppercase tracking-widest text-text-secondary/70 mb-1">
              Try one of these
            </div>
            {PROMPTS.map((p, i) => {
              const Icon = p.icon;
              const active = activeIdx === i;
              return (
                <motion.button
                  key={p.title}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => send(p.body, i)}
                  disabled={loading}
                  className={`group relative text-left p-5 rounded-2xl glass-card border transition-all overflow-hidden ${
                    active ? 'border-accent-blue/40' : 'border-white/[0.08] hover:border-white/[0.18]'
                  }`}
                >
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{ background: p.gradient }}
                  />
                  <div className="relative flex items-start gap-4">
                    <div
                      className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: p.gradient }}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white mb-1">{p.title}</div>
                      <div className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                        &ldquo;{p.body}&rdquo;
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-text-secondary group-hover:text-accent-blue group-hover:translate-x-1 transition-all mt-1"
                    />
                  </div>
                </motion.button>
              );
            })}

            <div className="mt-2 p-4 rounded-2xl glass border border-white/[0.06] flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-accent-blue/15">
                <Cpu size={16} className="text-accent-blue" />
              </div>
              <div className="text-xs text-text-secondary leading-relaxed">
                <span className="text-white font-medium">How it works:</span> A retrieval pipeline searches
                the portfolio&apos;s projects, experience, and skills; the top matches are passed to an LLM
                with strict grounding so answers stay factual.
              </div>
            </div>
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="relative h-full min-h-[480px] glass-strong rounded-3xl border border-white/[0.1] overflow-hidden flex flex-col">
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 border-b border-white/[0.08]"
                style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.10), rgba(139,92,246,0.10))' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <Bot size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">Ask Henok AI</div>
                    <div className="text-[11px] text-text-secondary flex items-center gap-1.5">
                      <span className="relative flex w-2 h-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
                      </span>
                      RAG over the portfolio · live
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        m.role === 'user'
                          ? 'text-white rounded-br-sm'
                          : 'glass rounded-bl-sm text-white/90'
                      }`}
                      style={
                        m.role === 'user'
                          ? { background: 'var(--gradient-primary)' }
                          : undefined
                      }
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
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="glass px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2 text-sm text-text-secondary">
                        <Loader2 size={14} className="animate-spin" />
                        Thinking…
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="p-4 border-t border-white/[0.08]"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] focus-within:border-accent-blue/40 transition">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about projects, skills, experience…"
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-text-secondary"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 rounded-lg flex items-center justify-center disabled:opacity-40 transition"
                    style={{ background: 'var(--gradient-primary)' }}
                    aria-label="Send"
                  >
                    <Send size={14} className="text-white" />
                  </button>
                </div>
                <div className="text-[10px] text-text-secondary/70 mt-2 text-center">
                  Powered by a RAG pipeline grounded in this portfolio
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}