import { projects, awardBadge } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function Projects() {
  return (
    <Section id="projects" label="Selected projects">
      <p className="text-text-subtle mb-4 font-mono text-xs">{awardBadge}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p) => {
          const inner = (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold tracking-tight">{p.name}</h3>
                {p.context && (
                  <span className="text-text-subtle font-mono text-[11px]">{p.context}</span>
                )}
              </div>
              <p className="text-text-muted mt-1.5 text-sm">{p.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </>
          );
          return p.href ? (
            <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer">
              <Card className="h-full">{inner}</Card>
            </a>
          ) : (
            <Card key={p.name} className="h-full">
              {inner}
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
