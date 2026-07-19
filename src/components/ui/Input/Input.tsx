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
      {/* Label */}
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input wrapper for icons */}
      <div className="relative flex items-center">
        {/* Left icon */}
        {iconLeft && (
          <span className="absolute left-3 text-gray-500">{iconLeft}</span>
        )}

        <input
          type={type}
          className={clsx(
            "placeholder:text-muted-foreground border-input flex h-12 w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            iconLeft && "pl-10", 
            iconRight && "pr-10", 
            error && "border-red-500",
            className
          )}
          {...props}
        />

        {/* Right icon */}
        {iconRight && (
          <span className="absolute right-3 text-gray-500 cursor-pointer">
            {iconRight}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
