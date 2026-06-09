import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";
import { FacetCards } from "@/components/FacetCards";

describe("Hero", () => {
  it("shows the name, tagline, and three links (no email)", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Andy/);
    expect(screen.getByText(/full-stack products, developer tools/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /resume/i })).toBeInTheDocument();
    expect(screen.queryByText(/@gmail/i)).not.toBeInTheDocument();
  });
});

describe("FacetCards", () => {
  it("renders all four facet titles", () => {
    render(<FacetCards />);
    expect(screen.getByText("Backend & Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("Developer Tools")).toBeInTheDocument();
    expect(screen.getByText("Distributed Systems")).toBeInTheDocument();
    expect(screen.getByText("Explorations")).toBeInTheDocument();
  });
});
