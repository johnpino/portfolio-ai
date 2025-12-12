# Generative UI Block Documentation

This document serves as the "System Context" for the AI Layout Engine. It defines the available UI building blocks that can be mixed and matched to create personalized portfolios.

## Block Types Overview

| Block Type | Purpose | Best For |
| :--- | :--- | :--- |
| `hero` | Main introduction | Top of every page |
| `headline` | Bold statement | Breaking up sections, emphasizing a philosophy |
| `system-metrics` | Stats dashboard | Showing scale/impact (PMs/Execs) |
| `quick-resume` | work history summary | Recruiters |
| `skills-grid` | Detailed technical caps | Engineers/CTOs |
| `code-insight` | Syntax-highlighted code | Proving technical depth |
| `problem-solution` | Split narrative | Storytelling (STAR method) |
| `testimonial` | Social proof | Trust building |
| `career-timeline` | Visual history | Career growth narrative |
| `tech-ecosystem` | Connected graph | Showing breadth/system design |
| `case-studies-list`| Project list | Showcasing work |
| `gallery` | Visual grid | Designers/Frontend emphasis |

---

## Block Definitions & Props

### 1. Hero (`hero`)
Standard landing page hero with title, subtitle, and CTA.
```typescript
interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}
```

### 2. Headline (`headline`)
A large, typographic component for impact.
```typescript
interface HeadlineProps {
  text: string;
  size: 'xl' | '2xl'; // xl = section header, 2xl = massive statement
  align: 'left' | 'center';
}
```

### 3. System Metrics (`system-metrics`)
A grid of Key Performance Indicators (KPIs).
```typescript
interface MetricItem {
  label: string;
  value: string;
  trend?: string; // e.g., "+20%"
  trendDirection?: 'up' | 'down' | 'neutral';
}

interface SystemMetricsProps {
  metrics: MetricItem[]; // Recommended max 4 items
}
```

### 4. Quick Resume (`quick-resume`)
A dense, scannable summary of experience.
```typescript
interface ExperienceItem {
  role: string;
  company: string;
  years: string;
  location?: string;
}

interface QuickResumeProps {
  summary: string;
  experience: ExperienceItem[];
  education?: string;
}
```

### 5. Skills Grid (`skills-grid`)
The core technical skills display using `SkillCard`.
```typescript
interface SkillsGridProps {
  title: string;
  skills: Skill[]; // See types/skills.ts
}
```

### 6. Code Insight (`code-insight`)
A visual window displaying code snippets.
```typescript
interface CodeInsightProps {
  title: string; // File path or title
  code: string;
  language?: string;
  caption?: string; // Explanation of the code
}
```

### 7. Problem / Solution (`problem-solution`)
A split-screen layout contrasting a problem with a solution.
```typescript
interface ProblemSolutionProps {
  problem: string; // The "Before" state (Warning style)
  solution: string; // The "After" state (Success style)
}
```

### 8. Testimonial (`testimonial`)
A blockquote for social proof.
```typescript
interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}
```

### 9. Career Timeline (`career-timeline`)
A vertical connected list of milestones.
```typescript
interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

interface CareerTimelineProps {
  items: TimelineItem[];
}
```

### 10. Tech Stack Ecosystem (`tech-ecosystem`)
An "Orbital Hub" visualization.
```typescript
interface TechStackEcosystemProps {
  centralNode: string; // The core skill (e.g., "React")
  connectedNodes: string[]; // List of related skills
}
```

### 11. Case Studies List (`case-studies-list`)
A list of selected projects.
```typescript
interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
}

interface CaseStudiesListProps {
  title: string;
  projects: Project[];
}
```

### 12. Gallery (`gallery`)
A grid of visual assets.
```typescript
interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
}
```
