"use client";

import { useEffect, useRef, useState } from "react";
import { m, type Variants, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { SearchInput } from "@/components/ui/SearchInput";
import { ProductImage } from "@/components/ui/ProductImage";
import { NeuralField } from "@/components/motion/NeuralField";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { SplitText } from "@/components/motion/SplitText";
import { easeOutExpo, popIn, riseIn } from "@/lib/motion/motion-presets";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

const promptChips = [
  "Find headphones under $250",
  "Build a creator kit",
  "Best value smart watch",
  "Gift ideas for gamers",
];

const productRow: Variants = {
  hidden: { opacity: 0, x: 80, rotateY: -38, scale: 0.9, filter: "blur(10px)" },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 110, damping: 18, delay: 0.9 + index * 0.14 },
  }),
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLiveProducts(productService.list().slice(0, 3));
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const blobX = useTransform(smoothX, (v) => v * -40);
  const blobY = useTransform(smoothY, (v) => v * -30);
  const blobX2 = useTransform(smoothX, (v) => v * 55);
  const blobY2 = useTransform(smoothY, (v) => v * 40);
  const cardShiftX = useTransform(smoothX, (v) => v * 14);
  const cardShiftY = useTransform(smoothY, (v) => v * 10);
  const cardMoveY = useTransform(() => cardY.get() + cardShiftY.get());

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  return (
    <section
      ref={sectionRef}
      data-fx-manual
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="mesh-bg relative min-h-[calc(100vh-8rem)] overflow-hidden"
    >
      <NeuralField className="absolute inset-0 h-full w-full" />
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <m.div aria-hidden="true" className="absolute inset-0" style={{ x: blobX, y: blobY }}>
        <div className="fx-aurora fx-aurora-a left-[8%] top-[10%] h-80 w-80 bg-cyan-400/25" />
        <div className="fx-aurora fx-aurora-c bottom-[6%] left-[38%] h-72 w-72 bg-brand-500/15" />
      </m.div>
      <m.div aria-hidden="true" className="absolute inset-0" style={{ x: blobX2, y: blobY2 }}>
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="fx-aurora fx-aurora-b right-[6%] top-[4%] h-96 w-96 bg-violet-500/20" />
      </m.div>
      <m.div
        className="premium-container relative grid min-h-[calc(100vh-8rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.9fr]"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        <m.div
          className="w-full min-w-0"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
        >
          <m.p
            variants={popIn}
            className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-brand-700 shadow-sm backdrop-blur"
          >
            <ScrambleText text="Premium AI-powered marketplace" delay={250} duration={1300} />
          </m.p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">
            <SplitText text="Giant Store" delay={0.25} stagger={0.045} />
            <m.span
              className="fx-flow-text block bg-gradient-to-r from-brand-600 via-violet-500 to-cyan-400 bg-clip-text pb-[0.08em] text-transparent"
              initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0, x: -30, filter: "blur(12px)" }}
              animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.3, delay: 0.75, ease: easeOutExpo }}
            >
              shops with you.
            </m.span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            <SplitText
              by="word"
              delay={1.05}
              stagger={0.018}
              text="Explore products saved in your browser with search, comparisons, and an AI advisor. Check product details before making a decision."
            />
          </p>
          <m.form
            variants={riseIn}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("hero-search") as string;
              if (query?.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="relative mt-8 w-full max-w-2xl rounded-[1.35rem] border border-white/70 bg-white/78 p-2 sm:p-3 shadow-glow backdrop-blur flex items-center gap-2 sm:gap-3"
          >
            <span aria-hidden="true" className="fx-ring-glow" />
            <span aria-hidden="true" className="fx-ring" />
            <div className="flex-1 min-w-0">
              <SearchInput
                name="hero-search"
                placeholder="Search products, brands, ideas..."
              />
            </div>
            <button
              type="submit"
              className="fx-shine relative flex h-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-violet-500 px-4 sm:px-6 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Search
            </button>
          </m.form>
          <m.div
            className="mt-5 flex flex-wrap gap-2"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {promptChips.map((chip) => (
              <m.span key={chip} variants={popIn} className="inline-flex">
                <Link
                  href={`/search?q=${encodeURIComponent(chip)}`}
                  className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:text-brand-700"
                >
                  {chip}
                </Link>
              </m.span>
            ))}
          </m.div>
          <m.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={riseIn}>
            <Link
              href="/products"
              data-fx-magnetic
              className="fx-shine relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-violet-500 px-6 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Shop products
            </Link>
            <Link
              href="/deals"
              data-fx-magnetic
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 bg-white/80 px-6 text-sm font-black text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Explore offers
            </Link>
          </m.div>
        </m.div>

        <m.div className="relative grid gap-5" style={{ y: cardMoveY, x: cardShiftX }}>
          <m.div
            initial={{ opacity: 0, y: 70, rotateX: 18, scale: 0.92, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.55 }}
            style={{ transformPerspective: 1200 }}
          >
            <div data-fx-tilt="7" className="fx-tilt premium-card relative p-4">
              <span aria-hidden="true" className="fx-glare" />
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">
                    <ScrambleText text="Browser catalog" delay={900} />
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">Recently added products</h2>
                </div>
                <m.span
                  className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-700"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: [0.4, 1.15, 1] }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  Local preview
                </m.span>
              </div>
              <div className="grid gap-3" style={{ perspective: 900 }}>
                {liveProducts.length > 0 ? (
                  liveProducts.map((product, index) => (
                    <m.article
                      key={product.id}
                      custom={index}
                      variants={productRow}
                      initial="hidden"
                      animate="visible"
                      className="group grid grid-cols-[5.5rem_1fr] items-center gap-4 rounded-2xl border border-white/70 bg-white/76 p-3 shadow-sm backdrop-blur transition hover:shadow-glow"
                      style={{ rotate: index === 1 ? "-1deg" : index === 2 ? "1deg" : "0deg" }}
                    >
                      <div
                        className="fx-float relative aspect-square overflow-hidden rounded-2xl bg-muted"
                        style={{ animationDelay: `${index * -2}s` }}
                      >
                        <ProductImage src={product.imageUrl} alt={product.title} priority />
                      </div>
                      <div>
                        <Link href={`/products/${product.slug}`} className="text-sm font-black text-slate-950 hover:text-brand-600 transition">
                          {product.title}
                        </Link>
                        <p className="mt-1 text-sm font-bold text-brand-700">${product.price}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          {product.brand} · {product.category}
                        </p>
                      </div>
                    </m.article>
                  ))
                ) : (
                  <m.div
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.9 }}
                    className="rounded-2xl border border-white/70 bg-white/76 p-6 text-center shadow-sm backdrop-blur"
                  >
                    <p className="text-sm font-bold text-slate-800">No products yet</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Add products in the Admin dashboard to see them featured here.
                    </p>
                    <Link
                      href="/admin"
                      className="fx-shine relative mt-4 inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-brand-700 transition"
                    >
                      Go to Admin
                    </Link>
                  </m.div>
                )}
              </div>
            </div>
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}
