"use client";

import { useEffect, useRef, useState, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function Select({
  id,
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  ...props
}: SelectProps) {
  const reactId = useId();
  const selectId = id ?? (props.name ? `${props.name}-${reactId}` : reactId);
  const descriptionId = `${selectId}-description`;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>((value as string) ?? (defaultValue as string) ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const nativeSelectRef = useRef<HTMLSelectElement>(null);

  // Sync state if value prop changes (controlled component behavior)
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value as string);
    }
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;
    
    setSelectedValue(optionValue);
    setIsOpen(false);

    // Sync native select value and dispatch change event
    if (nativeSelectRef.current) {
      nativeSelectRef.current.value = optionValue;
      const event = new Event("change", { bubbles: true });
      nativeSelectRef.current.dispatchEvent(event);
    }

    // Call onChange prop if provided
    if (onChange && nativeSelectRef.current) {
      // Mock event to match expected ChangeEvent signature
      const mockEvent = {
        target: nativeSelectRef.current,
        currentTarget: nativeSelectRef.current,
        type: "change",
        bubbles: true,
        cancelable: true,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(mockEvent);
    }
  };

  // Find the label to show
  const currentOption = options.find((opt) => opt.value === selectedValue);
  const triggerLabel = currentOption 
    ? currentOption.label 
    : (selectedValue === "" && placeholder ? placeholder : (options[0]?.label ?? "Select option"));

  return (
    <div ref={containerRef} className="relative block w-full">
      {label ? (
        <span className="block mb-2 text-sm font-semibold text-slate-700">{label}</span>
      ) : null}

      {/* Hidden Native Select for form submissions & library compatibility */}
      <select
        ref={nativeSelectRef}
        id={selectId}
        name={props.name}
        value={selectedValue}
        onChange={onChange || (() => {})}
        disabled={disabled}
        className="sr-only"
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom Styled Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-button border bg-surface px-4 text-sm text-foreground shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
          isOpen ? "border-brand-500 ring-2 ring-brand-500/20" : error ? "border-danger" : "border-border",
          disabled && "cursor-not-allowed opacity-50 bg-slate-100",
          className
        )}
      >
        <span className="truncate font-semibold text-slate-800">{triggerLabel}</span>
        <svg
          className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Beautiful Animated Custom Dropdown list */}
      {isOpen && (
        <div
          className="absolute top-full left-0 z-30 mt-1 w-full rounded-panel border border-border bg-white p-1.5 shadow-glow max-h-60 overflow-y-auto focus:outline-none scrollbar-thin origin-top animate-[slide-down_150ms_ease-out_both]"
        >
          {placeholder && (
            <button
              type="button"
              onClick={() => handleOptionClick("")}
              className={cn(
                "w-full rounded-card px-3 py-2 text-left text-sm transition hover:bg-brand-50 hover:text-brand-700",
                selectedValue === "" ? "bg-brand-50 font-bold text-brand-700" : "text-slate-600"
              )}
            >
              {placeholder}
            </button>
          )}
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={cn(
                  "w-full rounded-card px-3 py-2.5 text-left text-sm transition focus:outline-none mb-0.5 last:mb-0",
                  isSelected
                    ? "bg-brand-600 font-bold text-white shadow-sm"
                    : "text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-semibold"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {error || hint ? (
        <span
          id={descriptionId}
          className={cn("block mt-2 text-xs", error ? "text-danger" : "text-muted-foreground")}
        >
          {error ?? hint}
        </span>
      ) : null}
    </div>
  );
}
