import { InputHTMLAttributes, ReactNode } from "react";
import ErrorText from "./ErrorText";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: ReactNode;
  error?: string;
  prefix?: string;
  trailing?: ReactNode;
}

export default function FormField({
  label,
  name,
  icon,
  error,
  prefix,
  trailing,
  className,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div
        className={`flex items-center rounded-xl border bg-white px-4 py-3 transition-colors focus-within:border-[#8c181f] focus-within:ring-2 focus-within:ring-[#8c181f]/10 ${
          error ? "border-rose-400" : "border-slate-200"
        }`}
      >
        {icon && <span className="mr-3 shrink-0 text-slate-400">{icon}</span>}

        {prefix && (
          <span className="mr-2 shrink-0 border-r border-slate-200 pr-2 text-sm font-medium text-slate-600">
            {prefix}
          </span>
        )}

        <input
          id={name}
          name={name}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
