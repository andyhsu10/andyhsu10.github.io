import { links } from "@/content/links";

export function Hero() {
  return (
    <header className="mx-auto w-full max-w-3xl px-6 pt-24 pb-4">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        An-Ting <span className="text-accent">&ldquo;Andy&rdquo;</span> Hsu
      </h1>
      <p className="text-text-muted mt-4 max-w-xl text-lg leading-relaxed">
        Software engineer building{" "}
        <span className="text-text font-medium">
          full-stack products, developer tools, and distributed systems.
        </span>
        <br />
        Taipei-based · backend &amp; infrastructure leaning.
      </p>
      <nav className="text-text-subtle mt-6 flex gap-4 font-mono text-sm">
        <a className="hover:text-accent-hover transition-colors" href={links.github}>
          GitHub
        </a>
        <a className="hover:text-accent-hover transition-colors" href={links.linkedin}>
          LinkedIn
        </a>
        <a className="hover:text-accent-hover transition-colors" href={links.resume}>
          Resume
        </a>
      </nav>
    </header>
  );
}
