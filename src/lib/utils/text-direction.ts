/**
 * Utility for intelligent BiDi text direction detection (RTL / LTR).
 * Automatically detects whether text contains Arabic characters and returns
 * the proper direction, alignment, and styling to prevent mixed-script jumbling.
 */

export const ARABIC_UNICODE_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Returns true if the given text contains Arabic characters.
 */
export function isArabic(text?: string | null): boolean {
  if (!text) return false;
  return ARABIC_UNICODE_REGEX.test(text);
}

/**
 * Returns "rtl" if the text contains Arabic characters, or "ltr" otherwise.
 * If text is empty or neutral, returns the specified fallback.
 */
export function getTextDirection(
  text?: string | null,
  fallback: "rtl" | "ltr" | "auto" = "auto",
): "rtl" | "ltr" | "auto" {
  if (!text || !text.trim()) return fallback;
  return isArabic(text) ? "rtl" : "ltr";
}

/**
 * Returns CSS text-alignment class based on detected direction.
 */
export function getTextAlign(text?: string | null): "text-right" | "text-left" {
  return isArabic(text) ? "text-right" : "text-left";
}
