import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * A citation marker. Shows the brochure short-name and page number only —
 * it is not interactive and opens no preview.
 */
export function CitationChip({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 align-[1px] rounded-[5px] border border-accent-line",
        "bg-accent-tint px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] text-accent-deep",
        className,
      )}
    >
      {children}
    </span>
  );
}
