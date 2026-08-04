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
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      {/* Select wrapper */}
      <div className="relative flex items-center">
        {/* Left Icon */}
        {iconLeft && (
          <span className="pointer-events-none absolute left-3.5 text-gray-400">
            {iconLeft}
          </span>
        )}

        <select
          className={clsx(
            "h-12 w-full cursor-pointer appearance-none rounded-lg border-2 border-gray-200 bg-white px-3.5 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200",
            "hover:border-gray-300",
            "focus:border-primary focus:ring-4 focus:ring-primary/15",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60",
            iconLeft && "pl-10",
            iconRight && "pr-10",
            error && "border-red-400 hover:border-red-400 focus:border-red-400 focus:ring-red-400/15",
            className
          )}
          {...props}
        >
          {/* Placeholder */}
          <option value="" disabled className="text-gray-400">
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
          <span className="pointer-events-none absolute right-3 text-gray-400">
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
