export type Facet = { title: string; blurb: string; chips: string[] };
export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  blurb: string;
  earlier?: boolean;
};
export type Project = {
  name: string;
  context?: string;
  blurb: string;
  tags: string[];
  href?: string;
};
export type StackGroup = { label: string; items: string[] };
export type SocialLinks = {
  github: string;
  linkedin: string;
  instagram: string;
  resume: string;
};
