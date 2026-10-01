import { Button } from "@/components/ui/Button";

export type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="rounded-card border border-red-200 bg-red-50 p-6 text-red-950"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6">{message}</p>
      {onRetry ? (
        <Button type="button" variant="danger" className="mt-5" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </section>
  );
}
