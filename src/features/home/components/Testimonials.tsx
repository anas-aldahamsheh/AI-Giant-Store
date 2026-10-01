import { Reveal } from "@/components/motion/Reveal";

const testimonials = [
  ["Maya", "The assistant narrowed my options faster than any filter panel."],
  ["Omar", "The product pages feel rich, clear, and trustworthy."],
  ["Lina", "Bundles made it easy to buy a full setup without guessing."],
];

export function Testimonials() {
  return (
    <section className="premium-section bg-surface-2">
      <Reveal className="premium-container">
        <h2 className="text-4xl font-black text-slate-950">Social proof</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map(([name, quote]) => (
            <figure key={name} className="premium-card p-6">
              <blockquote className="text-sm leading-6 text-slate-600">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm font-black text-brand-700">
                {name}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
