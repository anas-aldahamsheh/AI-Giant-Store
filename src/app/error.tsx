"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="max-w-lg rounded-card border border-border bg-surface p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-danger">
          Something went wrong
        </p>
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          We could not load this view.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-button bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
