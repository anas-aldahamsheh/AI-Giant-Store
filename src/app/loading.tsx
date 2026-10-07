export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-6 py-20" data-fx-manual>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="fx-shimmer h-5 w-40 rounded-full bg-muted" />
        <div className="fx-shimmer h-14 max-w-2xl rounded-2xl bg-muted" />
        <div className="fx-shimmer h-28 max-w-3xl rounded-card bg-muted" />
      </div>
    </main>
  );
}
