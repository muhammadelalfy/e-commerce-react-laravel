"use client";
import React from "react";

/**
 * Country flags rendered from real SVG assets (public/flags/*.svg, from the
 * `flag-icons` set). We use image files rather than emoji because Windows ships
 * no glyphs for the regional-indicator flag emojis (🇸🇦 shows as "SA"), and
 * rather than hand-drawn SVG so the artwork is accurate. Keyed by the country
 * ids in lib/countries.ts; unknown ids fall back to a globe icon.
 */
const KNOWN = new Set(["sa", "ae", "kw", "qa", "bh", "om"]);

export function Flag({ id, size = 20 }: { id: string; size?: number }) {
  if (KNOWN.has(id)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/flags/${id}.svg`}
        alt=""
        aria-label={id.toUpperCase()}
        width={Math.round(size * 1.5)}
        height={size}
        style={{ display: "block", flex: "none", borderRadius: 2, objectFit: "cover", boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.12)" }}
      />
    );
  }
  // generic globe fallback for any other country id
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      <circle cx="12" cy="12" r="10" fill="#e2e8f0" />
      <path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
