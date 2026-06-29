import { HeroEnhanced } from '@/components/hero/HeroEnhanced';
import { About } from '@/components/sections/About';
import { SkillsDashboardEnhanced } from '@/components/sections/SkillsEnhanced';
import { ProjectsShowcaseEnhanced } from '@/components/sections/ProjectsEnhanced';
import { ExperienceTimeline } from '@/components/sections/Experience';
import { Achievements } from '@/components/sections/Achievements';
import { GithubStats } from '@/components/sections/GithubStats';
import { ContactSection } from '@/components/sections/Contact';
import { BlogPreview } from '@/components/blog/BlogPreview';
import { store } from '@/lib/data/store';
import { fetchGitHubSummary } from '@/lib/data/github';

export const revalidate = 60;

export default async function HomePage() {
  const [projects, experiences, skills, posts, certs, testimonials, achievements, settings] = await Promise.all([
    store.listProjects(),
    store.listExperience(),
    store.listSkills(),
    store.listPosts(true),
    store.listCertifications(),
    store.listTestimonials(),
    store.listAchievements(),
    store.getSettings(),
  ]);
  const github = await fetchGitHubSummary();

  const publishedProjects = projects.filter((p: import('@/lib/types').Project) => ['published', 'featured', 'pinned'].includes(p.status));
  const publishedPosts = posts.slice(0, 3);

  return (
    <>
      {/* Enhanced Hero Section with animations and floating particles */}
      <HeroEnhanced />

      {/* About Section - Shows your story and background */}
      <About />

      {/* Enhanced Skills Dashboard with 3D effects and progress animations */}
      <SkillsDashboardEnhanced skills={skills} />

      {/* Enhanced Projects Showcase with search, filters, and hover effects */}
      <ProjectsShowcaseEnhanced projects={publishedProjects} />

      {/* Experience Timeline - Shows your career journey */}
      <ExperienceTimeline experiences={experiences} />

      {/* Achievements Section - Certifications, testimonials, awards */}
      <Achievements items={achievements} certs={certs} testimonials={testimonials} />

      {/* GitHub Stats - Your activity and contributions */}
      <GithubStats data={github} />

      {/* Blog Preview - Latest articles and thoughts */}
      <BlogPreview posts={publishedPosts} />

      {/* Contact Section - Get in touch */}
      <ContactSection
        email={settings.profile.email}
        location={settings.profile.location}
        social={settings.profile.social}
      />
    </>
  );
}
