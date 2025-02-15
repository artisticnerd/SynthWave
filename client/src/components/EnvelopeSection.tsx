import { Knob } from "./Knob";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnvelopeSectionProps {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  onAttackChange: (value: number) => void;
  onDecayChange: (value: number) => void;
  onSustainChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
}

export function EnvelopeSection({
  attack,
  decay,
  sustain,
  release,
  onAttackChange,
  onDecayChange,
  onSustainChange,
  onReleaseChange,
}: EnvelopeSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Envelope</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Knob
          value={attack}
          min={0}
          max={2}
          onChange={onAttackChange}
          label="Attack"
        />
        <Knob
          value={decay}
          min={0}
          max={2}
          onChange={onDecayChange}
          label="Decay"
        />
        <Knob
          value={sustain}
          min={0}
          max={1}
          onChange={onSustainChange}
          label="Sustain"
        />
        <Knob
          value={release}
          min={0}
          max={5}
          onChange={onReleaseChange}
          label="Release"
        />
      </CardContent>
    </Card>
  );
}
