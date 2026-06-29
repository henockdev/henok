import { store } from '@/lib/data/store';
import type { Project, Experience, Skill, BlogPost } from '@/lib/types';

// Lightweight RAG: we assemble a context blob from Henok's portfolio content,
// score it against the user's question with simple keyword overlap, and feed
// the top snippets to the LLM. If no OPENAI_API_KEY is set, we return a
// retrieval-only answer built from the matched snippets — still useful,
// always deterministic.

interface Snippet {
  source: string;
  text: string;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function score(query: string, text: string): number {
  const qTokens = new Set(tokenize(query));
  const tTokens = tokenize(text);
  if (tTokens.length === 0) return 0;
  let hits = 0;
  for (const t of tTokens) if (qTokens.has(t)) hits++;
  return hits / Math.sqrt(tTokens.length);
}

function pickTop(snippets: Snippet[], query: string, n = 5): Snippet[] {
  return [...snippets]
    .map((s) => ({ ...s, _score: score(query, s.text) }))
    .sort((a, b) => (b as Snippet & { _score: number })._score - (a as Snippet & { _score: number })._score)
    .slice(0, n)
    .map(({ source, text }) => ({ source, text }));
}

async function buildCorpus(): Promise<Snippet[]> {
  const [projects, experiences, skills, posts, settings] = await Promise.all([
    store.listProjects(),
    store.listExperience(),
    store.listSkills(),
    store.listPosts(true),
    store.getSettings(),
  ]);

  const snippets: Snippet[] = [];

  snippets.push({
    source: 'profile',
    text: `${settings.profile.name}. ${settings.profile.headline}. Based in ${settings.profile.location}. Bio: ${settings.profile.bio}. Languages: ${settings.profile.languages.join(', ')}.`,
  });

  for (const e of experiences) {
    snippets.push({
      source: `experience:${e.id}`,
      text: `${e.position} at ${e.company} (${e.startDate} – ${e.endDate ?? 'present'}). ${e.description} Responsibilities: ${e.responsibilities.join('; ')}. Achievements: ${e.achievements.join('; ')}. Stack: ${e.technologies.join(', ')}.`,
    });
  }

  for (const p of projects as Project[]) {
    if (p.status !== 'published' && p.status !== 'featured' && p.status !== 'pinned') continue;
    snippets.push({
      source: `project:${p.slug}`,
      text: `Project: ${p.title}. ${p.shortDescription} Category: ${p.category}. Stack: ${p.technologies.join(', ')}. ${p.fullDescription} Impact: ${p.businessImpact ?? ''} Lessons: ${p.lessonsLearned ?? ''}`,
    });
  }

  for (const s of skills as Skill[]) {
    snippets.push({
      source: `skill:${s.name}`,
      text: `Skill: ${s.name} (${s.category}). Proficiency ${s.proficiency}%, ${s.years} years, used in ${s.projects} projects.`,
    });
  }

  for (const post of posts as BlogPost[]) {
    snippets.push({
      source: `post:${post.slug}`,
      text: `Blog: ${post.title}. ${post.excerpt} ${post.content.slice(0, 400)}`,
    });
  }

  return snippets;
}

function retrievalOnlyAnswer(question: string, top: Snippet[]): string {
  if (top.length === 0) {
    return "I don't have a confident answer from Henok's portfolio on that yet. Try asking about his projects, experience, skills, or recent writing — or reach out via the contact form.";
  }

  const intro = pickIntro(question);
  const bullets = top
    .slice(0, 4)
    .map((s) => `- ${s.text.split(/(?<=\.)\s/)[0].slice(0, 220)}`)
    .join('\n');

  return `${intro}\n\nHere's what I found:\n\n${bullets}\n\n_Source: ${top.map((s) => s.source).join(', ')}_`;
}

function pickIntro(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('hire') || q.includes('available') || q.includes('contact'))
    return "Henok is open to interesting full-time and contract work.";
  if (q.includes('ai') || q.includes('llm') || q.includes('machine learning'))
    return "AI is one of Henok's focus areas — here's what he's built.";
  if (q.includes('mobile') || q.includes('react native') || q.includes('flutter'))
    return "Mobile is a core lane. Here's his recent mobile work.";
  if (q.includes('bank') || q.includes('itsm') || q.includes('incident'))
    return "On the ITSM / banking side, here's what he's owned.";
  if (q.includes('skill') || q.includes('stack') || q.includes('language'))
    return "Here's a snapshot of Henok's stack.";
  return "Here's what I can tell you from Henok's portfolio.";
}

export async function ask(question: string): Promise<{ answer: string; sources: string[] }> {
  const corpus = await buildCorpus();
  const top = pickTop(corpus, question, 6);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { answer: retrievalOnlyAnswer(question, top), sources: top.map((t) => t.source) };
  }

  // LLM mode
  const systemPrompt = `You are "Ask Henok AI" — an assistant that answers questions about Henok Amdiye Endeshaw based ONLY on the provided context. Be concise, confident, and never invent facts. If the context doesn't contain the answer, say so and suggest the contact form. Always end with 1–2 relevant follow-up questions.`;
  const userPrompt = `Question: ${question}\n\nContext:\n${top.map((t, i) => `[${i + 1}] (${t.source}) ${t.text}`).join('\n\n')}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content ?? retrievalOnlyAnswer(question, top);
    return { answer, sources: top.map((t) => t.source) };
  } catch {
    return { answer: retrievalOnlyAnswer(question, top), sources: top.map((t) => t.source) };
  }
}
