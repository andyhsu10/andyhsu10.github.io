import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "VS Code Extension",
    context: "SiFive",
    blurb:
      "A developer tool to download, edit, validate, and submit product-specification " +
      "files, with a custom version-control mechanism and Sentry across host, language " +
      "server, and webview.",
    tags: ["VS Code API", "LSP", "TypeScript", "Sentry"],
  },
  {
    name: "Internal Engineering Platform",
    context: "SiFive",
    blurb:
      "Django + React internal system for engineering workflows — API design, spec " +
      "validation, and Kubernetes/EKS CI/CD.",
    tags: ["Django", "React", "EKS", "CI/CD"],
  },
  {
    name: "Distributed Camera System",
    blurb:
      "Architecture and module design for a multi-node distributed camera system with " +
      "event-driven communication and REST fallbacks.",
    tags: ["Go", "gRPC", "protobuf", "Next.js"],
  },
  {
    name: "2024 Solar Eclipse Environment Monitor",
    blurb: "A monitor built to capture environmental changes during the 2024 total solar eclipse.",
    tags: ["Python", "IoT"],
    href: "https://github.com/andyhsu10/2024-solar-eclipse-orange-monitor",
  },
  {
    name: "Homelab / Network Infrastructure",
    blurb:
      "A segmented home network and NAS setup — UniFi gear, Synology RAID storage with " +
      "SSD cache, 2.5GbE, and VLAN isolation.",
    tags: ["UniFi", "Synology", "2.5GbE", "VLAN"],
  },
  {
    name: "Web3 / Prediction Market",
    blurb:
      "Early-stage Web3 products — Ethereum/Solidity contracts, a Stacks yield product, " +
      "and prediction-market backends.",
    tags: ["Solidity", "Ethereum", "Stacks"],
  },
];

export const awardBadge = "🏆 Mars Mail — #1, OpenAI Stack Hack";
