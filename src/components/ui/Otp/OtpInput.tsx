"use client";

import * as React from "react";
import { Input } from "antd";
import clsx from "clsx";

interface OtpInputProps {
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onInput?: (value: string[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  status?: "error" | "warning";
  mask?: boolean | string;
  size?: "small" | "middle" | "large";
  separator?: ((index: number) => React.ReactNode) | React.ReactNode;
  autoComplete?: string;
  style?: React.CSSProperties;
}

const OtpInput: React.FC<OtpInputProps> = ({
  className,
  label,
  error,
  errorMessage,
  length = 6,
  value,
  onChange,
  onInput,
  disabled,
  status,
  mask = false,
  size = "middle",
  separator,
  autoComplete = "one-time-code",
  style,
}) => {
  const effectiveStatus: "error" | "warning" | undefined = error
    ? "error"
    : status;

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-center text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex justify-center">
        <Input.OTP
          length={length}
          value={value}
          onChange={onChange}
          onInput={onInput}
          disabled={disabled}
          status={effectiveStatus}
          mask={mask}
          size={size}
          separator={separator}
          autoComplete={autoComplete}
          style={style}
        />
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-center text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default OtpInput;
