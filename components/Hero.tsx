import { links } from "@/content/links";

export function Hero() {
  return (
    <header className="mx-auto w-full max-w-3xl px-6 pb-4 pt-24">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        An-Ting <span className="text-accent">&ldquo;Andy&rdquo;</span> Hsu
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
        Software engineer building{" "}
        <span className="font-medium text-text">
          full-stack products, developer tools, and distributed systems.
        </span>
        <br />
        Taipei-based · backend &amp; infrastructure leaning.
      </p>
      <nav className="mt-6 flex gap-4 font-mono text-sm text-text-subtle">
        <a className="transition-colors hover:text-accent-hover" href={links.github}>GitHub</a>
        <a className="transition-colors hover:text-accent-hover" href={links.linkedin}>LinkedIn</a>
        <a className="transition-colors hover:text-accent-hover" href={links.resume}>Resume</a>
      </nav>
    </header>
  );
}
