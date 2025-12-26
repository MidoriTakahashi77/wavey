import { ComponentProps, forwardRef } from "react";

type CardProps = ComponentProps<"div"> & {
  clickable?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ clickable = false, className = "", children, ...props }, ref) => {
    const baseStyles = "bg-white border border-gray-200 rounded-md p-4 transition-colors";
    const clickableStyles = clickable
      ? "cursor-pointer hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100"
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${clickableStyles} ${className}`}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
