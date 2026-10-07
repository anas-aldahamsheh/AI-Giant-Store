
const reasons = [
  ["Catalog-aware AI", "Recommendations link to products in this browser's catalog. Check details before deciding."],
  ["Fast discovery", "Filters, search, and comparisons help narrow the products you add."],
  ["Clear demo scope", "Products and orders stay in this browser; no payment is collected."],
];

export function WhyShopWithUs() {
  return (
    <section className="premium-section">
      <div className="premium-container">
        <h2 className="text-4xl font-black text-slate-950">Why shop with us</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {reasons.map(([title, description]) => (
            <article key={title} data-fx-tilt="8" className="fx-tilt group premium-card relative p-6">
              <span aria-hidden="true" className="fx-ring fx-ring-hover" />
              <span aria-hidden="true" className="fx-glare" />
              <h3 className="text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
