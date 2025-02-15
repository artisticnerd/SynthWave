import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SynthEngine } from "@/lib/synth";
import { OscillatorSection } from "@/components/OscillatorSection";
import { FilterSection } from "@/components/FilterSection";
import { EnvelopeSection } from "@/components/EnvelopeSection";
import { EffectsSection } from "@/components/EffectsSection";
import { Keyboard } from "@/components/Keyboard";
import { type SynthSettings } from "@shared/schema";

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
      dampening: 3000,
    },
  },
};

export default function Synth() {
  const [synth, setSynth] = useState<SynthEngine>();
  const [settings, setSettings] = useState<SynthSettings>(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    const synthEngine = new SynthEngine();
    synthEngine.start().then(() => {
      setSynth(synthEngine);
      toast({
        title: "Synth Ready",
        description: "Click or use your keyboard to play notes!",
      });
    });
  }, [toast]);

  useEffect(() => {
    if (!synth) return;

    synth.setOscillatorType(settings.oscillator.type);
    synth.setDetune(settings.oscillator.detune);
    synth.setFilter(
      settings.filter.frequency,
      settings.filter.resonance,
      settings.filter.type
    );
    synth.setEnvelope(
      settings.envelope.attack,
      settings.envelope.decay,
      settings.envelope.sustain,
      settings.envelope.release
    );
    synth.setDelay(settings.effects.delay.time, settings.effects.delay.feedback);
    synth.setReverb(settings.effects.reverb.roomSize, settings.effects.reverb.dampening);
  }, [settings, synth]);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Web Synth</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="mt-8 flex justify-center">
        <Keyboard
          noteOn={(note) => synth?.noteOn(note)}
          noteOff={(note) => synth?.noteOff(note)}
        />
      </div>
    </div>
  );
}
