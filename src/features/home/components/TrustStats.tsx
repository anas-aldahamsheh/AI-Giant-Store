import { ScrambleText } from "@/components/motion/ScrambleText";

const stats = [
  ["Local", "products saved in your browser"],
  ["AI", "product discovery assistant"],
  ["Compare", "review product details side by side"],
  ["Demo", "checkout without a payment"],
];

export function TrustStats() {
  return (
    <section className="premium-section py-10">
      <div className="premium-container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label], index) => (
          <div
            key={label}
            data-fx-tilt="10"
            className="fx-tilt premium-card relative p-6 text-center"
          >
            <span aria-hidden="true" className="fx-glare" />
            <p className="text-3xl font-black text-slate-950">
              <ScrambleText text={value} delay={200 + index * 120} duration={900} />
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
