import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    company: "SiFive",
    role: "Full Stack Engineer",
    period: "2024 — Present",
    blurb:
      "Full-stack work on internal engineering platforms and a VS Code extension " +
      "for product specs — Django/DRF APIs, React/TypeScript UIs, LSP integration, " +
      "and Kubernetes-based CI/CD.",
  },
  {
    company: "Freelancer",
    role: "Software Engineer",
    period: "2023 — 2024",
    blurb:
      "Built a prediction-market backend with on-chain deposits/withdrawals and a " +
      "CMS, plus a LINE-bot dating MVP (50+ DAU) later rebuilt with Django REST.",
  },
  {
    company: "Biznius.AI (SeFo Finance)",
    role: "Co-founder / Software Engineer",
    period: "2022 — 2023",
    blurb:
      "Shipped a leverage yield-farming product on Stacks, company web properties, " +
      "and a ChatGPT chrome extension; led smart-contract integration across two " +
      "chains over three hackathons.",
  },
  {
    company: "Poseidon Network",
    role: "Software Engineer",
    period: "2019 — 2022",
    blurb:
      "Built Django APIs for 15k+ users and ~2,000 distributed edge devices, ERC20 " +
      "token products, and IPFS-based distributed storage.",
  },
  {
    company: "Blockore",
    role: "Co-founder / Software Engineer",
    period: "2018 — 2019",
    blurb: "Led four engineers building member, blog, and mailing services on AWS.",
    earlier: true,
  },
];
