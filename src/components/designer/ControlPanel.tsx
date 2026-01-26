import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import { SliderInput } from './SliderInput';

interface PositionControlsProps {
  label: string;
  x: number;
  y: number;
  onXChange: (value: number) => void;
  onYChange: (value: number) => void;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  defaultX?: number;
  defaultY?: number;
  onReset?: () => void;
  disabled?: boolean;
}

export const PositionControls = ({
  label,
  x,
  y,
  onXChange,
  onYChange,
  xMin = 0,
  xMax = 100,
  yMin = 0,
  yMax = 100,
  defaultX = 50,
  defaultY = 50,
  onReset,
  disabled = false,
}: PositionControlsProps) => {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onXChange(defaultX);
      onYChange(defaultY);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-slate-400 text-xs">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={disabled}
          className="h-5 px-2 text-xs text-slate-400 hover:text-amber-400"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>
      <SliderInput
        label="L/R"
        value={x}
        onChange={onXChange}
        min={xMin}
        max={xMax}
        unit="%"
        defaultValue={defaultX}
        disabled={disabled}
      />
      <SliderInput
        label="U/D"
        value={y}
        onChange={onYChange}
        min={yMin}
        max={yMax}
        unit="%"
        defaultValue={defaultY}
        disabled={disabled}
      />
    </div>
  );
};

interface SizeControlProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  defaultValue?: number;
  showReset?: boolean;
  disabled?: boolean;
  isAuto?: boolean;
  onAutoToggle?: () => void;
}

export const SizeControl = ({
  label = 'Size',
  value,
  onChange,
  min = 10,
  max = 150,
  unit = 'pt',
  defaultValue,
  showReset = false,
  disabled = false,
  isAuto = false,
  onAutoToggle,
}: SizeControlProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <SliderInput
          label={label}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          unit={unit}
          defaultValue={defaultValue}
          showReset={showReset}
          disabled={disabled || isAuto}
        />
      </div>
      {onAutoToggle && (
        <Button
          type="button"
          variant={isAuto ? 'default' : 'outline'}
          size="sm"
          onClick={onAutoToggle}
          className={`h-5 px-2 text-xs ${isAuto ? 'bg-amber-600' : 'border-slate-600 text-slate-300'}`}
        >
          Auto
        </Button>
      )}
    </div>
  );
};

interface ZoomPanControlsProps {
  zoom: number;
  panX: number;
  panY: number;
  rotation?: number;
  brightness?: number;
  onZoomChange: (value: number) => void;
  onPanXChange: (value: number) => void;
  onPanYChange: (value: number) => void;
  onRotationChange?: (value: number) => void;
  onBrightnessChange?: (value: number) => void;
  onReset: () => void;
  zoomMin?: number;
  zoomMax?: number;
  panMin?: number;
  panMax?: number;
}

export const ZoomPanControls = ({
  zoom,
  panX,
  panY,
  rotation,
  brightness,
  onZoomChange,
  onPanXChange,
  onPanYChange,
  onRotationChange,
  onBrightnessChange,
  onReset,
  zoomMin = 1,
  zoomMax = 3,
  panMin = -100,
  panMax = 100,
}: ZoomPanControlsProps) => {
  return (
    <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-slate-400 text-xs">Image Adjustments</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-5 px-2 text-xs text-slate-400 hover:text-amber-400"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>
      
      <SliderInput
        label="Zoom"
        value={zoom}
        onChange={onZoomChange}
        min={zoomMin}
        max={zoomMax}
        step={0.1}
        unit="%"
        defaultValue={1}
      />
      
      <SliderInput
        label="L/R"
        value={panX}
        onChange={onPanXChange}
        min={panMin}
        max={panMax}
        defaultValue={0}
      />
      
      <SliderInput
        label="U/D"
        value={panY}
        onChange={onPanYChange}
        min={panMin}
        max={panMax}
        defaultValue={0}
      />
      
      {onRotationChange !== undefined && rotation !== undefined && (
        <SliderInput
          label="Rotate"
          value={rotation}
          onChange={onRotationChange}
          min={-180}
          max={180}
          unit="°"
          defaultValue={0}
        />
      )}
      
      {onBrightnessChange !== undefined && brightness !== undefined && (
        <SliderInput
          label="Bright"
          value={brightness}
          onChange={onBrightnessChange}
          min={50}
          max={150}
          step={5}
          unit="%"
          defaultValue={100}
        />
      )}
    </div>
  );
};
