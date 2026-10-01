"use client";

import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function MagneticButton({ className, style, ...props }: MagneticButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <button
      className={cn(
        "rounded-button bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
        className,
      )}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        ...style,
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({
          x: (event.clientX - rect.left - rect.width / 2) * 0.08,
          y: (event.clientY - rect.top - rect.height / 2) * 0.08,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      {...props}
    />
  );
}
