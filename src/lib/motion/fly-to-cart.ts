/**
 * Sends a copy of the product image on a curved flight into the cart button,
 * then tells the cart button to bounce. Purely visual; the cart itself is
 * updated by the caller.
 */
export function flyToCart(from: Element | null) {
  if (typeof window === "undefined" || !from) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = Array.from(
    document.querySelectorAll<HTMLElement>("[data-cart-target]"),
  );
  const target = targets.find(
    (el) => el.offsetParent !== null && el.getBoundingClientRect().width > 0,
  );
  if (!target) return;

  const card = from.closest("article, [data-fly-source]") ?? from;
  const image = card.querySelector("img");
  const start = (image ?? from).getBoundingClientRect();
  const header = target.closest<HTMLElement>("[data-fx-header]");
  const headerWasHidden = header?.dataset.hidden === "true";
  if (header && headerWasHidden) header.dataset.hidden = "false";
  const measured = target.getBoundingClientRect();
  const end =
    headerWasHidden && header
      ? new DOMRect(
          measured.left,
          measured.top + header.offsetHeight,
          measured.width,
          measured.height,
        )
      : measured;
  const size = Math.min(140, Math.max(56, start.width));

  const ghost = document.createElement("div");
  ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${start.left + start.width / 2 - size / 2}px`,
    top: `${start.top + start.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    zIndex: "9997",
    borderRadius: "1.25rem",
    pointerEvents: "none",
    backgroundColor: "#eef6ff",
    backgroundImage: image
      ? `url("${image.currentSrc || image.src}")`
      : "linear-gradient(135deg, #4f46e5, #8b5cf6, #22d3ee)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow:
      "0 0 0 2px rgb(255 255 255 / 0.9), 0 20px 50px rgb(79 70 229 / 0.45), 0 0 40px rgb(34 211 238 / 0.45)",
    willChange: "transform, opacity",
  });
  document.body.appendChild(ghost);

  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);
  const lift = Math.min(-120, dy * 0.5 - 160);
  const frames: Keyframe[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = dx * t;
    const y = dy * t * t + lift * 4 * t * (1 - t) * 0.5;
    const scale = 1 - 0.82 * t;
    frames.push({
      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${t * 380}deg)`,
      borderRadius: `${1.25 + t * 20}rem`,
      opacity: t > 0.92 ? 0.4 : 1,
    });
  }

  ghost
    .animate(frames, { duration: 900, easing: "cubic-bezier(0.55, 0, 0.35, 1)" })
    .finished.then(
      () => {
        ghost.remove();
        target.classList.remove("fx-bump");
        void target.offsetWidth;
        target.classList.add("fx-bump");
        window.dispatchEvent(new CustomEvent("fx:cart-landed"));
      },
      () => ghost.remove(),
    );
}
