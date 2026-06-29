// All shared types for the portfolio platform.

export type ProjectCategory =
  | 'AI'
  | 'Web'
  | 'Mobile'
  | 'ITSM'
  | 'Automation'
  | 'Open Source'
  | 'Enterprise'
  | 'Freelance'
  | 'Research'
  | 'Personal';

export type ProjectStatus = 'draft' | 'scheduled' | 'published' | 'archived' | 'featured' | 'pinned';

export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'pdf' | 'diagram';
  url: string;
  alt?: string;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProjectCategory;
  client?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  technologies: string[];
  architecture?: string;
  lessonsLearned?: string;
  challenges?: string;
  businessImpact?: string;
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
  pinned: boolean;
  thumbnail?: string;
  banner?: string;
  media: MediaAsset[];
  metrics?: { label: string; value: string }[];
  timeline?: { label: string; date: string }[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  logo?: string;
  createdAt: string;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'AI' | 'Databases' | 'Cloud' | 'DevOps' | 'Networking' | 'ITSM';
  proficiency: number; // 0-100
  years: number;
  projects: number;
  icon?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  position: string;
  photo?: string;
  review: string;
  rating: number; // 1-5
  videoUrl?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'Award' | 'Recognition' | 'Publication' | 'Speaking' | 'Milestone';
  icon?: string;
  url?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  coverImage?: string;
  tags: string[];
  category: string;
  readingTime: number;
  published: boolean;
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived' | 'spam';
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'visit' | 'project_view' | 'resume_download' | 'contact_request' | 'blog_view';
  path?: string;
  ref?: string;
  country?: string;
  ua?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor';
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface SiteSettings {
  profile: {
    name: string;
    headline: string;
    location: string;
    bio: string;
    avatar?: string;
    resumeUrl?: string;
    email: string;
    phone?: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
    languages: string[];
  };
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  theme: {
    defaultMode: 'dark' | 'light';
  };
}
