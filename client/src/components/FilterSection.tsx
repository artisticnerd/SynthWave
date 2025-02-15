import { Knob } from "./Knob";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterSectionProps {
  frequency: number;
  resonance: number;
  type: "lowpass" | "highpass" | "bandpass";
  onFrequencyChange: (freq: number) => void;
  onResonanceChange: (res: number) => void;
  onTypeChange: (type: "lowpass" | "highpass" | "bandpass") => void;
}

export function FilterSection({
  frequency,
  resonance,
  type,
  onFrequencyChange,
  onResonanceChange,
  onTypeChange,
}: FilterSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowpass">Low Pass</SelectItem>
            <SelectItem value="highpass">High Pass</SelectItem>
            <SelectItem value="bandpass">Band Pass</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-4">
          <Knob
            value={frequency}
            min={20}
            max={20000}
            onChange={onFrequencyChange}
            label="Cutoff"
          />
          <Knob
            value={resonance}
            min={0}
            max={20}
            onChange={onResonanceChange}
            label="Resonance"
          />
        </div>
      </CardContent>
    </Card>
  );
}
