import { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
}

export default function Select({ options, label, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs uppercase tracking-wide text-themed-secondary">{label}</label>
      )}
      <select
        className={`bg-themed-input border border-themed rounded-xl px-3 py-2.5 text-themed 
                    focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                    ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
