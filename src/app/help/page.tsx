"use client";

import Link from "next/link";
import { SearchInput } from "@/components/ui/SearchInput";

const helpCards = [
  ["Shipping", "Shipping choices are previews in this local demo."],
  ["Returns", "Real returns require a connected store backend."],
  ["Payments", "No cards or payments are collected in this demo."],
  ["Orders", "Demo orders are stored only in your browser."],
];

const faqs = [
  ["How fast is delivery?", "Delivery is not available in this browser-based demo."],
  ["Can I return products?", "No purchases are made here, so there are no returns to process."],
  ["Are payments collected?", "No. Checkout saves a demo order locally and never asks for a card."],
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mesh-bg relative overflow-hidden">
        <div className="noise-overlay absolute inset-0 opacity-20" />
        <div className="premium-container relative py-20">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
            Help center
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">
            Fast answers before you need support.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Search common topics or ask the AI shopping assistant for product-specific help.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("help-search") as string;
              if (query?.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="mt-8 max-w-2xl rounded-panel border border-white/70 bg-white/80 p-3 shadow-glow backdrop-blur flex items-center gap-3"
          >
            <div className="flex-1">
              <SearchInput name="help-search" label="Search help" placeholder="Search returns, shipping, payments..." />
            </div>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-brand-600 to-violet-500 px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {helpCards.map(([title, description]) => (
            <article key={title} className="premium-card p-6">
              <h2 className="text-xl font-black text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-section dark-mesh-bg relative overflow-hidden text-white">
        <div className="noise-overlay absolute inset-0 opacity-15" />
        <div className="premium-container relative grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div>
            <h2 className="text-4xl font-black">FAQ categories</h2>
            <div className="mt-6 grid gap-4">
              {faqs.map(([question, answer]) => (
                <article key={question} className="rounded-panel border border-white/15 bg-white/10 p-5">
                  <h3 className="font-black">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{answer}</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="rounded-panel border border-white/15 bg-white/10 p-6">
            <h2 className="text-2xl font-black">Need a person?</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Contact support or open the AI assistant for product-aware guidance.
            </p>
            <Link
              href="/account"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950"
            >
              Contact support
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
