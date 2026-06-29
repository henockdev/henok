'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TypingAnimation({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    const speed = deleting ? 40 : 90;
    const pauseAtEnd = 1400;

    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseAtEnd);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={text.length}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="inline-block"
        >
          {text}
          <span className="inline-block w-[2px] h-[1em] align-middle ml-1 bg-accent-blue animate-pulse" />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
