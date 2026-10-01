import Link from "next/link";

const menuSections = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Deals", href: "/deals" },
      { label: "New arrivals", href: "/products?sort=newest" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Returns", href: "/help/returns" },
      { label: "Orders", href: "/account/orders" },
    ],
  },
];

export function MegaMenu() {
  return (
    <div className="grid gap-6 rounded-card border border-border bg-surface p-6 shadow-soft sm:grid-cols-2">
      {menuSections.map((section) => (
        <section key={section.title}>
          <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
          <ul className="mt-3 space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link className="text-sm text-muted-foreground hover:text-foreground" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
