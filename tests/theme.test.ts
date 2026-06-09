import { describe, it, expect, beforeEach } from "vitest";
import { resolveInitialTheme, applyTheme } from "@/lib/theme";

describe("resolveInitialTheme", () => {
  it("honors a stored 'dark' value", () => {
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });
  it("honors a stored 'light' value over system preference", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
  });
  it("falls back to system preference when nothing is stored", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(null, false)).toBe("light");
  });
  it("ignores a junk stored value", () => {
    expect(resolveInitialTheme("purple", true)).toBe("dark");
  });
});

describe("applyTheme", () => {
  beforeEach(() => document.documentElement.classList.remove("dark"));
  it("adds .dark for dark theme", () => {
    applyTheme("dark");
    expect(document.documentElement).toHaveClass("dark");
  });
  it("removes .dark for light theme", () => {
    document.documentElement.classList.add("dark");
    applyTheme("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
