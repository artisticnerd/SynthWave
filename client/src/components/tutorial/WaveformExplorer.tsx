import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SynthEngine } from "@/lib/synth";

interface WaveformExplorerProps {
  synth: SynthEngine | undefined;
  onComplete: () => void;
}

interface Waveform {
  type: "sine" | "square" | "sawtooth" | "triangle";
  description: string;
  uses: string;
}

const waveforms: Waveform[] = [
  {
    type: "sine",
    description: "The purest waveform, containing only the fundamental frequency. Produces a smooth, pure tone.",
    uses: "Great for bass sounds, pure tones, and subtle effects.",
  },
  {
    type: "square",
    description: "Contains only odd harmonics, creating a hollow, filtered sound. Very distinctive and 'digital' sounding.",
    uses: "Perfect for retro game sounds, bass lines, and lead sounds.",
  },
  {
    type: "sawtooth",
    description: "Rich in harmonics, contains both odd and even harmonics. Creates a bright, buzzy sound.",
    uses: "Ideal for leads, brass emulation, and rich pads.",
  },
  {
    type: "triangle",
    description: "Similar to sine but with some added harmonics. Softer than square but fuller than sine.",
    uses: "Good for flute-like sounds, soft leads, and mellow bass.",
  },
];

export function WaveformExplorer({ synth, onComplete }: WaveformExplorerProps) {
  const [selectedWave, setSelectedWave] = useState<"sine" | "square" | "sawtooth" | "triangle">("sine");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!synth) return;
    
    if (!isPlaying) {
      synth.setOscillatorType(selectedWave);
      // Play a middle C note
      synth.noteOn(60);
      setIsPlaying(true);
    } else {
      synth.noteOff(60);
      setIsPlaying(false);
    }
  };

  const handleWaveChange = (type: "sine" | "square" | "sawtooth" | "triangle") => {
    setSelectedWave(type);
    if (isPlaying && synth) {
      synth.noteOff(60);
      synth.setOscillatorType(type);
      synth.noteOn(60);
    }
  };

  const currentWaveform = waveforms.find(w => w.type === selectedWave)!;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Select value={selectedWave} onValueChange={handleWaveChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select waveform" />
          </SelectTrigger>
          <SelectContent>
            {waveforms.map((wave) => (
              <SelectItem key={wave.type} value={wave.type}>
                {wave.type.charAt(0).toUpperCase() + wave.type.slice(1)} Wave
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handlePlay}
          variant={isPlaying ? "destructive" : "default"}
        >
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">
            {selectedWave.charAt(0).toUpperCase() + selectedWave.slice(1)} Wave
          </h3>
          <p className="text-muted-foreground mb-4">{currentWaveform.description}</p>
          <h4 className="font-medium mb-2">Common Uses:</h4>
          <p className="text-muted-foreground">{currentWaveform.uses}</p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button onClick={onComplete} className="w-full">
          I understand waveforms, let's continue!
        </Button>
      </div>
    </div>
  );
}
