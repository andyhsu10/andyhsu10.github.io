import { describe, it, expect } from "vitest";
import { facets } from "@/content/facets";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { stack } from "@/content/stack";
import { links } from "@/content/links";

describe("content data", () => {
  it("has exactly 4 facets, each with a title, blurb, and chips", () => {
    expect(facets).toHaveLength(4);
    for (const f of facets) {
      expect(f.title).toBeTruthy();
      expect(f.blurb).toBeTruthy();
      expect(f.chips.length).toBeGreaterThan(0);
    }
  });
  it("lists experience newest-first with required fields", () => {
    expect(experience.length).toBeGreaterThanOrEqual(4);
    expect(experience[0].company).toBe("SiFive");
    for (const e of experience) {
      expect(e.role && e.period && e.blurb).toBeTruthy();
    }
  });
  it("has projects with non-empty tags", () => {
    expect(projects.length).toBeGreaterThanOrEqual(6);
    for (const p of projects) expect(p.tags.length).toBeGreaterThan(0);
  });
  it("groups the tech stack", () => {
    const labels = stack.map((g) => g.label);
    expect(labels).toContain("Backend");
    expect(labels).toContain("Infrastructure");
  });
  it("omits email and keeps the three social links", () => {
    expect(links.github).toMatch(/github\.com\/andyhsu10/);
    expect(links.linkedin).toMatch(/antinghsu10/);
    expect(links.instagram).toMatch(/andyhsuanting/);
    expect(JSON.stringify(links)).not.toMatch(/mailto|@gmail/);
  });
});
