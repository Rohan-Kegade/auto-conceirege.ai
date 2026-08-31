import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "outline" | "solid" | "light";

const VARIANTS: Record<Variant, string> = {
  /** Dark pill — the main call to action on light surfaces. */
  primary:
    "border-none bg-ink text-canvas rounded-full hover:bg-accent-deep",
  /** Hairline pill — secondary action on light surfaces. */
  outline:
    "border border-stroke bg-transparent rounded-full hover:border-ink",
  /** Dark rounded-rect — forms and the app chrome. */
  solid:
    "border-none bg-ink text-canvas rounded-[10px] hover:bg-accent-deep",
  /** Light pill — call to action on the dark footer band. */
  light:
    "border-none bg-canvas text-ink rounded-full hover:bg-accent-wash",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  return (
    <button
      className={cn(
        "cursor-pointer whitespace-nowrap transition-colors",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
}
