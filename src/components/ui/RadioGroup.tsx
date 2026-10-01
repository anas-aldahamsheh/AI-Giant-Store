import { cn } from "@/lib/utils/cn";

export type RadioOption = {
  label: string;
  value: string;
  description?: string;
};

export type RadioGroupProps = {
  name: string;
  legend: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  className,
}: RadioGroupProps) {
  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-card border border-border bg-surface p-3 transition hover:bg-brand-50"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              className="mt-0.5 h-4 w-4 accent-[var(--brand-600)] focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            />
            <span>
              <span className="block text-sm font-medium text-foreground">
                {option.label}
              </span>
              {option.description ? (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {option.description}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
