import { cn } from "../lib/cn";
import { BRAND_NAME, BRAND_TAGLINE } from "../lib/brand";
import { Logo } from "./Logo";

type Props = {
  /** Small mono caption shown beside the wordmark. */
  tag?: string;
  /** Colour of the caption — defaults to the muted slate used on light surfaces. */
  tagClassName?: string;
  className?: string;
  size?: number;
};

export function Wordmark({
  tag = BRAND_TAGLINE,
  tagClassName = "text-muted-2",
  className,
  size = 19,
}: Props) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo size={Math.round(size * 1.35)} />
      <span
        className="font-semibold tracking-[-0.01em]"
        style={{ fontSize: size }}
      >
        {BRAND_NAME}
      </span>
      {tag ? (
        <span
          className={cn(
            "font-mono text-[10.5px] uppercase tracking-[0.14em]",
            tagClassName,
          )}
        >
          {tag}
        </span>
      ) : null}
    </div>
  );
}
