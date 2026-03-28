import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export default function QuantityInput({ 
  value, 
  onChange, 
  min = 1, 
  max = 99, 
  step = 1,
  label 
}: QuantityInputProps) {
  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs uppercase tracking-wide text-themed-secondary">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-2 bg-themed-btn rounded-xl border border-themed disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-themed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10);
            if (!isNaN(newValue) && newValue >= min && newValue <= max) {
              onChange(newValue);
            }
          }}
          min={min}
          max={max}
          step={step}
          className="w-20 bg-themed-input border border-themed rounded-xl px-2 py-2 text-center text-themed 
                     focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-2 bg-themed-btn rounded-xl border border-themed disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-themed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
