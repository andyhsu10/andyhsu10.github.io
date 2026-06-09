import { personal } from "@/content/personal";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";

export function Personal() {
  return (
    <Section id="personal" label="Personal">
      <p className="text-base leading-relaxed text-text-muted">{personal.text}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {personal.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
    </Section>
  );
}
