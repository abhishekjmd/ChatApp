import { ReactNode } from "react";

type InputFieldProps = {
  id: string;
  label: string;
  type: "email" | "text";
  name: string;
  placeholder: string;
  autoComplete?: string;
  icon: ReactNode;
};

export function InputField({
  id,
  label,
  type,
  name,
  placeholder,
  autoComplete,
  icon,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
        />
      </div>
    </div>
  );
}
