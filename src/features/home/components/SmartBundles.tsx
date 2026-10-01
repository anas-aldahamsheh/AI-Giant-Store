import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const bundles = [
  ["Creator Starter Kit", "Camera, headphones, portable monitor"],
  ["Workday Upgrade", "Chair, lamp, keyboard, USB-C hub"],
  ["Travel Light", "Backpack, ANC headphones, smartwatch"],
];

export function SmartBundles() {
  return (
    <section className="premium-section dark-mesh-bg relative overflow-hidden text-white">
      <div className="noise-overlay absolute inset-0 opacity-15" />
      <Reveal className="premium-container relative">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
            Smart bundles
          </p>
          <h2 className="mt-3 text-4xl font-black">Ideas for your next setup.</h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {bundles.map(([title, description]) => (
            <Link
              key={title}
              href="/products"
              className="rounded-panel border border-white/15 bg-white/10 p-6 shadow-premium backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{description}</p>
              <p className="mt-5 text-sm font-semibold text-cyan-200">Explore available products</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
