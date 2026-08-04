"use client";

import * as React from "react";
import clsx from "clsx";
import { DatePicker as AntDatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { MdOutlineCalendarMonth } from "react-icons/md";

interface DatePickerProps {
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabledDate?: (current: Dayjs) => boolean;
  allowClear?: boolean;
  format?: string;
  name?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  className,
  label,
  error,
  errorMessage,
  required,
  value,
  onChange,
  onBlur,
  placeholder,
  disabledDate,
  allowClear = true,
  format = "MM/DD/YYYY",
  name,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <AntDatePicker
        name={name}
        className={clsx(
          "passenger-date-picker",
          error && "passenger-date-picker-error",
          className
        )}
        value={value ? dayjs(value) : null}
        onChange={(d) => onChange?.(d ? d.format("YYYY-MM-DD") : "")}
        onBlur={onBlur}
        placeholder={placeholder}
        format={format}
        disabledDate={disabledDate}
        allowClear={allowClear}
        status={error ? "error" : undefined}
        suffixIcon={<MdOutlineCalendarMonth className="text-gray-400" />}
      />

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default DatePicker;