import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export type ProductImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function ProductImage({ src, alt, priority = false, className }: ProductImageProps) {
  const safeSrc = src.startsWith("/") && !src.startsWith("//")
    ? src
    : /^https:\/\/[^\s]+$/i.test(src) ? src : null;
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-card bg-muted",
        className,
      )}
    >
      {safeSrc ? (
        <Image
          src={safeSrc}
          alt={alt}
          fill
          unoptimized={safeSrc.startsWith("https://")}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          priority={priority}
        />
      ) : (
        <span className="flex h-full items-center justify-center p-3 text-center text-xs font-medium text-muted-foreground" role="img" aria-label={alt}>
          Image unavailable
        </span>
      )}
    </div>
  );
}
