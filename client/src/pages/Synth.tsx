import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SynthEngine } from "@/lib/synth";
import { OscillatorSection } from "@/components/OscillatorSection";
import { FilterSection } from "@/components/FilterSection";
import { EnvelopeSection } from "@/components/EnvelopeSection";
import { EffectsSection } from "@/components/EffectsSection";
import { Keyboard } from "@/components/Keyboard";
import { type SynthSettings } from "@shared/schema";
import { PresetManager } from "@/components/PresetManager";
import { Music } from "lucide-react";
import { RecorderManager } from "@/components/RecorderManager";

const defaultSettings: SynthSettings = {
  oscillator: {
    type: "sine",
    detune: 0,
  },
  filter: {
    frequency: 1000,
    resonance: 1,
    type: "lowpass",
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5,
  },
  effects: {
    delay: {
      time: 0.3,
      feedback: 0.3,
    },
    reverb: {
      roomSize: 0.5,
      dampening: 3000, // Minimum value should be above 0
    },
  },
};

export default function Synth() {
  const [synth, setSynth] = useState<SynthEngine>();
  const [isStarted, setIsStarted] = useState(false);
  const [settings, setSettings] = useState<SynthSettings>(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    const synthEngine = new SynthEngine();
    setSynth(synthEngine);
  }, []);

  useEffect(() => {
    if (!synth) return;

    try {
      synth.setOscillatorType(settings.oscillator.type);
      synth.setDetune(settings.oscillator.detune);
      synth.setFilter(
        Math.max(20, settings.filter.frequency), // Ensure minimum frequency
        Math.max(0.001, settings.filter.resonance), // Ensure minimum resonance
        settings.filter.type
      );
      synth.setEnvelope(
        Math.max(0.001, settings.envelope.attack),
        Math.max(0.001, settings.envelope.decay),
        Math.max(0.001, settings.envelope.sustain),
        Math.max(0.001, settings.envelope.release)
      );
      synth.setDelay(
        Math.max(0.001, settings.effects.delay.time),
        Math.max(0.001, settings.effects.delay.feedback)
      );
      synth.setReverb(
        Math.max(0.001, settings.effects.reverb.roomSize),
        Math.max(20, settings.effects.reverb.dampening) // Ensure minimum dampening
      );
    } catch (error) {
      console.error('Error updating synth settings:', error);
    }
  }, [settings, synth]);

  const handleStart = async () => {
    if (!synth) return;

    try {
      await synth.start();
      setIsStarted(true);
      toast({
        title: "Synth Ready",
        description: "Click or use your keyboard to play notes!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start audio context. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Web Synth</h1>

      {!isStarted ? (
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            onClick={handleStart}
            className="gap-2"
          >
            <Music className="w-5 h-5" />
            Start Synth
          </Button>
        </div>
      ) : (
        <div className="flex justify-center mb-8">
          <RecorderManager synth={synth} />
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OscillatorSection
            type={settings.oscillator.type}
            detune={settings.oscillator.detune}
            onTypeChange={(type) =>
              setSettings((s) => ({ ...s, oscillator: { ...s.oscillator, type } }))
            }
            onDetuneChange={(detune) =>
              setSettings((s) => ({ ...s, oscillator: { ...s.oscillator, detune } }))
            }
          />

          <FilterSection
            frequency={settings.filter.frequency}
            resonance={settings.filter.resonance}
            type={settings.filter.type}
            onFrequencyChange={(frequency) =>
              setSettings((s) => ({ ...s, filter: { ...s.filter, frequency } }))
            }
            onResonanceChange={(resonance) =>
              setSettings((s) => ({ ...s, filter: { ...s.filter, resonance } }))
            }
            onTypeChange={(type) =>
              setSettings((s) => ({ ...s, filter: { ...s.filter, type } }))
            }
          />

          <EnvelopeSection
            attack={settings.envelope.attack}
            decay={settings.envelope.decay}
            sustain={settings.envelope.sustain}
            release={settings.envelope.release}
            onAttackChange={(attack) =>
              setSettings((s) => ({ ...s, envelope: { ...s.envelope, attack } }))
            }
            onDecayChange={(decay) =>
              setSettings((s) => ({ ...s, envelope: { ...s.envelope, decay } }))
            }
            onSustainChange={(sustain) =>
              setSettings((s) => ({ ...s, envelope: { ...s.envelope, sustain } }))
            }
            onReleaseChange={(release) =>
              setSettings((s) => ({ ...s, envelope: { ...s.envelope, release } }))
            }
          />

          <EffectsSection
            delayTime={settings.effects.delay.time}
            delayFeedback={settings.effects.delay.feedback}
            reverbSize={settings.effects.reverb.roomSize}
            reverbDamp={settings.effects.reverb.dampening}
            onDelayTimeChange={(time) =>
              setSettings((s) => ({
                ...s,
                effects: { ...s.effects, delay: { ...s.effects.delay, time } },
              }))
            }
            onDelayFeedbackChange={(feedback) =>
              setSettings((s) => ({
                ...s,
                effects: { ...s.effects, delay: { ...s.effects.delay, feedback } },
              }))
            }
            onReverbSizeChange={(roomSize) =>
              setSettings((s) => ({
                ...s,
                effects: { ...s.effects, reverb: { ...s.effects.reverb, roomSize } },
              }))
            }
            onReverbDampChange={(dampening) =>
              setSettings((s) => ({
                ...s,
                effects: { ...s.effects, reverb: { ...s.effects.reverb, dampening } },
              }))
            }
          />
        </div>

        <PresetManager
          currentSettings={settings}
          onLoadPreset={setSettings}
        />

        <div className="mt-8 flex justify-center">
          <Keyboard
            noteOn={(note) => synth?.noteOn(note)}
            noteOff={(note) => synth?.noteOff(note)}
          />
        </div>
      </div>
    </div>
  );
}