import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const anchors = [
  { href: "#build", label: "Build" },
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
];

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg-from/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-mono text-sm font-semibold text-text">
          AH
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden gap-4 font-mono text-xs text-text-subtle sm:flex">
            {anchors.map((a) => (
              <a key={a.href} href={a.href} className="transition-colors hover:text-accent-hover">
                {a.label}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
