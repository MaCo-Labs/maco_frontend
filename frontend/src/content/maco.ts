/**
 * MaCo content — mirrors the Django/DRF API shape defined in
 * 04_BACKEND_SCHEMA.md. When the backend is live, swap these
 * constants for fetches against /api/v1/* ; the field names match.
 */

/**
 * A real brand asset (client/product logo). Optional everywhere it's
 * used — a missing `brand` field means the caller falls back to text,
 * never to a placeholder image. `width`/`height` are the file's actual
 * pixel dimensions so layout never shifts (CLS) while the image loads.
 */
export interface Brand {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** A real product media asset — video pair + poster, or a still image.
 *  width/height are the poster's actual intrinsic pixels (CLS-free layout). */
export interface Media {
  poster: string;
  alt: string;
  width: number;
  height: number;
  video?: { webm: string; mp4: string };
  /** Higher-resolution, audio-bearing encode of the same clip as `video` —
   *  only wired for Bridge today, and only fetched by the fullscreen video
   *  lightbox on deliberate click. `video` stays silent/lean because
   *  ProductVideo mutes it anyway for autoplay policy. */
  feature?: { webm: string; mp4: string };
  /** Set only when this slot's poster is standing in for real product
   *  capture that doesn't exist yet (a brand illustration, not a screenshot)
   *  — rendered as a visible caption by ProductVideo. Per AGENTS.md's
   *  no-silent-placeholder rule: never let a stand-in read as the real
   *  thing. See docs/MEDIA-GAP.md for the full asset inventory. */
  note?: string;
}

export interface Service {
  slug: string;
  index: string;
  title: string;
  short_description: string;
  description: string;
  capabilities: { title: string; description: string }[];
  evidence: string[]; // project/product slugs
  seo_title: string;
  seo_description: string;
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  client: string;
  sector: string;
  year: string;
  short_description: string;
  challenge: string;
  solution: string;
  results: string;
  /** Omitted for client work that isn't a live website (e.g. a print
   *  deliverable) — callers must guard before rendering a "visit" link. */
  external_url?: string;
  technologies: string[];
  services: string[];
  seo_title: string;
  seo_description: string;
  /** The client's real logo, e.g. for the WORK rail. Optional — falls back to text. */
  brand?: Brand;
  /** Real project footage/screenshot for the WORK hover panel. Optional —
   *  falls back to the brand-mark-on-plate treatment. Mirrors `Product.media`. */
  media?: Media;
  /** Extra real screenshots (same aspect as `media.poster`) that the WORK
   *  card crossfades through. Optional — a card with only `media` shows a
   *  single static shot. `media.poster` should equal `gallery[0]`, since
   *  the gallery is a progressive enhancement over the static poster. */
  gallery?: string[];
}

export interface Product {
  slug: string;
  index: string;
  title: string;
  owner: "MaCo" | "HeadGreen";
  kind: string;
  short_description: string;
  positioning: string;
  problem: string;
  solution: string;
  target_users: string;
  features: { title: string; description: string }[];
  /** The product's real logo. Optional — falls back to text. */
  brand?: Brand;
  /** Real product footage/screenshot. Optional — falls back to the designed SurfaceMedia panel. */
  media?: Media;
  /** A real screen recording for a product that's phone-only (a PWA with
   *  no desktop surface) — looped inside a phone-frame mockup instead of
   *  the flat `media` slot, since a bare screenshot/video doesn't read as
   *  "this is a phone app" the way `media` does for a desktop capture. */
  screen?: Media;
  technologies: string[];
  live_url: string;
  seo_title: string;
  seo_description: string;
}

export const site = {
  name: "MaCo",
  category: "Software / IT solutions",
  tagline: "Software and IT solutions for products that need to work.",
  statement:
    "MaCo builds and maintains software that carries real operational weight — client platforms, internal tooling and the systems people log into every working day.",
  contact_email: "info@maco.codes",
  phones: [
    { label: "Qatar", number: "+974 3126 6690" },
    { label: "Dubai", number: "+971 54 321 0907" },
    { label: "India", number: "+91 73067 94846" },
  ],
  location: "Kochi, Kerala, India",
  nav: [
    { label: "Services", to: "/services" },
    { label: "Work", to: "/work" },
    { label: "Products", to: "/products" },
    { label: "Clients", to: "/clients" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
} as const;

/**
 * MaCo's name transliterated into other scripts — the single source for
 * both the IDENTITY section's pinned scroll-dial (identity.tsx) and the
 * footer's compact strip (chrome.tsx), so the two can never drift apart
 * the way they had before this list existed (footer previously hand-wrote
 * its own 7-script subset that didn't match Identity's 13 and included
 * Cyrillic, which matches no client market MaCo serves).
 *
 * Curated 2026-08-29 to MaCo's actual footprint (India + the Gulf, per
 * the OVERVIEW section's own copy) plus a small, deliberately short set of
 * non-Indian scripts that render cleanly at display size — fewer, more
 * intentional scripts, not an exhaustive list. Dropped from the prior
 * 13-script set: Gujarati, Punjabi, Bengali, Odia (India, but outside
 * MaCo's stated Kerala/Gulf footprint), Persian (Arabic already covers
 * the Gulf). Added: Japanese, Korean — both already in
 * `--font-script-fallback` (styles.css), so no new font request.
 */
interface NameScript {
  text: string;
  lang: string;
  code: string;
  dir?: "rtl";
}

export const nameScripts: readonly NameScript[] = [
  { text: "MaCo", lang: "English", code: "en" },
  { text: "മാകോ", lang: "Malayalam", code: "ml" },
  { text: "மாகோ", lang: "Tamil", code: "ta" },
  { text: "మాకో", lang: "Telugu", code: "te" },
  { text: "ಮಾಕೋ", lang: "Kannada", code: "kn" },
  { text: "माको", lang: "Hindi", code: "hi" },
  { text: "マコ", lang: "Japanese", code: "ja" },
  { text: "마코", lang: "Korean", code: "ko" },
  { text: "ماكو", lang: "Arabic", code: "ar", dir: "rtl" },
  { text: "מאקו", lang: "Hebrew", code: "he", dir: "rtl" },
] as const;

/**
 * Two services, 2026-08-18 — collapsed from the previous five at the
 * owner's direction (the real shape of what MaCo sells). Each
 * `capabilities` entry reuses the retired services' real descriptions
 * wherever one substantively overlaps (Task Management <- the old App
 * Development's role/reporting copy; Custom Software <- Software
 * Support's codebase/dependency copy; Websites <- Web Development's
 * site-architecture/front-end copy; Social Media Management <- Social
 * Media Managing's copy, verbatim) rather than inventing new claims.
 * CRM, E-commerce and Branding & Design have no exact retired
 * predecessor; their descriptions are written in the same restrained,
 * procedural voice as the rest of the copy — no metrics, no superlatives,
 * nothing that isn't a plain statement of what the capability covers.
 */
export const services: Service[] = [
  {
    slug: "business-software",
    index: "01",
    title: "Business Software",
    short_description:
      "Task management, CRM and custom software for the operational systems a team runs on.",
    description:
      "We build and maintain the software a business actually runs its operations on: task and workflow tools, customer relationship systems, and custom software for anything neither of those covers. Authentication, roles, records, scheduling and reporting — the unglamorous parts that decide whether a system survives contact with a real workforce — plus the ongoing maintenance to keep it patched, documented and moving forward in small, reviewable increments rather than a risky annual rewrite.",
    capabilities: [
      {
        title: "Task Management",
        description:
          "Installable, offline-tolerant tools covering scheduling, records and reporting, with administrators, operators and field users treated as distinct products.",
      },
      {
        title: "CRM",
        description:
          "Customer and pipeline records built around how a specific team actually works, not a generic template.",
      },
      {
        title: "Custom Software",
        description:
          "Bespoke systems for what falls outside task management and CRM — audited, documented and kept on a deliberate release cadence once live.",
      },
    ],
    evidence: ["drivers-diary", "bridge", "headgreen", "soorath-autos"],
    seo_title: "Business Software — MaCo",
    seo_description:
      "MaCo builds business software: task management, CRM and custom operational systems, plus the ongoing support to keep them running.",
  },
  {
    slug: "digital-solutions",
    index: "02",
    title: "Digital Solutions",
    short_description: "Websites, e-commerce, branding and design, and social media management.",
    description:
      "We design and engineer the systems a business shows the outside world: marketing sites and e-commerce platforms built to be edited, measured and maintained after launch; brand and design work; and the social channel management that keeps the same voice consistent across the site, the product and the feed.",
    capabilities: [
      {
        title: "Websites",
        description:
          "Routing, content modelling and SEO structure decided before a pixel is drawn, shipped with a Django-based admin a non-technical team can actually use.",
      },
      {
        title: "E-commerce",
        description:
          "Storefronts and checkout built on the same content-administration foundation as every other MaCo site.",
      },
      {
        title: "Branding and Design",
        description:
          "Visual identity and design systems derived for the brand, not pulled from a stock template.",
      },
      {
        title: "Social Media Management",
        description:
          "Content planning tied to launches and campaign moments, on-brand asset production, and plain reach and engagement reporting without vanity framing.",
      },
    ],
    evidence: ["ananta-nethralaya", "al-afzah", "soorath-autos", "headgreen", "ozone"],
    seo_title: "Digital Solutions — MaCo",
    seo_description:
      "MaCo delivers digital solutions: websites, e-commerce, branding and design, and social media management.",
  },
];

export const projects: Project[] = [
  {
    slug: "ananta-nethralaya",
    index: "01",
    title: "Ananta Nethralaya",
    client: "Ananta Nethralaya",
    sector: "Healthcare — Ophthalmology",
    year: "—",
    short_description: "Website for an eye clinic.",
    challenge:
      "A clinic needs a public face that answers practical questions first: what is treated here, by whom, and how does a patient reach the clinic.",
    solution:
      "A clear, calm website structured around treatments, practitioners and contact routes, with content the clinic can update itself.",
    results:
      "The clinic's services and contact details are presented in one authoritative, maintainable place.",
    external_url: "https://www.anantanethralaya.org/",
    technologies: ["Web", "CMS", "Responsive"],
    services: ["digital-solutions"],
    seo_title: "Ananta Nethralaya — Client work by MaCo",
    seo_description: "MaCo built the website for Ananta Nethralaya, an eye clinic.",
    brand: { src: "/media/brand/ananta.webp", alt: "Ananta Nethralaya", width: 640, height: 639 },
    media: {
      poster: "/media/work/ananta-nethralaya/1.webp",
      alt: "Ananta Nethralaya — the eye clinic's website, live",
      width: 1400,
      height: 662,
    },
    gallery: [
      "/media/work/ananta-nethralaya/1.webp",
      "/media/work/ananta-nethralaya/2.webp",
      "/media/work/ananta-nethralaya/3.webp",
      "/media/work/ananta-nethralaya/4.webp",
    ],
  },
  {
    slug: "al-afzah",
    index: "02",
    title: "Al Afzah",
    client: "Al Afzah Group WLL",
    sector: "Construction — Qatar",
    year: "—",
    short_description: "Website for a Qatar-based construction company.",
    challenge:
      "Construction buyers judge credibility through delivered scope. The site had to carry capability and project evidence for a regional market.",
    solution:
      "A corporate site organised around divisions, capability and completed work, built to hold a growing project record.",
    results: "Group capability and project record are presented in a single corporate destination.",
    external_url: "https://www.al-afzahgroup.com/",
    technologies: ["Web", "CMS", "Multi-section IA"],
    services: ["digital-solutions"],
    seo_title: "Al Afzah Group — Client work by MaCo",
    seo_description:
      "MaCo built the corporate website for Al Afzah Group WLL, a Qatar-based construction company.",
    brand: {
      src: "/media/brand/al-afzah.webp",
      alt: "Al Afzah Group WLL",
      width: 500,
      height: 500,
    },
    media: {
      poster: "/media/work/al-afzah/1.webp",
      alt: "Al Afzah Group — the corporate website, live",
      width: 1400,
      height: 663,
    },
    gallery: [
      "/media/work/al-afzah/1.webp",
      "/media/work/al-afzah/2.webp",
      "/media/work/al-afzah/3.webp",
      "/media/work/al-afzah/4.webp",
      "/media/work/al-afzah/5.webp",
    ],
  },
  {
    slug: "soorath-autos",
    index: "03",
    title: "Soorath Autos",
    client: "Soorath Autos",
    sector: "Automotive retail",
    year: "—",
    short_description: "Website for a pre-owned car showroom.",
    challenge:
      "Used-car buying is inventory-led. Stock changes weekly, and the website is worthless the moment it goes stale.",
    solution:
      "An inventory-forward website where listings, photography and enquiry routes are managed by the showroom directly.",
    results:
      "Showroom stock and enquiries live on a site the dealership updates without developer involvement.",
    external_url: "https://www.soorathautos.in/",
    technologies: ["Web", "Inventory content", "Enquiry capture"],
    services: ["digital-solutions"],
    seo_title: "Soorath Autos — Client work by MaCo",
    seo_description: "MaCo built the website for Soorath Autos, a pre-owned car showroom.",
    brand: { src: "/media/brand/soorath.webp", alt: "Soorath Autos", width: 640, height: 640 },
    media: {
      poster: "/media/work/soorath-autos/1.webp",
      alt: "Soorath Autos — the showroom's website, live",
      width: 1400,
      height: 670,
    },
    gallery: [
      "/media/work/soorath-autos/1.webp",
      "/media/work/soorath-autos/2.webp",
      "/media/work/soorath-autos/3.webp",
      "/media/work/soorath-autos/4.webp",
    ],
  },
  {
    slug: "headgreen",
    index: "04",
    title: "HeadGreen",
    client: "HeadGreen",
    sector: "Corporate EV mobility — Kochi",
    year: "—",
    short_description: "Website for a corporate EV fleet cab service based in Kochi, Kerala.",
    challenge:
      "HeadGreen sells to corporate transport managers, not to individual riders. The site had to speak to procurement, not to a consumer app store.",
    solution:
      "A corporate-facing website covering fleet service, coverage and contract enquiry — and the front door to the operational platform MaCo also builds.",
    results:
      "HeadGreen's public site and its internal operations platform, Driver's Diary, are maintained by the same team.",
    external_url: "https://www.headgreen.in/",
    technologies: ["Web", "Corporate enquiry", "EV fleet"],
    services: ["digital-solutions", "business-software"],
    seo_title: "HeadGreen — Client work by MaCo",
    seo_description:
      "MaCo built the website for HeadGreen, a corporate EV fleet cab service in Kochi, Kerala.",
    brand: { src: "/media/brand/headgreen.webp", alt: "HeadGreen", width: 500, height: 826 },
    media: {
      poster: "/media/work/headgreen/1.webp",
      alt: "HeadGreen — the corporate EV fleet website, live",
      width: 1400,
      height: 660,
    },
    gallery: [
      "/media/work/headgreen/1.webp",
      "/media/work/headgreen/2.webp",
      "/media/work/headgreen/3.webp",
      "/media/work/headgreen/4.webp",
    ],
  },
  {
    slug: "ozone",
    index: "05",
    title: "Ozone",
    client: "Ozone Fitout & Contracting W.L.L.",
    sector: "Interior fit-out & contracting",
    year: "—",
    short_description: "A 16-page corporate brochure for a fit-out and contracting company.",
    challenge:
      "Ozone Fitout & Contracting needed one document that could introduce the company and its service domains to a client in a single sitting — a printed, shareable brand piece, not a website.",
    solution:
      "A 16-page corporate brochure structuring interior fit-out, contracting, MEP and engineering-consultancy capability into one editorial system: company introduction, services, client and brand showcase, working process, quality policy, a project portfolio, and a QR-linked contact page.",
    results:
      "Ozone now has one brand communication piece, cover to contact page, carrying its full capability and portfolio story in a single consistent visual language.",
    technologies: ["Editorial layout", "Print design", "Brand system"],
    services: ["digital-solutions"],
    seo_title: "Ozone — Client work by MaCo",
    seo_description:
      "MaCo designed a 16-page corporate brochure for Ozone Fitout & Contracting W.L.L., an interior fit-out and contracting company.",
    brand: {
      src: "/media/brand/ozone.webp",
      alt: "Ozone Fitout & Contracting",
      width: 800,
      height: 360,
    },
  },
];

export const products: Product[] = [
  {
    slug: "drivers-diary",
    index: "01",
    title: "Driver's Diary",
    owner: "HeadGreen",
    kind: "Operational PWA",
    short_description:
      "Management, attendance, rides, payroll, documentation and reporting for HeadGreen operations.",
    positioning:
      "Built for HeadGreen. A single operational record for a fleet that runs whether or not the office is open.",
    problem:
      "Fleet operations fragment across spreadsheets, chat threads and paper: who drove, for how long, paid what, with which documents valid.",
    solution:
      "One installable platform where attendance, ride records, payroll inputs and driver documentation share the same source of truth, with reporting derived from it rather than re-entered.",
    target_users: "Fleet administrators, operations staff and drivers in the field.",
    features: [
      {
        title: "Attendance",
        description: "Daily driver attendance captured at the point it happens.",
      },
      {
        title: "Rides",
        description: "Ride records tied to drivers, vehicles and corporate accounts.",
      },
      {
        title: "Payroll inputs",
        description: "Payroll derived from recorded attendance and ride data.",
      },
      {
        title: "Documentation",
        description: "Driver and vehicle documents tracked with expiry visibility.",
      },
      { title: "Reporting", description: "Operational reporting built on the live record." },
    ],
    technologies: ["PWA", "React", "REST API", "PostgreSQL"],
    live_url: "https://prod.d25ny7hdw64pgk.amplifyapp.com/",
    seo_title: "Driver's Diary — Fleet operations platform by MaCo",
    seo_description:
      "Driver's Diary is a PWA built by MaCo for HeadGreen: attendance, rides, payroll, documentation and reporting.",
    brand: {
      src: "/media/brand/drivers-diary.webp",
      alt: "Driver's Diary",
      width: 900,
      height: 1203,
    },
    media: {
      poster: "/media/brand/drivers-diary.webp",
      alt: "Driver's Diary — a fleet operations record, visualised as HeadGreen's mark on the map it operates across",
      width: 900,
      height: 1203,
      note: "Brand illustration — not product UI. Real screen capture is pending.",
    },
    screen: {
      poster: "/media/products/drivers-diary/screen-poster.webp",
      alt: "Driver's Diary — a walkthrough of attendance, rides and payroll, recorded on device",
      width: 540,
      height: 1128,
      video: {
        webm: "/media/products/drivers-diary/screen.webm",
        mp4: "/media/products/drivers-diary/screen.mp4",
      },
    },
  },
  {
    slug: "bridge",
    index: "02",
    title: "Bridge",
    owner: "MaCo",
    kind: "SaaS / PWA + desktop",
    short_description:
      "Task and project implementation, administration, users, project analysis and task assignment.",
    positioning:
      "MaCo's own product. Bridge is aimed at the task and project management category, built from the delivery problems we hit on client work.",
    problem:
      "Project tools optimise for the board view and leave implementation, assignment discipline and analysis to the team's memory.",
    solution:
      "A platform where projects, assignment, administration and analysis are one workflow, available as a PWA and on the desktop.",
    target_users: "Delivery teams, project administrators and the people assigning the work.",
    features: [
      {
        title: "Project implementation",
        description: "Projects carried from definition through delivery in one place.",
      },
      {
        title: "Task assignment",
        description: "Explicit ownership of every task rather than an unassigned column.",
      },
      {
        title: "Administration",
        description: "Organisation, workspace and permission administration.",
      },
      { title: "Users", description: "User management with role-aware access." },
      {
        title: "Project analysis",
        description: "Progress and workload analysis from live project data.",
      },
    ],
    technologies: ["PWA", "Desktop", "React", "REST API", "PostgreSQL"],
    live_url: "https://prod.ddklo8cltmn7o.amplifyapp.com/",
    seo_title: "Bridge — Project and task platform by MaCo",
    seo_description:
      "Bridge is MaCo's SaaS/PWA and desktop platform for project implementation, task assignment, administration and analysis.",
    brand: { src: "/media/brand/bridge.webp", alt: "Bridge", width: 640, height: 640 },
    media: {
      poster: "/media/bridge/poster.jpg",
      alt: "Bridge — dashboard, calendar and task board, recorded in daily use",
      width: 1280,
      height: 660,
      video: { webm: "/media/bridge/capture.webm", mp4: "/media/bridge/capture.mp4" },
      feature: { webm: "/media/bridge/feature.webm", mp4: "/media/bridge/feature.mp4" },
    },
  },
];

export interface Client {
  name: string;
  slug: string;
  industry: string;
  /** Omitted for a client with no live site (e.g. print-only work) —
   *  callers must guard before rendering a "visit" link. */
  website?: string;
  work: string[];
  /** The client's real logo. Optional — falls back to text. */
  brand?: Brand;
}

export const clients: Client[] = [
  {
    name: "Ananta Nethralaya",
    slug: "ananta-nethralaya",
    industry: "Healthcare",
    website: "https://www.anantanethralaya.org/",
    work: ["ananta-nethralaya"],
    brand: { src: "/media/brand/ananta.webp", alt: "Ananta Nethralaya", width: 640, height: 639 },
  },
  {
    name: "Al Afzah Group WLL",
    // Was "al-afzah-group" — didn't match the project slug "al-afzah"
    // anywhere else in the content model. Fixed per the redesign audit.
    slug: "al-afzah",
    industry: "Construction",
    website: "https://www.al-afzahgroup.com/",
    work: ["al-afzah"],
    brand: {
      src: "/media/brand/al-afzah.webp",
      alt: "Al Afzah Group WLL",
      width: 500,
      height: 500,
    },
  },
  {
    name: "Soorath Autos",
    slug: "soorath-autos",
    industry: "Automotive retail",
    website: "https://www.soorathautos.in/",
    work: ["soorath-autos"],
    brand: { src: "/media/brand/soorath.webp", alt: "Soorath Autos", width: 640, height: 640 },
  },
  {
    name: "HeadGreen",
    slug: "headgreen",
    industry: "EV mobility",
    website: "https://www.headgreen.in/",
    work: ["headgreen"],
    brand: { src: "/media/brand/headgreen.webp", alt: "HeadGreen", width: 500, height: 826 },
  },
  {
    name: "Ozone Fitout & Contracting W.L.L.",
    slug: "ozone",
    industry: "Interior fit-out & contracting",
    work: ["ozone"],
    brand: {
      src: "/media/brand/ozone.webp",
      alt: "Ozone Fitout & Contracting",
      width: 800,
      height: 360,
    },
  },
];

export const process = [
  {
    step: "A",
    title: "Scope",
    body: "We agree what the software must do, what it must not do, and how we will know it worked.",
  },
  {
    step: "B",
    title: "Model",
    body: "Data and roles are modelled before interfaces. The schema decides how long the product lives.",
  },
  {
    step: "C",
    title: "Build",
    body: "Small reviewable increments, deployed early, on the same infrastructure as production.",
  },
  {
    step: "D",
    title: "Hand over",
    body: "An admin your team can operate, documentation, and a named support route.",
  },
];

/** /about's "Principles" list — moved here from being hardcoded directly
 *  in the route (the only page-level copy that wasn't sourced from this
 *  file), per AGENTS.md §3's source-of-truth order. */
export const principles = [
  "Model the data before designing the screen.",
  "Ship an admin the client's own team can operate.",
  "No invented metrics, no invented clients, no invented testimonials.",
  "Small releases beat annual rewrites.",
  "Accessibility and reduced motion are requirements, not polish.",
];

/** /about's origin narrative — the team's own framing of how MaCo started,
 *  not a claim this file invents. Kept to what was actually said: a small
 *  team, built alongside other work, no founding year or metric attached. */
export const origin = {
  eyebrow: "Origin",
  heading: "Eight people, one discipline, built between other jobs.",
  body: "MaCo started as work done alongside separate careers — hours spent building for clients who needed something that actually shipped. The team stayed small on purpose: people covering frontend, full-stack, infrastructure and the business side, all still hands-on. What began as extra hours became the standard the rest of the company runs on.",
};

/** A real MaCo team member. `role`/`bio`/`portrait` are per AGENTS.md's
 *  no-invented-claims rule (see `principles` above) — nobody's job title or
 *  bio gets written on their behalf. Until the team supplies them, `role`
 *  and `bio` carry a visible pending state (same pattern as `Media.note`:
 *  never let a stand-in read as the real thing) rather than a guess.
 *  `portrait` mirrors `Media` so a real photo drops in with zero layout
 *  shift the moment one exists; until then the card falls back to initials. */
export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  portrait?: Media;
}

export const team: TeamMember[] = [
  { slug: "syed-mahroof", name: "Syed Mahroof", role: "Role — pending", bio: "Bio — pending." },
  {
    slug: "muhammed-sheffin-khan-p-a",
    name: "Muhammed Sheffin Khan P A",
    role: "Role — pending",
    bio: "Bio — pending.",
  },
  {
    slug: "alshid-mohammed",
    name: "Alshid Mohammed",
    role: "Role — pending",
    bio: "Bio — pending.",
  },
  { slug: "minhaj-v-shams", name: "Minhaj V Shams", role: "Role — pending", bio: "Bio — pending." },
  { slug: "sonu-mirza-a", name: "Sonu Mirza A", role: "Role — pending", bio: "Bio — pending." },
  { slug: "akshai-n-v", name: "Akshai N V", role: "Role — pending", bio: "Bio — pending." },
  { slug: "sahal-siyad", name: "Sahal Siyad", role: "Role — pending", bio: "Bio — pending." },
  { slug: "arfin-nassar", name: "Arfin Nassar", role: "Role — pending", bio: "Bio — pending." },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
