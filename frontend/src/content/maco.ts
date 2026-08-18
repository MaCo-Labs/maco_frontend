/**
 * MaCo content — mirrors the Django/DRF API shape defined in
 * 04_BACKEND_SCHEMA.md. When the backend is live, swap these
 * constants for fetches against /api/v1/* ; the field names match.
 */

export type Status = "published" | "draft";

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
  external_url: string;
  technologies: string[];
  services: string[];
  seo_title: string;
  seo_description: string;
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
  contact_email: "hello@maco.dev",
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

export const services: Service[] = [
  {
    slug: "web-development",
    index: "01",
    title: "Web Development",
    short_description:
      "Marketing sites and web platforms built to be edited, measured and maintained after launch.",
    description:
      "We design and engineer websites end to end: information architecture, front-end implementation, content administration and deployment. Every build ships with an admin a non-technical team can actually use.",
    capabilities: [
      {
        title: "Site architecture",
        description:
          "Routing, content modelling and SEO structure decided before a pixel is drawn.",
      },
      {
        title: "Front-end engineering",
        description: "React and modern CSS, built for performance budgets rather than demo reels.",
      },
      {
        title: "Content administration",
        description: "Django-based admin so copy, media and case studies change without a deploy.",
      },
    ],
    evidence: ["ananta-nethralaya", "al-afzah", "soorath-autos", "headgreen"],
    seo_title: "Web Development — MaCo",
    seo_description:
      "MaCo builds websites and web platforms with content administration, performance budgets and long-term maintenance in mind.",
  },
  {
    slug: "app-development",
    index: "02",
    title: "App Development",
    short_description:
      "Installable applications and operational platforms for teams that work away from a desk.",
    description:
      "We build progressive web applications and desktop-capable platforms covering authentication, roles, records, scheduling and reporting — the unglamorous parts that decide whether an app survives contact with a real workforce.",
    capabilities: [
      {
        title: "PWA delivery",
        description: "Installable, offline-tolerant applications on a single codebase.",
      },
      {
        title: "Role and permission design",
        description: "Administrators, operators and field users treated as distinct products.",
      },
      {
        title: "Reporting layers",
        description: "Exports and dashboards derived from the same records the team already keeps.",
      },
    ],
    evidence: ["drivers-diary", "bridge"],
    seo_title: "App Development — MaCo",
    seo_description:
      "Progressive web apps and operational platforms from MaCo: roles, records, scheduling and reporting for real workforces.",
  },
  {
    slug: "technical-support",
    index: "03",
    title: "Technical Support",
    short_description:
      "Hands-on support for infrastructure, hosting, domains, mail and the day-to-day IT surface.",
    description:
      "Ongoing technical support covering hosting and deployment environments, DNS and mail configuration, backups, monitoring and incident response for the systems we build or inherit.",
    capabilities: [
      {
        title: "Infrastructure & hosting",
        description: "Environments, domains, certificates and deployment pipelines.",
      },
      {
        title: "Monitoring & backups",
        description: "Alerting and recovery paths agreed before they are needed.",
      },
      {
        title: "Incident response",
        description: "A named route to a human when something is down.",
      },
    ],
    evidence: ["headgreen", "soorath-autos"],
    seo_title: "Technical Support — MaCo",
    seo_description:
      "MaCo provides technical support for hosting, DNS, mail, backups, monitoring and incident response.",
  },
  {
    slug: "software-support",
    index: "04",
    title: "Software Support",
    short_description:
      "Maintenance, fixes and continuous improvement for software already in production.",
    description:
      "Software rarely fails on launch day; it degrades. We take ownership of existing codebases — ours or somebody else's — and keep them patched, documented and moving forward in small, reviewable increments.",
    capabilities: [
      {
        title: "Codebase adoption",
        description: "Audit, document and stabilise inherited software.",
      },
      {
        title: "Release cadence",
        description: "Small scheduled releases instead of risky annual rewrites.",
      },
      {
        title: "Dependency hygiene",
        description: "Runtime, library and security updates tracked deliberately.",
      },
    ],
    evidence: ["drivers-diary", "bridge"],
    seo_title: "Software Support — MaCo",
    seo_description:
      "Maintenance and continuous improvement for production software: audits, patching, documentation and scheduled releases.",
  },
  {
    slug: "social-media-managing",
    index: "05",
    title: "Social Media Managing",
    short_description:
      "Channel management for companies whose product story needs to stay consistent in public.",
    description:
      "Planning, production and scheduling of social content that matches the same brand system as the website — one voice across the site, the product and the feed.",
    capabilities: [
      {
        title: "Content planning",
        description: "Calendars tied to launches, hiring and campaign moments.",
      },
      {
        title: "Asset production",
        description: "Templates derived from the brand system, not from a stock pack.",
      },
      {
        title: "Reporting",
        description: "Plain reach and engagement reporting without vanity framing.",
      },
    ],
    evidence: ["soorath-autos", "headgreen"],
    seo_title: "Social Media Managing — MaCo",
    seo_description:
      "MaCo manages social channels with content planning, on-brand asset production and honest reporting.",
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
    services: ["web-development"],
    seo_title: "Ananta Nethralaya — Client work by MaCo",
    seo_description: "MaCo built the website for Ananta Nethralaya, an eye clinic.",
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
    services: ["web-development"],
    seo_title: "Al Afzah Group — Client work by MaCo",
    seo_description:
      "MaCo built the corporate website for Al Afzah Group WLL, a Qatar-based construction company.",
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
    services: ["web-development", "social-media-managing"],
    seo_title: "Soorath Autos — Client work by MaCo",
    seo_description: "MaCo built the website for Soorath Autos, a pre-owned car showroom.",
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
    services: ["web-development", "technical-support"],
    seo_title: "HeadGreen — Client work by MaCo",
    seo_description:
      "MaCo built the website for HeadGreen, a corporate EV fleet cab service in Kochi, Kerala.",
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
  },
];

export const clients = [
  {
    name: "Ananta Nethralaya",
    slug: "ananta-nethralaya",
    industry: "Healthcare",
    website: "https://www.anantanethralaya.org/",
    work: ["ananta-nethralaya"],
  },
  {
    name: "Al Afzah Group WLL",
    slug: "al-afzah-group",
    industry: "Construction",
    website: "https://www.al-afzahgroup.com/",
    work: ["al-afzah"],
  },
  {
    name: "Soorath Autos",
    slug: "soorath-autos",
    industry: "Automotive retail",
    website: "https://www.soorathautos.in/",
    work: ["soorath-autos"],
  },
  {
    name: "HeadGreen",
    slug: "headgreen",
    industry: "EV mobility",
    website: "https://www.headgreen.in/",
    work: ["headgreen"],
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

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
