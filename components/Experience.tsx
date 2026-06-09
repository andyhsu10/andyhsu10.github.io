import { experience } from "@/content/experience";
import { Section } from "@/components/ui/Section";

export function Experience() {
  return (
    <Section id="work" label="Experience">
      <div className="flex flex-col">
        {experience.map((e) => (
          <div
            key={e.company}
            className="border-border grid grid-cols-1 gap-1 border-t py-4 sm:grid-cols-[120px_1fr] sm:gap-4"
          >
            <div className="text-text-subtle font-mono text-xs">{e.period}</div>
            <div>
              <div className="text-sm font-semibold">{e.company}</div>
              <div className="text-accent text-sm">{e.role}</div>
              <p className="text-text-muted mt-1.5 text-sm leading-relaxed">{e.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
