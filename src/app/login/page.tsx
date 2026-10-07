"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    const role = await login(email, password);
    if (role) {
      router.push(role === "admin" ? "/admin" : "/account");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 bg-gradient-to-tr from-surface via-background to-surface">
      <Card className="w-full max-w-md border border-border shadow-2xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Demo sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Accounts are local to this browser. Use a demo code of at least six characters, not a real password.
            </p>
          </div>

          {(formError || error) && (
            <div className="rounded-button bg-danger/10 p-3 text-sm text-danger border border-danger/20">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1">
              <Input
                label="Demo access code"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  About demo access
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 mt-4" isLoading={isLoading}>
              Enter demo account
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-foreground underline hover:no-underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
