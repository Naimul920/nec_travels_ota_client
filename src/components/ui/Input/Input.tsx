import * as React from "react";
import clsx from "clsx";

interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
  error?: boolean;
  label?: string;
  errorMessage?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  className,
  error,
  label,
  errorMessage,
  iconLeft,
  iconRight,
  type = "text",
  ...props
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {iconLeft && (
          <span className="pointer-events-none absolute left-3.5 text-gray-400">
            {iconLeft}
          </span>
        )}

        <input
          type={type}
          className={clsx(
            "h-12 w-full min-w-0 rounded-lg border-2 border-gray-200 bg-white px-3.5 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200",
            "placeholder:font-normal placeholder:text-gray-400",
            "hover:border-gray-300",
            "focus:border-primary focus:ring-4 focus:ring-primary/15",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60",
            iconLeft && "pl-10",
            iconRight && "pr-10",
            error && "border-red-400 hover:border-red-400 focus:border-red-400 focus:ring-red-400/15",
            className
          )}
          {...props}
        />

        {iconRight && (
          <span className="absolute right-3 text-gray-400 cursor-pointer">
            {iconRight}
          </span>
        )}
      </div>

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;