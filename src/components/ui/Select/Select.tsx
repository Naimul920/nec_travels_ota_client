import * as React from "react";
import clsx from "clsx";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends Omit<React.ComponentProps<"select">, "children"> {
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  options: SelectOption[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  className,
  label,
  error,
  errorMessage,
  iconLeft,
  iconRight,
  options,
  placeholder = "Select option",
  ...props
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Select wrapper */}
      <div className="relative flex items-center">
        {/* Left Icon */}
        {iconLeft && (
          <span className="absolute left-3 text-gray-500">{iconLeft}</span>
        )}

        <select
          className={clsx(
            "border-input flex h-12 w-full appearance-none border bg-transparent px-3 py-1 text-base shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            iconLeft && "pl-10",
            iconRight && "pr-10",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {/* Placeholder */}
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Right Icon (Dropdown Arrow / Custom Icon) */}
        {iconRight && (
          <span className="pointer-events-none absolute right-3 text-gray-500">
            {iconRight}
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Select;
