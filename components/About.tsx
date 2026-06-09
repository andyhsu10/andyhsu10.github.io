import { about } from "@/content/about";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="about" label="About">
      <p className="text-base leading-relaxed text-text-muted">{about}</p>
    </Section>
  );
}
