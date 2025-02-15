import { Knob } from "./Knob";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OscillatorSectionProps {
  type: "sine" | "square" | "sawtooth" | "triangle";
  detune: number;
  onTypeChange: (type: "sine" | "square" | "sawtooth" | "triangle") => void;
  onDetuneChange: (detune: number) => void;
}

export function OscillatorSection({ type, detune, onTypeChange, onDetuneChange }: OscillatorSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Oscillator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Waveform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sine">Sine</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="sawtooth">Sawtooth</SelectItem>
            <SelectItem value="triangle">Triangle</SelectItem>
          </SelectContent>
        </Select>
        
        <Knob
          value={detune}
          min={-100}
          max={100}
          onChange={onDetuneChange}
          label="Detune"
        />
      </CardContent>
    </Card>
  );
}
