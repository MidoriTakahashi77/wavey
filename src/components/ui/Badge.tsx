import { ComponentProps } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

type BadgeProps = ComponentProps<"span"> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
