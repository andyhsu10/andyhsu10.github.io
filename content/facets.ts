import type { Facet } from "./types";

export const facets: Facet[] = [
  {
    title: "Backend & Infrastructure",
    blurb: "APIs, service architecture, and container-to-cluster deployment.",
    chips: ["Django/DRF", "PostgreSQL", "Redis", "Docker", "K8s/EKS", "CI/CD"],
  },
  {
    title: "Developer Tools",
    blurb: "VS Code extensions, language servers, and telemetry.",
    chips: ["VS Code API", "LSP", "Webview", "Sentry"],
  },
  {
    title: "Distributed Systems",
    blurb: "Multi-node, event-driven systems and edge integration.",
    chips: ["Go", "gRPC", "protobuf", "Next.js"],
  },
  {
    title: "Explorations",
    blurb: "Web3 smart contracts, homelab, and IoT.",
    chips: ["Solidity", "Ethereum", "Stacks", "ESP32", "NAS"],
  },
];
