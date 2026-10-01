export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-background px-6 py-20">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-5 w-40 rounded-full bg-muted" />
        <div className="h-14 max-w-2xl rounded-2xl bg-muted" />
        <div className="h-28 max-w-3xl rounded-card bg-muted" />
      </div>
    </main>
  );
}
