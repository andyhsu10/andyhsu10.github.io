import { links } from "@/content/links";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="border-t border-border pt-6 font-mono text-sm text-text-subtle">
        <div className="flex flex-wrap gap-4">
          <a className="transition-colors hover:text-accent-hover" href={links.github}>GitHub</a>
          <a className="transition-colors hover:text-accent-hover" href={links.linkedin}>LinkedIn</a>
          <a className="transition-colors hover:text-accent-hover" href={links.instagram}>Instagram</a>
        </div>
        <p className="mt-4 text-xs text-text-subtle">
          © {new Date().getFullYear()} An-Ting Hsu · Built with Next.js &amp; Tailwind.
        </p>
      </div>
    </footer>
  );
}
