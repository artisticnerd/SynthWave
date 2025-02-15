import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface KnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  className?: string;
}

export function Knob({ value, min, max, onChange, label, className }: KnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
  }, [value]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = startY - e.clientY;
    const range = max - min;
    const deltaValue = (deltaY / 100) * range;
    const newValue = Math.min(max, Math.max(min, startValue + deltaValue));

    onChange(newValue);
  }, [isDragging, min, max, startY, startValue, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate rotation from -150 to 150 degrees (300 degree range)
  const rotation = ((value - min) / (max - min)) * 300 - 150;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "w-16 h-16 rounded-full bg-secondary border-2 border-primary cursor-pointer relative",
          "hover:border-primary/80 transition-colors",
          isDragging && "border-primary/60"
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Center dot */}
        <div className="absolute w-2 h-2 rounded-full bg-primary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        {/* Indicator line */}
        <div
          className="absolute w-0.5 h-6 bg-primary rounded-full left-1/2 -translate-x-1/2 origin-bottom transition-transform"
          style={{ 
            transform: `rotate(${rotation}deg) translateY(-25%)`,
            transformOrigin: 'bottom center'
          }}
        />
      </div>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{value.toFixed(2)}</span>
    </div>
  );
}