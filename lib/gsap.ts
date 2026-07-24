"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ---- GSAP registration (client-only, once) ---- */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Hero slide image animation. Attach the returned ref to the hero <section>.
 * Whenever the active slide index changes, the active slide's product image
 * animates in (scale + fade + slight rise) and then gently floats.
 */
export function useHeroImage<T extends HTMLElement = HTMLElement>(activeIndex: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.mash-hero-card[data-active="true"]');
    if (!card) return;
    const img = card.querySelector<HTMLElement>(".mash-hero-img");
    const glow = card.querySelector<HTMLElement>(".mash-hero-glow");
    if (!img) return;
    // Always guarantee the image ends fully visible even if the effect re-runs
    // (auto-advance) mid-animation.
    if (reduced()) { gsap.set(img, { opacity: 1, scale: 1, y: 0, rotate: 0 }); return; }

    // guarantee visible baseline first, then play a non-destructive entrance
    gsap.set(img, { opacity: 1, scale: 1, y: 0, rotate: 0 });
    const tweens: gsap.core.Tween[] = [];
    tweens.push(
      gsap.from(img, {
        scale: 0.72, opacity: 0, y: 16, rotate: -3,
        duration: 0.7, ease: "back.out(1.5)", overwrite: true,
        immediateRender: false,
      })
    );
    if (glow) {
      tweens.push(
        gsap.fromTo(glow, { scale: 0.85, opacity: 0.35 },
          { scale: 1.08, opacity: 0.85, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true, overwrite: true })
      );
    }
    return () => {
      tweens.forEach((t) => t.kill());
      gsap.set(img, { opacity: 1, scale: 1, y: 0, rotate: 0 });
    };
  }, [activeIndex]);
  return ref;
}

/**
 * Reveal children on scroll: fade + rise, staggered.
 * Attach the returned ref to a container; its direct element children animate in.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const kids = gsap.utils.toArray<HTMLElement>(el.children);
      // fromTo guarantees the end state (opacity 1) so children never get stuck
      // hidden if the trigger's start position is already passed on load.
      gsap.fromTo(kids,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * Auto-reveal every major block on a page as it scrolls into the viewport.
 * Attach the returned ref to the page's <main> wrapper; on each `pageKey`
 * change it (re)scans for sections/cards/grids and gives each a fade-up on
 * scroll. This makes the WHOLE site animate on scroll without editing every
 * component. Elements can opt out with `data-no-reveal`.
 */
export function useAutoReveal<T extends HTMLElement = HTMLDivElement>(pageKey: unknown) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    // wait a frame so the freshly-routed page has painted
    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        // candidate blocks: sections, direct grids, cards, list rows, headings
        const nodes = gsap.utils.toArray<HTMLElement>(
          el.querySelectorAll(
            "section, [style*='grid-template-columns'], [class*='container'] > div, footer > div"
          )
        );
        // de-dupe + skip the sticky header/hero (hero has its own animation)
        const seen = new Set<HTMLElement>();
        const targets = nodes.filter((n) => {
          if (seen.has(n)) return false;
          seen.add(n);
          if (n.hasAttribute("data-no-reveal")) return false;
          if (n.closest("header")) return false;
          // never touch the hero or anything inside it (it has its own animation)
          if (n.classList.contains("mash-hero") || n.closest(".mash-hero")) return false;
          if (n.getBoundingClientRect().height < 20) return false;
          return true;
        });
        const vh = window.innerHeight;
        targets.forEach((node) => {
          const top = node.getBoundingClientRect().top;
          // Element already in/above the viewport on load → reveal immediately
          // (never leave it hidden waiting for a scroll that already happened).
          if (top < vh * 0.9) {
            gsap.fromTo(node, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" });
            return;
          }
          // Below the fold → reveal when scrolled into view.
          gsap.fromTo(node,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
              scrollTrigger: { trigger: node, start: "top 88%", once: true },
            }
          );
        });
        ScrollTrigger.refresh();
      }, el);
      (el as any).__revealCtx = ctx;
    });
    return () => {
      cancelAnimationFrame(raf);
      (ref.current as any)?.__revealCtx?.revert?.();
    };
  }, [pageKey]);
  return ref;
}

/**
 * Parallax: attach to an element that should drift vertically as the user
 * scrolls past it (scrub-linked to scroll position). Good for hero / banner
 * images. `amount` = px of total drift (negative moves up).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(amount = 60, deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -amount / 2 }, {
        y: amount / 2,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * Scrub reveal: children of the container fade + rise in, linked to scroll
 * progress (they animate as you scroll rather than all at once). Attach to a
 * grid/list wrapper.
 */
export function useScrubReveal<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    // opt this subtree out of the global auto-reveal so they don't fight
    el.setAttribute("data-no-reveal", "");
    el.querySelectorAll(":scope > *").forEach((c) => c.setAttribute("data-no-reveal", ""));
    const ctx = gsap.context(() => {
      const kids = gsap.utils.toArray<HTMLElement>(el.children);
      gsap.from(kids, {
        opacity: 0,
        y: 40,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 45%",
          scrub: 0.6,
        },
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ============================================================
   VARIED SCROLL ANIMATIONS
   A palette of distinct entrance effects, each a hook returning
   a ref. Every one uses fromTo (guaranteed end-state) + a
   toggleActions ScrollTrigger so elements never get stuck hidden.
   ============================================================ */

type RevealVars = { start?: string; stagger?: number; duration?: number; once?: boolean };

function buildTrigger(el: Element, o: RevealVars = {}) {
  return {
    trigger: el,
    start: o.start ?? "top 88%",
    toggleActions: o.once === false ? "play none none reverse" : "play none none none",
  };
}

/** children slide in from the inline-start side (respects RTL/LTR via `x`). */
export function useSlideIn<T extends HTMLElement = HTMLDivElement>(dir: "left" | "right" = "right", deps: unknown[] = [], o: RevealVars = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const rtl = document.documentElement.dir === "rtl";
    const sign = (dir === "right") === rtl ? -1 : 1;
    const ctx = gsap.context(() => {
      gsap.fromTo(gsap.utils.toArray<HTMLElement>(el.children),
        { opacity: 0, x: sign * 60 },
        { opacity: 1, x: 0, duration: o.duration ?? 0.7, ease: "power3.out", stagger: o.stagger ?? 0.08, scrollTrigger: buildTrigger(el, o) });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** children scale/zoom in with a soft back-ease pop. */
export function useZoomIn<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = [], o: RevealVars = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(gsap.utils.toArray<HTMLElement>(el.children),
        { opacity: 0, scale: 0.82, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: o.duration ?? 0.6, ease: "back.out(1.4)", stagger: o.stagger ?? 0.07, scrollTrigger: buildTrigger(el, o) });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** children 3D flip up on the X axis (like cards turning to face you). */
export function useFlipIn<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = [], o: RevealVars = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { perspective: 800 });
      gsap.fromTo(gsap.utils.toArray<HTMLElement>(el.children),
        { opacity: 0, rotationX: -55, y: 40, transformOrigin: "50% 100%" },
        { opacity: 1, rotationX: 0, y: 0, duration: o.duration ?? 0.75, ease: "power3.out", stagger: o.stagger ?? 0.09, scrollTrigger: buildTrigger(el, o) });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** children blur + fade into focus. */
export function useBlurIn<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = [], o: RevealVars = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(gsap.utils.toArray<HTMLElement>(el.children),
        { opacity: 0, filter: "blur(10px)", y: 24 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: o.duration ?? 0.8, ease: "power2.out", stagger: o.stagger ?? 0.08, scrollTrigger: buildTrigger(el, o) });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * ScrollTrigger.batch across a whole page: give every element matching
 * `selector` (inside the ref) a batched stagger reveal as groups enter the
 * viewport. Best for large collections. Attach ref to a page wrapper.
 */
export function useBatchReveal<T extends HTMLElement = HTMLDivElement>(selector: string, pageKey: unknown) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(selector));
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 34 });
    const raf = requestAnimationFrame(() => {
      const batch = ScrollTrigger.batch(items, {
        start: "top 90%",
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.09, overwrite: true }),
        onEnterBack: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06, overwrite: true }),
      });
      (el as any).__batch = batch;
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(raf);
      (ref.current as any)?.__batch?.forEach((b: ScrollTrigger) => b.kill());
      gsap.set(items, { clearProps: "opacity,transform" });
    };
  }, [pageKey]);
  return ref;
}

/**
 * Simple fade-up for a single element when it enters the viewport.
 */
export function useFadeUp<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * Seamless horizontal marquee. Attaches to a track that contains two
 * identical halves side by side; loops -50% forever. Pauses on hover of
 * the nearest `.mash-ticker` ancestor.
 */
export function useMarquee<T extends HTMLElement = HTMLDivElement>(
  speed = 60,
  deps: unknown[] = []
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) return;
    let tween: gsap.core.Tween | null = null;
    // wait a frame so layout width is settled
    const id = requestAnimationFrame(() => {
      const half = el.scrollWidth / 2;
      const dur = half / speed;
      tween = gsap.to(el, {
        x: -half,
        duration: dur,
        ease: "none",
        repeat: -1,
      });
      const ticker = el.closest(".mash-ticker");
      const pause = () => tween?.pause();
      const resume = () => tween?.play();
      ticker?.addEventListener("mouseenter", pause);
      ticker?.addEventListener("mouseleave", resume);
      (el as any).__cleanup = () => {
        ticker?.removeEventListener("mouseenter", pause);
        ticker?.removeEventListener("mouseleave", resume);
      };
    });
    return () => {
      cancelAnimationFrame(id);
      tween?.kill();
      (el as any).__cleanup?.();
      gsap.set(el, { x: 0 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/**
 * Hero "offers" motion graphic — rotating rings, pulsing badge,
 * drifting discount tags, twinkling sparkles. Replaces the CSS @keyframes.
 * Selectors are scoped to the returned container ref.
 */
export function useOffersMotion<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.to(".mash-ring-dash", { rotation: 360, duration: 18, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      gsap.to(".mash-ring-inner", { rotation: -360, duration: 7, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      gsap.to(".mash-badge", { scale: 1.05, duration: 1.5, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "50% 50%" });

      gsap.utils.toArray<HTMLElement>(".mash-pulse").forEach((ring, i) => {
        gsap.set(ring, { scale: 0.7, opacity: 0.55, transformOrigin: "50% 50%" });
        gsap.to(ring, {
          scale: 1.5, opacity: 0, duration: 2.8, ease: "power1.out",
          repeat: -1, delay: i * 1.4,
        });
      });

      gsap.utils.toArray<HTMLElement>(".mash-tag").forEach((tag, i) => {
        gsap.fromTo(tag,
          { y: 8, opacity: 0, rotation: -8 },
          { y: -12, opacity: 1, rotation: -8, duration: 2.25, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 1.3 }
        );
      });

      gsap.utils.toArray<HTMLElement>(".mash-spark").forEach((s, i) => {
        gsap.set(s, { scale: 0.6, opacity: 0.2, transformOrigin: "50% 50%" });
        gsap.to(s, { scale: 1, opacity: 1, duration: 1.1, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.8 });
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return ref;
}

export { gsap, ScrollTrigger };
