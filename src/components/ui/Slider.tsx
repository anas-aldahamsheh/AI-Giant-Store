import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  valueLabel?: string;
};

export function Slider({ label, valueLabel, className, ...props }: SliderProps) {
  return (
    <label className="block space-y-3">
      {label || valueLabel ? (
        <span className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-foreground">{label}</span>
          {valueLabel ? (
            <span className="text-muted-foreground">{valueLabel}</span>
          ) : null}
        </span>
      ) : null}
      <input
        type="range"
        className={cn("w-full accent-[var(--brand-600)]", className)}
        {...props}
      />
    </label>
  );
}
