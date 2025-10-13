import React, { useEffect, useMemo, useRef, useState } from "react";
import { Megaphone } from "lucide-react";

export type MarqueeSize = "sm" | "md" | "lg";

type TrackStyle = React.CSSProperties & Record<"--content-width", string>;

export function MarqueeBanner({
  message,
  speed = 80, // pixels per second
  pauseOnHover = true,
  className = "",
  size = "md",
  cta,
}: {
  message: string | string[];
  speed?: number; // px/s
  pauseOnHover?: boolean;
  className?: string;
  size?: MarqueeSize;
  cta?: { label: string; href?: string; onClick?: () => void };
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState<number>(20); // seconds
  const [hovered, setHovered] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>(0);

  // Normalize message into items (split to chips if a single string)
  const items = useMemo(() => {
    if (Array.isArray(message))
      return message.filter(Boolean).map((m) => m.trim());
    const parts = message
      .split(/[•|—,]/g)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length ? parts : [message];
  }, [message]);

  // Chip & container sizing — bigger text, slightly smaller height
  const sizing = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          containerPadX: "px-4",
          containerPadY: "py-1.5",
          trackHeight: "h-8",
          chipText: "text-base font-semibold", // bigger
          chipPad: "px-2.5 py-0.5",
          gap: "gap-3",
          iconSize: "h-4 w-4",
          headerPadTop: "pt-1.5",
        } as const;
      case "lg":
        return {
          containerPadX: "px-6",
          containerPadY: "py-2.5",
          trackHeight: "h-12", // smaller than before
          chipText: "text-xl", // bigger
          chipPad: "px-4 py-1",
          gap: "gap-5",
          iconSize: "h-6 w-6",
          headerPadTop: "pt-2.5",
        } as const;
      default:
        return {
          containerPadX: "px-5",
          containerPadY: "py-1.5",
          trackHeight: "h-9", // slightly smaller
          chipText: "text-lg", // bigger
          chipPad: "px-3 py-0.5",
          gap: "gap-4",
          iconSize: "h-5 w-5",
          headerPadTop: "pt-1.5",
        } as const;
    }
  }, [size]);

  // Measure content width for a perfect, gapless loop
  useEffect(() => {
    const recalc = () => {
      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;
      const width = text.scrollWidth; // width of one sequence
      setContentWidth(width);
      const pxPerSec = Math.max(24, speed);
      const d = Math.max(6, Math.round(width / pxPerSec));
      setDuration(d);
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    if (textRef.current) ro.observe(textRef.current);
    return () => ro.disconnect();
  }, [items, speed]);

  const trackStyle = useMemo<TrackStyle>(
    () => ({
      "--content-width": `${contentWidth}px`,
      animationDuration: `${duration}s`,
      animationPlayState: pauseOnHover && hovered ? "paused" : "running",
    }),
    [contentWidth, duration, hovered, pauseOnHover]
  );

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => pauseOnHover && setHovered(true)}
      onMouseLeave={() => pauseOnHover && setHovered(false)}
      className={[
        "relative overflow-hidden text-white shadow-xl",
        // Premium red gradient background
        "bg-gradient-to-br from-red-600 via-red-600 to-red-700",
        // Soft outer glow
        "ring-1 ring-white/10",
        className,
      ].join(" ")}
      aria-live="polite"
    >
      {/* Animated sheen overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute -inset-x-1/3 -inset-y-1/2 rotate-12 bg-[radial-gradient(closest-side,white,transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.25),transparent)] animate-[sheen_7s_linear_infinite]" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 mix-blend-soft-light opacity-20 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.12)_0px,rgba(255,255,255,.12)_1px,transparent_1px,transparent_10px)]" />
      </div>

      {/* Header strip */}
      <div
        className={[
          "relative z-10 flex items-center gap-2 px-4 text-sm/6 opacity-90 select-none",
          sizing.headerPadTop,
        ].join(" ")}
      >
        <span className="relative inline-flex h-2 w-2 overflow-hidden rounded-full bg-emerald-300">
          <span className="absolute inset-0 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-emerald-200" />
        </span>
        <Megaphone className={`${sizing.iconSize}`} aria-hidden />
        <span className="font-medium tracking-wide">Pengumuman</span>
        {cta ? (
          cta.href ? (
            <a
              href={cta.href}
              onClick={cta.onClick}
              className="ml-auto inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur hover:bg-white/25 transition-colors"
            >
              {cta.label}
            </a>
          ) : (
            <button
              onClick={cta.onClick}
              className="ml-auto inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur hover:bg-white/25 transition-colors"
            >
              {cta.label}
            </button>
          )
        ) : null}
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fading edges for elegance */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-red-700 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-red-700 to-transparent" />

        <div
          className={[
            "relative",
            sizing.containerPadX,
            sizing.containerPadY,
          ].join(" ")}
        >
          <div
            className={`relative mx-auto ${sizing.trackHeight} w-full overflow-hidden`}
          >
            <div
              className="track absolute left-0 top-0 flex h-full whitespace-nowrap will-change-transform"
              style={trackStyle}
              role="marquee"
              aria-label={Array.isArray(message) ? message.join(", ") : message}
            >
              {/* Duplicate content for seamless loop */}
              <div
                ref={textRef}
                className={`sequence inline-flex items-center ${sizing.gap}`}
                style={{ width: "var(--content-width)" }}
              >
                {items.map((it, i) => (
                  <span
                    key={`a-${i}`}
                    className={[
                      "chip inline-flex items-center rounded-full border border-white/15 bg-white/10/50 backdrop-blur-sm shadow-sm",
                      sizing.chipPad,
                      sizing.chipText,
                    ].join(" ")}
                  >
                    {it}
                  </span>
                ))}
              </div>
              <div
                className={`sequence inline-flex items-center ${sizing.gap}`}
                style={{ width: "var(--content-width)" }}
                aria-hidden
              >
                {items.map((it, i) => (
                  <span
                    key={`b-${i}`}
                    className={[
                      "chip inline-flex items-center rounded-full border border-white/15 bg-white/10/50 backdrop-blur-sm shadow-sm",
                      sizing.chipPad,
                      sizing.chipText,
                    ].join(" ")}
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom border for depth */}
      <div className="h-px w-full bg-white/20" />

      <style jsx>{`
        @keyframes marqueeSlide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-1 * var(--content-width, 0px)));
          }
        }
        @keyframes sheen {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .track {
          width: calc(var(--content-width, 0px) * 2);
          animation-name: marqueeSlide;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .track {
            animation: none;
            transform: translateX(0);
          }
          .animate-[sheen_7s_linear_infinite] {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}