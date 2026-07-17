"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      gsap.from(kids, {
        opacity: 0,
        y: 26,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
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
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
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
