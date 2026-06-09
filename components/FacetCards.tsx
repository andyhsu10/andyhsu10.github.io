import { facets } from "@/content/facets";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function FacetCards() {
  return (
    <Section id="build" label="What I build">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {facets.map((f) => (
          <Card key={f.title}>
            <h3 className="text-base font-semibold tracking-tight">{f.title}</h3>
            <p className="text-text-muted mt-1.5 text-sm">{f.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.chips.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
