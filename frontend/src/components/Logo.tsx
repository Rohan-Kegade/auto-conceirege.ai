import { cn } from "../lib/cn";

/** The bare spark glyph — inherits `currentColor` for the strokes. */
export function SparkGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

/** Brand mark — the spark glyph on an accent squircle. Pair with the wordmark. */
export function Logo({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-[30%] bg-accent text-canvas",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <SparkGlyph size={Math.round(size * 0.58)} />
    </span>
  );
}
