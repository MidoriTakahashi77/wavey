"use client";

type CallTimerProps = {
  duration: number;
  className?: string;
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function CallTimer({ duration, className = "" }: CallTimerProps) {
  return (
    <div className={`font-mono text-lg ${className}`}>
      {formatDuration(duration)}
    </div>
  );
}
