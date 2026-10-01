import { cn } from "@/lib/utils/cn";

export type StepperStep = {
  label: string;
  description?: string;
};

export type StepperProps = {
  steps: StepperStep[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <li key={step.label} className="flex items-start gap-3">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                isComplete || isActive
                  ? "bg-brand-600 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {stepNumber}
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{step.label}</span>
              {step.description ? (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {step.description}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
