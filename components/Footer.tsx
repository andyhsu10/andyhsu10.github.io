import { links } from "@/content/links";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="border-border text-text-subtle border-t pt-6 font-mono text-sm">
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-accent-hover transition-colors" href={links.github}>
            GitHub
          </a>
          <a className="hover:text-accent-hover transition-colors" href={links.linkedin}>
            LinkedIn
          </a>
          <a className="hover:text-accent-hover transition-colors" href={links.instagram}>
            Instagram
          </a>
        </div>
        <p className="text-text-subtle mt-4 text-xs">
          © {new Date().getFullYear()} An-Ting Hsu · Built with Next.js &amp; Tailwind.
        </p>
      </div>
    </footer>
  );
}
