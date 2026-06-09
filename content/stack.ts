import type { StackGroup } from "./types";

export const stack: StackGroup[] = [
  { label: "Backend", items: ["Python", "Django", "DRF", "Go", "Node.js", "REST", "gRPC", "PostgreSQL", "Redis", "Celery"] },
  { label: "Frontend", items: ["React", "TypeScript", "Next.js", "VS Code Webview"] },
  { label: "Developer Tools", items: ["VS Code Extension API", "LSP", "JSON/JSON5", "Sentry", "Telemetry"] },
  { label: "Infrastructure", items: ["Docker", "Docker Compose", "Kubernetes", "EKS", "GitHub Actions", "Concourse", "RabbitMQ", "CloudWatch", "Nginx"] },
  { label: "Web3", items: ["Solidity", "Ethereum", "Stacks", "Smart Contracts"] },
  { label: "IoT / Homelab", items: ["ESP32", "ESPHome", "UniFi", "Synology NAS", "2.5GbE"] },
];
