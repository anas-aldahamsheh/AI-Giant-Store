"use client";

import { m, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { flyToCart } from "@/lib/motion/fly-to-cart";

/*
 * One place that drives the page-wide motion:
 * smooth scrolling, the scroll progress line, the reveal engine that animates
 * every block of every page as it scrolls in, pointer light and 3D tilt on cards,
 * magnetic buttons, the cursor aura and the click shockwave.
 * A single rAF loop eases all pointer effects and sleeps when nothing moves.
 */

const REVEAL_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "p",
  "img",
  "video",
  "form",
  "table",
  "li",
  "dl",
  "article",
  "pre",
  "hr",
  ".premium-card",
  "[class*='rounded-card']",
  "[class*='rounded-panel']",
  "[class*='rounded-2xl']",
  "[class*='rounded-xl']",
].join(",");

const SPOT_SELECTOR =
  ".premium-card, [class*='rounded-card'], [class*='rounded-panel'], [data-fx-light]";
const MAGNET_SELECTOR =
  "[data-fx-magnetic], a.rounded-full, button.rounded-full, a[class*='rounded-button'], button[class*='rounded-button']";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], summary, label[for], select";

type Eased = {
  el: HTMLElement;
  kind: "tilt" | "magnet";
  x: number;
  y: number;
  tx: number;
  ty: number;
  strength: number;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function kindOf(el: Element) {
  const tag = el.tagName;
  if (tag === "H1" || tag === "H2" || tag === "H3") return "heading";
  if (tag === "P" || tag === "DL" || tag === "PRE" || tag === "HR") return "text";
  if (tag === "IMG" || tag === "VIDEO") return "media";
  if (tag === "LI" || tag === "TABLE") return "row";
  return "card";
}

function useRevealEngine() {
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.remove("fx-boot");
      return;
    }
    root.classList.add("fx-on");

    const seen = new WeakSet<Element>();
    let batch: HTMLElement[] = [];
    let batchFrame = 0;

    const flush = () => {
      batchFrame = 0;
      const items = batch
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
      batch = [];
      items.forEach(({ el }, index) => {
        el.style.setProperty("--fx-d", `${Math.min(index, 10) * 70}ms`);
        el.dataset.fx = "in";
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          batch.push(entry.target as HTMLElement);
        }
        if (batch.length && !batchFrame) batchFrame = requestAnimationFrame(flush);
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );

    const onDone = (event: AnimationEvent) => {
      const el = event.target as HTMLElement;
      if (el.dataset.fx !== "in" || !event.animationName.startsWith("fx-")) return;
      el.removeAttribute("data-fx");
      el.removeAttribute("data-fx-kind");
      el.style.removeProperty("--fx-d");
    };
    document.addEventListener("animationend", onDone);

    const scan = () => {
      const scopes = document.querySelectorAll<HTMLElement>("main, footer");
      scopes.forEach((scope) => {
        scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          if (
            el.closest("[data-fx-manual], [role='dialog'], [aria-hidden='true'], nav")
          )
            return;
          const parent = el.parentElement?.closest(REVEAL_SELECTOR);
          if (parent && scope.contains(parent) && !parent.closest("[data-fx-manual]"))
            return;
          if (el.style.opacity || el.style.transform) return;
          if (getComputedStyle(el).animationName !== "none") return;
          if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
          el.dataset.fxKind = kindOf(el);
          el.dataset.fx = "r";
          io.observe(el);
        });
      });
    };

    let scanFrame = 0;
    const mo = new MutationObserver(() => {
      if (scanFrame) return;
      scanFrame = requestAnimationFrame(() => {
        scanFrame = 0;
        scan();
      });
    });

    // Start once React has finished hydrating the streamed page, so the
    // engine never touches markup React is still comparing.
    const begin = () => {
      scan();
      root.classList.remove("fx-boot");
      mo.observe(document.body, { childList: true, subtree: true });
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(begin, { timeout: 400 })
      : window.setTimeout(begin, 80);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(batchFrame);
      cancelAnimationFrame(scanFrame);
      document.removeEventListener("animationend", onDone);
    };
  }, []);
}

function usePointerEffects() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fine = finePointer();
    const active = new Map<HTMLElement, Eased>();
    const pointer = { x: -100, y: -100, rx: -100, ry: -100, seen: false };
    let frame = 0;
    let spotEl: HTMLElement | null = null;

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    function tick() {
      frame = 0;
      let moving = false;

      for (const item of active.values()) {
        item.x += (item.tx - item.x) * 0.14;
        item.y += (item.ty - item.y) * 0.14;
        const settled =
          Math.abs(item.tx - item.x) < 0.01 && Math.abs(item.ty - item.y) < 0.01;
        if (item.kind === "tilt") {
          item.el.style.setProperty("--rx", `${item.y.toFixed(2)}deg`);
          item.el.style.setProperty("--ry", `${item.x.toFixed(2)}deg`);
          const lift = Math.min(
            1,
            Math.hypot(item.x, item.y) / 4 + (item.tx || item.ty ? 0.6 : 0),
          );
          item.el.style.setProperty("--lift", `${(-8 * lift).toFixed(2)}px`);
        } else {
          item.el.style.transform = `translate3d(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px, 0)`;
        }
        if (settled && item.tx === 0 && item.ty === 0) {
          if (item.kind === "magnet") item.el.style.transform = "";
          else {
            item.el.style.removeProperty("--rx");
            item.el.style.removeProperty("--ry");
            item.el.style.removeProperty("--lift");
          }
          active.delete(item.el);
        } else if (!settled) {
          moving = true;
        }
      }

      if (fine && pointer.seen && dotRef.current && ringRef.current) {
        pointer.rx += (pointer.x - pointer.rx) * 0.2;
        pointer.ry += (pointer.y - pointer.ry) * 0.2;
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
        ringRef.current.style.transform = `translate3d(${pointer.rx.toFixed(1)}px, ${pointer.ry.toFixed(1)}px, 0)`;
        if (
          Math.abs(pointer.x - pointer.rx) > 0.1 ||
          Math.abs(pointer.y - pointer.ry) > 0.1
        )
          moving = true;
      }

      if (moving) wake();
    }

    const track = (el: HTMLElement, kind: Eased["kind"], strength: number) => {
      let item = active.get(el);
      if (!item) {
        item = { el, kind, x: 0, y: 0, tx: 0, ty: 0, strength };
        active.set(el, item);
      }
      return item;
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.seen = true;
      const target = event.target as Element | null;
      if (!target || !(target instanceof Element)) return;

      const spot = target.closest<HTMLElement>(SPOT_SELECTOR);
      if (spot !== spotEl) {
        if (spotEl) spotEl.style.setProperty("--spot", "0");
        spotEl = spot;
        if (spot) {
          spot.dataset.fxLit = "";
          spot.style.setProperty("--spot", "1");
        }
      }
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${event.clientX - r.left}px`);
        spot.style.setProperty("--my", `${event.clientY - r.top}px`);
      }

      if (fine) {
        const tilt = target.closest<HTMLElement>("[data-fx-tilt]");
        for (const item of active.values()) {
          if (item.kind === "tilt" && item.el !== tilt) item.tx = item.ty = 0;
        }
        if (tilt) {
          const r = tilt.getBoundingClientRect();
          const px = (event.clientX - r.left) / r.width - 0.5;
          const py = (event.clientY - r.top) / r.height - 0.5;
          const max = Number(tilt.dataset.fxTilt) || 9;
          const item = track(tilt, "tilt", max);
          item.tx = px * max;
          item.ty = -py * max;
          tilt.style.setProperty("--mx", `${event.clientX - r.left}px`);
          tilt.style.setProperty("--my", `${event.clientY - r.top}px`);
          tilt.style.setProperty("--spot", "1");
        }

        const magnet = target.closest<HTMLElement>(MAGNET_SELECTOR);
        for (const item of active.values()) {
          if (item.kind === "magnet" && item.el !== magnet) item.tx = item.ty = 0;
        }
        if (
          magnet &&
          !magnet.closest("[data-fx-tilt], [role='dialog'], nav") &&
          magnet.offsetWidth < 280
        ) {
          const r = magnet.getBoundingClientRect();
          const item = track(magnet, "magnet", 0.3);
          item.tx = (event.clientX - (r.left + r.width / 2)) * item.strength;
          item.ty = (event.clientY - (r.top + r.height / 2)) * item.strength;
        }

        if (ringRef.current && dotRef.current) {
          const state = target.closest("input, textarea, [contenteditable='true']")
            ? "text"
            : target.closest(INTERACTIVE_SELECTOR)
              ? "hover"
              : "idle";
          ringRef.current.dataset.state = state;
          dotRef.current.dataset.state = state;
        }
      }
      wake();
    };

    const onLeaveWindow = () => {
      for (const item of active.values()) item.tx = item.ty = 0;
      if (spotEl) spotEl.style.setProperty("--spot", "0");
      spotEl = null;
      document
        .querySelectorAll<HTMLElement>("[data-fx-tilt]")
        .forEach((el) => el.style.setProperty("--spot", "0"));
      wake();
    };

    const onDown = (event: PointerEvent) => {
      if (ringRef.current) ringRef.current.dataset.down = "true";
      const target = event.target as Element | null;
      if (!target?.closest?.(INTERACTIVE_SELECTOR)) return;
      shockwave(event.clientX, event.clientY);
    };
    const onUp = () => {
      if (ringRef.current) ringRef.current.dataset.down = "false";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    document.addEventListener(
      "pointerout",
      (event) => {
        const from = (event.target as Element)?.closest?.<HTMLElement>(
          "[data-fx-tilt]",
        );
        const to = (event.relatedTarget as Element | null)?.closest?.("[data-fx-tilt]");
        if (from && from !== to) {
          const item = active.get(from);
          if (item) item.tx = item.ty = 0;
          from.style.setProperty("--spot", "0");
          wake();
        }
      },
      { passive: true },
    );

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, []);

  return { dotRef, ringRef };
}

const SPARK_COLORS = ["#4f46e5", "#8b5cf6", "#22d3ee", "#f59e0b"];

function shockwave(x: number, y: number) {
  const wave = document.createElement("span");
  wave.className = "fx-wave";
  wave.style.left = `${x}px`;
  wave.style.top = `${y}px`;
  document.body.appendChild(wave);
  wave.addEventListener("animationend", () => wave.remove(), { once: true });

  for (let i = 0; i < 8; i += 1) {
    const spark = document.createElement("span");
    spark.className = "fx-spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
    document.body.appendChild(spark);
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
    const distance = 26 + Math.random() * 26;
    spark
      .animate(
        [
          { transform: "translate3d(0,0,0) scale(1)", opacity: 1 },
          {
            transform: `translate3d(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px, 0) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 560 + Math.random() * 200,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
      )
      .finished.then(
        () => spark.remove(),
        () => spark.remove(),
      );
  }
}

function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      wheelMultiplier: 1,
      allowNestedScroll: true,
      anchors: true,
      prevent: (node) =>
        Boolean(
          node.closest?.(
            "[role='dialog'], [role='presentation'], [data-lenis-prevent]",
          ),
        ),
    });
    return () => lenis.destroy();
  }, []);
}

function useCartFlight() {
  useEffect(() => {
    let last: { el: Element; at: number } | null = null;
    const onDown = (event: PointerEvent) => {
      if (event.target instanceof Element)
        last = { el: event.target, at: performance.now() };
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && document.activeElement) {
        last = { el: document.activeElement, at: performance.now() };
      }
    };
    const onAdd = () => {
      if (last && performance.now() - last.at < 1500 && last.el.isConnected) {
        flyToCart(last.el.closest("button, a") ?? last.el);
      }
      last = null;
    };
    document.addEventListener("pointerdown", onDown, { passive: true, capture: true });
    document.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("fx:cart-add", onAdd);
    return () => {
      document.removeEventListener("pointerdown", onDown, { capture: true });
      document.removeEventListener("keydown", onKey, { capture: true });
      window.removeEventListener("fx:cart-add", onAdd);
    };
  }, []);
}

function useHeaderAutoHide() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const header = document.querySelector<HTMLElement>("[data-fx-header]");
        if (!header) return;
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) < 6) return;
        const anyMenuOpen = header.matches(":hover, :focus-within");
        header.dataset.hidden = String(delta > 0 && y > 320 && !anyMenuOpen);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
}

export function MotionDirector() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });
  const { dotRef, ringRef } = usePointerEffects();

  useRevealEngine();
  useSmoothScroll();
  useHeaderAutoHide();
  useCartFlight();

  return (
    <>
      <m.div aria-hidden="true" className="fx-progress" style={{ scaleX: progress }} />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fx-cursor fx-cursor-ring"
        style={{ transform: "translate3d(-120px, -120px, 0)" }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fx-cursor fx-cursor-dot"
        style={{ transform: "translate3d(-120px, -120px, 0)" }}
      />
    </>
  );
}
