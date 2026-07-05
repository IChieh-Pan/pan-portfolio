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
  cover?: string;
}

export const projects: Project[] = [
  {
    slug: "ai-context-layer",
    client: "New Relic",
    title:
      "Bringing design thinking to the context layer of an AI-native product.",
    subtitle: "Personalization for an observability agent.", // TODO: placeholder subtitle
    year: "2025", // TODO: confirm
    role: "Product Design", // TODO: confirm
    // No cover image yet — a placeholder card shows until one is added.
  },
  {
    slug: "session-replay",
    client: "New Relic",
    title: "Session Replay",
    subtitle: "Unified context for faster troubleshooting",
    year: "2024",
    role: "Design lead",
    cover: "/images/session-replay/cover.png",
  },
  {
    slug: "sli-query-builder",
    client: "New Relic",
    title: "SLI Query Builder",
    subtitle: "Making SLI setup accessible at scale",
    year: "2023",
    role: "Lead designer",
    cover: "/images/sli-query-builder/cover.png",
  },
  {
    slug: "itonics-design-system",
    client: "ITONICS",
    title: "Cloud Design System",
    subtitle: "Accelerating development with systematic design",
    year: "2020",
    role: "Sole designer",
    cover: "/images/itonics-design-system/cover.png",
  },
  {
    slug: "itonics-web-clipper",
    client: "ITONICS",
    title: "Web Clipper",
    subtitle: "Standardizing how teams capture web insight",
    year: "2019",
    role: "UX/UI designer",
    cover: "/images/itonics-web-clipper/cover.png",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
