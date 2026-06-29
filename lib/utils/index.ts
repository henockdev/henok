import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | Date, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' }) {
  const d = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat('en-US', opts).format(d);
}

export function formatDateRange(start: string, end?: string | null) {
  const s = formatDate(start);
  const e = end ? formatDate(end) : 'Present';
  return `${s} — ${e}`;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function truncate(str: string, n: number) {
  if (str.length <= n) return str;
  return str.slice(0, n - 1) + '…';
}
