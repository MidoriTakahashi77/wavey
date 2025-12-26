"use client";

import { Button } from "@/components/ui";

type WaveButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
};

export function WaveButton({ onClick, disabled, size = "sm" }: WaveButtonProps) {
  return (
    <Button
      variant="secondary"
      size={size}
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "通話中のため送信できません" : "手を振る"}
    >
      👋
    </Button>
  );
}
