import { experience } from "@/content/experience";
import { Section } from "@/components/ui/Section";

export function Experience() {
  return (
    <Section id="work" label="Experience">
      <div className="flex flex-col">
        {experience.map((e) => (
          <div
            key={e.company}
            className="grid grid-cols-1 gap-1 border-t border-border py-4 sm:grid-cols-[120px_1fr] sm:gap-4"
          >
            <div className="font-mono text-xs text-text-subtle">{e.period}</div>
            <div>
              <div className="text-sm font-semibold">{e.company}</div>
              <div className="text-sm text-accent">{e.role}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{e.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
