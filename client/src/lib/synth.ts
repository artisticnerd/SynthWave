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
      roomSize,
      dampening,
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

  async start() {
    await Tone.start();
  }
}
