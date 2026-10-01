import { describe, it, expect } from "vitest";
import { isArabic, getTextDirection, getTextAlign } from "../text-direction";

describe("Smart BiDi Text Direction Utility", () => {
  it("detects pure Arabic text as RTL", () => {
    const arabicText = "مرحبا بك في متجرنا، كيف يمكنني مساعدتك اليوم؟";
    expect(isArabic(arabicText)).toBe(true);
    expect(getTextDirection(arabicText)).toBe("rtl");
    expect(getTextAlign(arabicText)).toBe("text-right");
  });

  it("detects mixed Arabic text with embedded English brand names as RTL", () => {
    const mixedText = "نعم، لدينا هاتف Apple iPhone 15 Pro Max بسعة 256GB في متجرنا.";
    expect(isArabic(mixedText)).toBe(true);
    expect(getTextDirection(mixedText)).toBe("rtl");
    expect(getTextAlign(mixedText)).toBe("text-right");
  });

  it("detects sentences that start with an English word but are in Arabic as RTL", () => {
    const startWithEnglish = "Apple iPhone 15 Pro Max هو أحدث هاتف متوفر لدينا بسعر ممتاز.";
    expect(isArabic(startWithEnglish)).toBe(true);
    expect(getTextDirection(startWithEnglish)).toBe("rtl");
    expect(getTextAlign(startWithEnglish)).toBe("text-right");
  });

  it("detects pure English text as LTR", () => {
    const englishText = "Yes, we have Apple iPhone 15 Pro Max in stock for $1199.";
    expect(isArabic(englishText)).toBe(false);
    expect(getTextDirection(englishText)).toBe("ltr");
    expect(getTextAlign(englishText)).toBe("text-left");
  });

  it("handles null, undefined, or empty strings safely", () => {
    expect(isArabic("")).toBe(false);
    expect(isArabic(null)).toBe(false);
    expect(isArabic(undefined)).toBe(false);
    expect(getTextDirection("")).toBe("auto");
    expect(getTextAlign("")).toBe("text-left");
  });
});
