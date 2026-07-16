// Case-study metadata used by the homepage work grid, case-study heroes, and
// the "next project" navigation.
//
// NOTE: `year` is inferred from I-Chieh's career timeline (New Relic 2022–present,
// ITONICS 2019–2020) — the original cargo site did not list per-project years.
// Adjust these to the real dates.

export interface Project {
  slug: string;
  client: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  /** Short discipline label shown on the homepage work card. */
  discipline: string;
  cover?: string;
  /** When true, the homepage card shows the cover contained on a warm
      light-grey pad (for edge-to-edge screenshots that need breathing room). */
  coverPad?: boolean;
}

export const projects: Project[] = [
  {
    slug: "ai-context-layer",
    client: "Enterprise observability",
    title: "AI Personalization",
    subtitle: "Shaping how the AI reasons about context",
    year: "2026",
    role: "UX strategist",
    discipline: "UX strategy",
    cover: "/images/ai-context-layer/cover.svg",
  },
  {
    slug: "scorecard-gamification",
    client: "New Relic",
    title: "Scorecards & Gamification",
    subtitle: "Drive engineering standards and ownership",
    year: "2025",
    role: "Lead designer",
    discipline: "Product design",
    cover: "/images/scorecard-gamification/cover.svg",
  },
  {
    slug: "session-replay",
    client: "New Relic",
    title: "Session Replay",
    subtitle: "Unified context for faster troubleshooting",
    year: "2024",
    role: "Design lead",
    discipline: "Product design",
    cover: "/images/session-replay/cover.png",
  },
  {
    slug: "sli-query-builder",
    client: "New Relic",
    title: "SLI Query Builder",
    subtitle: "Making SLI setup accessible at scale",
    year: "2023",
    role: "Lead designer",
    discipline: "Product design",
    cover: "/images/sli-query-builder/cover.png",
    coverPad: true,
  },
  {
    slug: "itonics-design-system",
    client: "ITONICS Cloud",
    title: "Design System",
    subtitle: "Accelerating development with systematic design",
    year: "2020",
    role: "Sole designer",
    discipline: "Design system",
    cover: "/images/itonics-design-system/cover.png",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
