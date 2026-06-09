import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FacetCards } from "@/components/FacetCards";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Projects } from "@/components/Projects";
import { TechStack } from "@/components/TechStack";
import { Personal } from "@/components/Personal";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Reveal>
          <FacetCards />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <Education />
        </Reveal>
        <Reveal>
          <Projects />
        </Reveal>
        <Reveal>
          <TechStack />
        </Reveal>
        <Reveal>
          <Personal />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
