import { about } from "@/content/about";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="about" label="About">
      <p className="text-text-muted text-base leading-relaxed">{about}</p>
    </Section>
  );
}
