'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, title, description, align = 'left' }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} mb-16`}
    >
      {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
      <h2 className="heading-2 mb-4 text-balance">{title}</h2>
      {description && <p className="text-text-secondary text-lg leading-relaxed text-balance">{description}</p>}
    </motion.div>
  );
}
