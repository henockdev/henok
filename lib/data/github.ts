// Fetches GitHub stats (repos, stars, contributions). Falls back to a clean
// mock when no token is configured so the UI never breaks.

interface RepoSummary {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
}

export interface GitHubSummary {
  username: string;
  totalStars: number;
  totalRepos: number;
  languages: { name: string; count: number }[];
  pinned: RepoSummary[];
  recent: RepoSummary[];
  available: boolean;
  reason?: string;
}

const MOCK: GitHubSummary = {
  username: 'Henok-Endeshaw',
  totalStars: 1240,
  totalRepos: 38,
  languages: [
    { name: 'TypeScript', count: 14 },
    { name: 'Python', count: 9 },
    { name: 'Go', count: 4 },
    { name: 'JavaScript', count: 5 },
    { name: 'Dart', count: 2 },
    { name: 'Other', count: 4 },
  ],
  pinned: [
    { name: 'smartdesk-ai', description: 'AI-powered IT service management platform.', url: 'https://github.com/Henok-Endeshaw/smartdesk-ai', stars: 312, forks: 24, language: 'TypeScript', updatedAt: new Date().toISOString() },
    { name: 'change-risk-ai', description: 'ML model that scores change requests by risk.', url: 'https://github.com/Henok-Endeshaw/change-risk-ai', stars: 188, forks: 11, language: 'Python', updatedAt: new Date().toISOString() },
    { name: 'devtool', description: 'CLI that automates the boring parts of shipping software.', url: 'https://github.com/Henok-Endeshaw/devtool', stars: 540, forks: 38, language: 'Go', updatedAt: new Date().toISOString() },
    { name: 'kb-search', description: 'Semantic search over an internal IT knowledge base.', url: 'https://github.com/Henok-Endeshaw/kb-search', stars: 96, forks: 5, language: 'Python', updatedAt: new Date().toISOString() },
  ],
  recent: [
    { name: 'smartdesk-ai', description: 'AI-powered IT service management platform.', url: 'https://github.com/Henok-Endeshaw/smartdesk-ai', stars: 312, forks: 24, language: 'TypeScript', updatedAt: new Date().toISOString() },
    { name: 'kb-search', description: 'Semantic search over an internal IT knowledge base.', url: 'https://github.com/Henok-Endeshaw/kb-search', stars: 96, forks: 5, language: 'Python', updatedAt: new Date().toISOString() },
    { name: 'change-risk-ai', description: 'ML model that scores change requests by risk.', url: 'https://github.com/Henok-Endeshaw/change-risk-ai', stars: 188, forks: 11, language: 'Python', updatedAt: new Date().toISOString() },
    { name: 'devtool', description: 'CLI that automates the boring parts of shipping software.', url: 'https://github.com/Henok-Endeshaw/devtool', stars: 540, forks: 38, language: 'Go', updatedAt: new Date().toISOString() },
  ],
  available: false,
  reason: 'mock-data',
};

export async function fetchGitHubSummary(): Promise<GitHubSummary> {
  const username = process.env.GITHUB_USERNAME || 'Henok-Endeshaw';
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ...MOCK, username };

  try {
    const headers = { Authorization: `Bearer ${token}`, 'User-Agent': 'henok-portfolio' } as Record<string, string>;
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!profileRes.ok) return { ...MOCK, username, reason: 'github-error' };
    const profile = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    if (!reposRes.ok) return { ...MOCK, username, reason: 'github-error' };
    const repos = (await reposRes.json()) as Array<{
      name: string;
      description: string | null;
      html_url: string;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      updated_at: string;
    }>;

    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const languages = new Map<string, number>();
    for (const r of repos) {
      if (!r.language) continue;
      languages.set(r.language, (languages.get(r.language) ?? 0) + 1);
    }
    const langs = [...languages.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

    const toSummary = (r: typeof repos[number]): RepoSummary => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      updatedAt: r.updated_at,
    });

    const pinned = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6).map(toSummary);
    const recent = [...repos].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)).slice(0, 6).map(toSummary);

    return {
      username,
      totalStars,
      totalRepos: profile.public_repos ?? repos.length,
      languages: langs,
      pinned,
      recent,
      available: true,
    };
  } catch {
    return { ...MOCK, username };
  }
}
