import Link from "next/link";

export function AIAssistantCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-card border border-border bg-foreground p-8 text-background shadow-soft">
        <span aria-hidden="true" className="fx-beam -z-10" />
        <span
          aria-hidden="true"
          className="fx-aurora fx-aurora-b -z-10 -right-20 -top-24 h-72 w-72 bg-violet-500/30"
        />
        <span
          aria-hidden="true"
          className="fx-aurora fx-aurora-a -z-10 -bottom-28 left-1/4 h-64 w-64 bg-cyan-400/20"
        />
        <h2 className="text-2xl font-bold">Need help choosing?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-background/80">
          Ask the assistant to compare products saved in this browser. Its suggestions
          are a starting point; check prices and specifications on each product page.
        </p>
        <Link
          href="/products"
          data-fx-magnetic
          className="fx-shine relative mt-6 inline-flex overflow-hidden rounded-button bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-brand-50"
        >
          Browse catalog
        </Link>
      </div>
    </section>
  );
}
