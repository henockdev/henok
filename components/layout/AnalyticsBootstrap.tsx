'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Lightweight client-side analytics. POSTs a 'visit' (or 'project_view'/'blog_view')
// event on page load. Server-side filtered to avoid logging admin requests.
export function AnalyticsBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/admin')) return;

    const type = pathname.startsWith('/blog/')
      ? 'blog_view'
      : pathname.startsWith('/projects/')
        ? 'project_view'
        : 'visit';

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        path: pathname,
        ref: typeof document !== 'undefined' ? document.referrer : '',
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
