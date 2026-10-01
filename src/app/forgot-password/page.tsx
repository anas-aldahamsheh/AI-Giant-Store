import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-panel border border-border bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold">Demo access</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          This demo has no email service or password recovery. Accounts are stored in this browser, and any email with a demo access code of at least six characters can enter a local account. Do not use a real password.
        </p>
        <Link href="/login" className="mt-6 inline-flex rounded-button bg-brand-600 px-5 py-3 text-sm font-semibold text-white">Back to demo sign in</Link>
      </section>
    </main>
  );
}
