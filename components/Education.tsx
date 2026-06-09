import { education } from "@/content/education";
import { Section } from "@/components/ui/Section";

export function Education() {
  return (
    <Section id="education" label="Education">
      <div className="flex flex-col">
        {education.map((e) => (
          <div
            key={e.school}
            className="border-border grid grid-cols-1 gap-1 border-t py-4 sm:grid-cols-[120px_1fr] sm:gap-4"
          >
            <div className="text-text-subtle font-mono text-xs">{e.period}</div>
            <div>
              <div className="text-sm font-semibold">{e.school}</div>
              <div className="text-accent text-sm">{e.degree}</div>
              {e.location && <div className="text-text-subtle mt-0.5 text-xs">{e.location}</div>}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
