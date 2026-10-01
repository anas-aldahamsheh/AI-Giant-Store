import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mt-4 text-muted-foreground">
          The route exists in the roadmap, but this page is not available yet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-button bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}
