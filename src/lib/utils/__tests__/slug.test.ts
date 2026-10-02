import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "../slug";

describe("slugify", () => {
  it("replaces every run of spaces and symbols with a single dash", () => {
    expect(slugify("Kinetic Pastel Mechanical Keyboard")).toBe(
      "kinetic-pastel-mechanical-keyboard",
    );
    expect(slugify('  Vanta 32" 4K  Creator / Monitor  ')).toBe(
      "vanta-32-4k-creator-monitor",
    );
  });

  it("keeps accented and Arabic letters", () => {
    expect(slugify("Café Crème")).toBe("café-crème");
    expect(slugify("ساعة ذكية Pro")).toBe("ساعة-ذكية-pro");
  });

  it("returns an empty string when nothing usable is left", () => {
    expect(slugify("!!! ---")).toBe("");
  });
});

describe("uniqueSlug", () => {
  it("adds a numeric suffix when the slug is already used", () => {
    expect(uniqueSlug("Desk Lamp", [])).toBe("desk-lamp");
    expect(uniqueSlug("Desk Lamp", ["desk-lamp"])).toBe("desk-lamp-2");
    expect(uniqueSlug("Desk Lamp", ["desk-lamp", "desk-lamp-2"])).toBe("desk-lamp-3");
  });

  it("falls back when the title has no letters or digits", () => {
    expect(uniqueSlug("???", [], "prod-1")).toBe("prod-1");
  });
});
