interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "md",
  label = "Loading…",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    <div
      className={`inline-block rounded-full border-primary/30 border-t-primary animate-spin ${sizeMap[size]}`}
      role="status"
      aria-label={label}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center flex-col gap-4">
        {spinner}
        {label && (
          <p className="text-sm text-muted-foreground font-body">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      {spinner}
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
