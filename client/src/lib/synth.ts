import * as Tone from 'tone';

export class SynthEngine {
  synth: Tone.PolySynth;
  filter: Tone.Filter;
  delay: Tone.FeedbackDelay;
  reverb: Tone.Reverb;
  recorder: Tone.Recorder;

  constructor() {
    // Initialize audio nodes
    this.synth = new Tone.PolySynth();
    this.filter = new Tone.Filter();
    this.delay = new Tone.FeedbackDelay();
    this.reverb = new Tone.Reverb();
    this.recorder = new Tone.Recorder();

    // Connect the audio chain
    this.synth.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.reverb);
    this.reverb.connect(Tone.Destination);
    // Connect the final output to the recorder in parallel
    this.reverb.connect(this.recorder);
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
      wet: 0.5, // Fixed wet/dry mix
      preDelay: 0.01 // Small pre-delay for better sound
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

  // Recording methods
  async startRecording() {
    await this.recorder.start();
  }

  async stopRecording(): Promise<Blob> {
    const recording = await this.recorder.stop();
    return new Blob([recording], { type: 'audio/wav' });
  }

  isRecording(): boolean {
    return this.recorder.state === "started";
  }
}