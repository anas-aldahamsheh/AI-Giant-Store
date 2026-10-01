import { Reveal } from "@/components/motion/Reveal";

const stats = [
  ["Local", "products saved in your browser"],
  ["AI", "product discovery assistant"],
  ["Compare", "review product details side by side"],
  ["Demo", "checkout without a payment"],
];

export function TrustStats() {
  return (
    <section className="premium-section py-10">
      <Reveal className="premium-container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="premium-card p-6 text-center">
            <p className="text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
