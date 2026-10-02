export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(
  value: string,
  takenSlugs: Iterable<string>,
  fallback = `prod-${Date.now()}`,
) {
  const base = slugify(value) || fallback;
  const taken = new Set(takenSlugs);
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
