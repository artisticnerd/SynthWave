import * as Tone from 'tone';

export class SynthEngine {
  synth: Tone.PolySynth;
  filter: Tone.Filter;
  delay: Tone.FeedbackDelay;
  reverb: Tone.Reverb;

  constructor() {
    this.synth = new Tone.PolySynth().toDestination();
    this.filter = new Tone.Filter().toDestination();
    this.delay = new Tone.FeedbackDelay().toDestination();
    this.reverb = new Tone.Reverb().toDestination();

    this.synth.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.reverb);
  }

  setOscillatorType(type: "sine" | "square" | "sawtooth" | "triangle") {
    this.synth.set({ oscillator: { type } });
  }

  setDetune(value: number) {
    this.synth.set({ detune: value });
  }

  setFilter(frequency: number, resonance: number, type: "lowpass" | "highpass" | "bandpass") {
    this.filter.set({
      frequency,
      Q: resonance,
      type,
    });
  }

  setEnvelope(attack: number, decay: number, sustain: number, release: number) {
    this.synth.set({
      envelope: {
        attack,
        decay,
        sustain,
        release,
      },
    });
  }

  setDelay(time: number, feedback: number) {
    this.delay.set({
      delayTime: time,
      feedback,
    });
  }

  setReverb(roomSize: number, dampening: number) {
    this.reverb.set({
      decay: roomSize * 10, // Convert 0-1 range to 0-10 seconds
      damping: dampening,
    });
  }

  noteOn(note: number) {
    const freq = Tone.Frequency(note, "midi").toFrequency();
    this.synth.triggerAttack(freq);
  }

  noteOff(note: number) {
    const freq = Tone.Frequency(note, "midi").toFrequency();
    this.synth.triggerRelease(freq);
  }

  isStarted(): boolean {
    return Tone.context.state === "running";
  }

  async start() {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }
  }
}