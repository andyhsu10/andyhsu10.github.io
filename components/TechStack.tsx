import { stack } from "@/content/stack";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";

export function TechStack() {
  return (
    <Section id="stack" label="Tech stack">
      <div className="flex flex-col gap-5">
        {stack.map((g) => (
          <div key={g.label} className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr]">
            <div className="text-text text-sm font-semibold">{g.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
