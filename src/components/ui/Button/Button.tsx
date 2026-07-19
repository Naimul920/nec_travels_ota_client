import * as React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ComponentProps<"button"> {
  className?: string;
  isLoading?: boolean;
  error?: boolean;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  className,
  isLoading,
  error,
  variant = "primary",
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer ",

        variant === "primary"
          ? "bg-primary text-white"
          : "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800",

        isLoading || props.disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:opacity-90",

        error && "bg-red-500 hover:bg-red-600 active:bg-red-700",

        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span>Loading...</span> : children}
    </button>
  );
};

export default Button;
