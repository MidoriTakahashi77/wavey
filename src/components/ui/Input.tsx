"use client";

import { Field } from "@base-ui/react/field";
import { ComponentProps, forwardRef } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", disabled, ...props }, ref) => {
    return (
      <Field.Root disabled={disabled} invalid={!!error} className="flex flex-col gap-1">
        {label && (
          <Field.Label className="text-sm font-medium text-gray-700">
            {label}
          </Field.Label>
        )}
        <Field.Control
          ref={ref}
          className={`
            w-full px-3 py-2 text-base text-gray-900
            bg-white border border-gray-300 rounded-md
            placeholder:text-gray-400
            hover:border-gray-400
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <Field.Description className="text-sm text-gray-500">
            {hint}
          </Field.Description>
        )}
        {error && (
          <Field.Error className="text-sm text-red-600">
            {error}
          </Field.Error>
        )}
      </Field.Root>
    );
  }
);

Input.displayName = "Input";
