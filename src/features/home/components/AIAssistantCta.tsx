import Link from "next/link";

export function AIAssistantCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="rounded-card border border-border bg-foreground p-8 text-background shadow-soft">
        <h2 className="text-2xl font-bold">Need help choosing?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-background/80">
          Ask the assistant to compare products saved in this browser. Its suggestions
          are a starting point; check prices and specifications on each product page.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-button bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-brand-50"
        >
          Browse catalog
        </Link>
      </div>
    </section>
  );
}
