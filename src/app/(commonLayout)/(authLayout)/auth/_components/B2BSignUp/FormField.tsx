import { InputHTMLAttributes, ReactNode } from "react";
import ErrorText from "./ErrorText";
import CountryFlag from "@/components/ui/CountryFlag/CountryFlag";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: ReactNode;
  flag?: string;
  error?: string;
  prefix?: string;
  trailing?: ReactNode;
}

export default function FormField({
  label,
  name,
  icon,
  flag,
  error,
  prefix,
  trailing,
  className,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-[11px] font-medium text-slate-700">
        {label}
      </label>

      <div
        className={`flex items-center rounded-lg border bg-white px-3 py-1.5 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 ${
          error ? "border-rose-400" : "border-slate-200"
        }`}
      >
        {flag ? (
          <CountryFlag
            dial={flag}
            className="mr-2 h-4 w-6 rounded-[2px] object-cover"
          />
        ) : (
          icon && <span className="mr-2 shrink-0 text-slate-400">{icon}</span>
        )}

        {prefix && (
          <span className="mr-2 shrink-0 border-r border-slate-200 pr-2 text-sm font-medium text-slate-600">
            {prefix}
          </span>
        )}

        <input
          id={name}
          name={name}
          className="w-full bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />

        {trailing}
      </div>

      <ErrorText id={errorId} message={error} />
    </div>
  );
}
