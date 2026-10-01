import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export type AvatarProps = {
  name: string;
  imageUrl?: string;
  className?: string;
};

export function Avatar({ name, imageUrl, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={40}
        height={40}
        className={cn("h-10 w-10 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-label={name}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700",
        className,
      )}
    >
      {initials || "?"}
    </span>
  );
}
