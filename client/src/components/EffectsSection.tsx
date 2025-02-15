import { Knob } from "./Knob";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EffectsSectionProps {
  delayTime: number;
  delayFeedback: number;
  reverbSize: number;
  reverbDamp: number;
  onDelayTimeChange: (value: number) => void;
  onDelayFeedbackChange: (value: number) => void;
  onReverbSizeChange: (value: number) => void;
  onReverbDampChange: (value: number) => void;
}

export function EffectsSection({
  delayTime,
  delayFeedback,
  reverbSize,
  reverbDamp,
  onDelayTimeChange,
  onDelayFeedbackChange,
  onReverbSizeChange,
  onReverbDampChange,
}: EffectsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Effects</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-medium mb-4">Delay</h3>
          <div className="flex gap-4">
            <Knob
              value={delayTime}
              min={0}
              max={1}
              onChange={onDelayTimeChange}
              label="Time"
            />
            <Knob
              value={delayFeedback}
              min={0}
              max={0.9}
              onChange={onDelayFeedbackChange}
              label="Feedback"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Reverb</h3>
          <div className="flex gap-4">
            <Knob
              value={reverbSize}
              min={0}
              max={0.9}
              onChange={onReverbSizeChange}
              label="Size"
            />
            <Knob
              value={reverbDamp}
              min={0}
              max={1}
              onChange={onReverbDampChange}
              label="Damping"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
