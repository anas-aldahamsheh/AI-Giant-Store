"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/store/auth.store";

export function AccountMenu() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Link
      href={isAuthenticated ? "/account" : "/login"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/70 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:h-10 sm:w-auto sm:px-4"
      title={isAuthenticated && user ? `Hi, ${user.name}` : "Sign In"}
    >
      <span className="hidden sm:inline">
        {isAuthenticated && user ? `Hi, ${user.name.split(" ")[0]}` : "Sign In"}
      </span>
      <span className="sm:hidden" aria-hidden="true">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </span>
    </Link>
  );
}
