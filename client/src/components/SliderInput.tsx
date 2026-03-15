import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  testId?: string;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
  testId,
}: SliderInputProps) {
  return (
    <div className="space-y-2.5" data-testid={testId}>
      <div className="flex items-center justify-between gap-2">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <div className="flex items-center gap-1 bg-muted/50 rounded-md px-1 border border-border/50">
          {prefix && <span className="text-xs text-muted-foreground pl-1">{prefix}</span>}
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className="w-24 h-7 text-right text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-1"
            min={min}
            max={max}
            step={step}
          />
          {suffix && <span className="text-xs text-muted-foreground pr-1">{suffix}</span>}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="py-1"
      />
    </div>
  );
}
