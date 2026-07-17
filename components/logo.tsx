import { cn } from "@/lib/utils";

// Height (px) of the logo for each size.
const heights: Record<"sm" | "md" | "lg", number> = {
  sm: 30,
  md: 38,
  lg: 48,
};

const GOLD = "#F6A81C";

// Gold double-chevron mark, drawn in a 34 x 48 coordinate space.
const chevronPaths = (
  <>
    <path d="M2 8 L20 24 L2 40 L2 31 L10 24 L2 17 Z" />
    <path d="M14 8 L32 24 L14 40 L14 31 L22 24 L14 17 Z" />
  </>
);

/**
 * Smart Communications logo, drawn as inline SVG.
 *
 * - No background, no image file, no CSS filters — renders identically in every
 *   theme and can never show a stray white box.
 * - The wordmark uses `currentColor` (theme-aware: dark on light, white on dark).
 * - The chevron mark stays gold in both themes.
 * - `showText={false}` renders just the gold chevron (collapsed sidebar).
 */
export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const h = heights[size];

  if (!showText) {
    return (
      <svg
        viewBox="0 0 34 48"
        height={h}
        role="img"
        aria-label="Smart Communications"
        className={cn("w-auto shrink-0", className)}
      >
        <g fill={GOLD}>{chevronPaths}</g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 228 60"
      height={h}
      role="img"
      aria-label="Smart Communications"
      className={cn("w-auto shrink-0 text-foreground", className)}
    >
      <text
        x="0"
        y="34"
        textLength="178"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="40"
        fontWeight={800}
        letterSpacing="-1"
        fill="currentColor"
      >
        SMART
      </text>
      <text
        x="1"
        y="53"
        textLength="176"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="14.5"
        fontWeight={600}
        fill="currentColor"
      >
        COMMUNICATIONS
      </text>
      <g transform="translate(192 6) scale(0.78)" fill={GOLD}>
        {chevronPaths}
      </g>
    </svg>
  );
}
