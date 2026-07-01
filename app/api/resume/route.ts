import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { store } from '@/lib/data/store';
import { ResumePDF } from '@/lib/resume/ResumePDF';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const [settings, experiences, projects, skills] = await Promise.all([
      store.getSettings(),
      store.listExperience(),
      store.listProjects(),
      store.listSkills(),
    ]);

    const buffer = await renderToBuffer(
      React.createElement(ResumePDF, {
        profile: settings.profile,
        experiences,
        projects,
        skills,
      }) as any,
    );

    // Convert Node Buffer to Uint8Array for Web Response compatibility
    const body = new Uint8Array(buffer);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="henok-amdiye-resume.pdf"',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (err) {
    console.error('Resume PDF render failed:', err);
    return NextResponse.json(
      { error: 'Resume generation failed' },
      { status: 500 },
    );
  }
}