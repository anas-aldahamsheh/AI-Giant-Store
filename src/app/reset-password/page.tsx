import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-panel border border-border bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold">Password reset is unavailable</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Giant Store currently uses local demo accounts without a real password service. No password can be reset here.
        </p>
        <Link href="/login" className="mt-6 inline-flex rounded-button bg-brand-600 px-5 py-3 text-sm font-semibold text-white">Back to demo sign in</Link>
      </section>
    </main>
  );
}
