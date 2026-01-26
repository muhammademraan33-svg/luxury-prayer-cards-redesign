import { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  showReset?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SliderInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  defaultValue,
  showReset = false,
  disabled = false,
  className = '',
}: SliderInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsEditing(false);
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setInputValue(clamped.toString());
    } else {
      setInputValue(value.toString());
    }
  }, [inputValue, min, max, onChange, value]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value.toString());
    }
  }, [handleInputBlur, value]);

  const handleReset = useCallback(() => {
    if (defaultValue !== undefined) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange]);

  const displayValue = Math.round(value * 100) / 100;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Label className="text-slate-400 text-xs w-10 flex-shrink-0">{label}</Label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        disabled={disabled}
        className="flex-1 accent-amber-600 h-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ touchAction: 'none' }}
      />
      {isEditing ? (
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          min={min}
          max={max}
          step={step}
          autoFocus
          className="w-16 h-6 text-xs bg-slate-700 border-slate-500 text-white text-center p-1"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setInputValue(displayValue.toString());
            setIsEditing(true);
          }}
          disabled={disabled}
          className="text-xs text-slate-300 w-14 text-right hover:text-amber-400 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:no-underline"
        >
          {displayValue}{unit}
        </button>
      )}
      {showReset && defaultValue !== undefined && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={disabled || value === defaultValue}
          className="h-6 w-6 p-0 text-slate-400 hover:text-amber-400 disabled:opacity-30"
          title="Reset to default"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
