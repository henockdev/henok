import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

/**
 * ResumePDF
 * ─────────────────────────────────────────────────────────────
 * A single-page, ATS-friendly resume PDF that matches the
 * portfolio's visual identity (sky → violet → cyan gradient
 * accents on a clean light layout).
 */

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 36,
    paddingVertical: 32,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0F172A',
    lineHeight: 1.4,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: '#0EA5E9',
    paddingBottom: 10,
    marginBottom: 14,
  },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#0F172A' },
  title: { fontSize: 10, color: '#475569', marginTop: 2 },
  contact: { fontSize: 8, color: '#475569', textAlign: 'right' },
  contactLine: { marginBottom: 1 },
  // Sections
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0EA5E9',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  // Summary
  summary: { fontSize: 9, color: '#1E293B', lineHeight: 1.5 },
  // Experience
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  role: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0F172A' },
  date: { fontSize: 8, color: '#64748B' },
  company: { fontSize: 9, color: '#0EA5E9', fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  bullets: { marginLeft: 8 },
  bullet: { fontSize: 9, color: '#1E293B', marginBottom: 2, flexDirection: 'row' },
  bulletDot: { width: 6, color: '#0EA5E9', fontFamily: 'Helvetica-Bold' },
  bulletText: { flex: 1 },
  // Two-column
  row: { flexDirection: 'row', gap: 14 },
  col: { flex: 1 },
  // Skills
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillCat: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    width: 80,
  },
  skillVals: { flex: 1, fontSize: 8, color: '#475569' },
  // Projects
  projectTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#0F172A' },
  projectDesc: { fontSize: 8, color: '#475569', marginBottom: 4, marginTop: 1 },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#94A3B8',
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 4,
  },
});

interface ResumeProps {
  profile: any;
  experiences: any[];
  projects: any[];
  skills: any[];
}

export function ResumePDF({ profile, experiences, projects, skills }: ResumeProps) {
  const featuredProjects = projects
    .filter((p) => ['published', 'featured', 'pinned'].includes(p.status))
    .slice(0, 4);

  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject="Software Engineer Resume"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.title}>{profile.headline}</Text>
          </View>
          <View style={styles.contact}>
            <Text style={styles.contactLine}>{profile.location}</Text>
            <Text style={styles.contactLine}>{profile.email}</Text>
            {profile.phone && <Text style={styles.contactLine}>{profile.phone}</Text>}
            <Text style={styles.contactLine}>
              {profile.social?.website?.replace(/^https?:\/\//, '')}
            </Text>
            <Text style={styles.contactLine}>
              {profile.social?.github?.replace(/^https?:\/\//, '')} · {profile.social?.linkedin?.replace(/^https?:\/\//, '')}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{profile.bio}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experiences.map((e, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <View style={styles.jobHeader}>
                <Text style={styles.role}>{e.role}</Text>
                <Text style={styles.date}>
                  {formatDate(e.startDate)} — {e.endDate ? formatDate(e.endDate) : 'Present'}
                </Text>
              </View>
              <Text style={styles.company}>
                {e.company}
                {e.location ? ` · ${e.location}` : ''}
              </Text>
              {e.highlights?.length ? (
                <View style={styles.bullets}>
                  {e.highlights.slice(0, 4).map((h: string, j: number) => (
                    <View key={j} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              ) : e.description ? (
                <Text style={{ fontSize: 8, color: '#1E293B' }}>{e.description}</Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Two-column: Projects + Skills */}
        <View style={[styles.row, { marginBottom: 12 }]}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Selected Projects</Text>
            {featuredProjects.map((p, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.projectTitle}>
                  {p.title}
                  {p.category ? ` · ${p.category}` : ''}
                </Text>
                <Text style={styles.projectDesc}>{p.shortDescription}</Text>
              </View>
            ))}
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {groupSkillsByCategory(skills).map(([cat, vals], i) => (
              <View key={i} style={styles.skillRow}>
                <Text style={styles.skillCat}>{cat}</Text>
                <Text style={styles.skillVals}>{vals.join(', ')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Education / certs placeholder — left out unless data exists */}

        <View style={styles.footer} fixed>
          <Text>{profile.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

function formatDate(iso: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

function groupSkillsByCategory(skills: any[]): [string, string[]][] {
  const map: Record<string, string[]> = {};
  for (const s of skills) {
    const cat = s.category || 'Other';
    if (!map[cat]) map[cat] = [];
    map[cat].push(s.name);
  }
  // stable order
  const order = [
    'Languages',
    'Frontend',
    'Backend',
    'Mobile',
    'AI / ML',
    'Database',
    'Cloud / DevOps',
    'Tools',
    'Other',
  ];
  return order.filter((k) => map[k]?.length).map((k) => [k, map[k]]);
}