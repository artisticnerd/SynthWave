import * as Tone from 'tone';

export class SynthEngine {
  synth: Tone.PolySynth;
  filter: Tone.Filter;
  delay: Tone.FeedbackDelay;
  reverb: Tone.Reverb;
  recorder: MediaRecorder | null = null;
  chunks: BlobPart[] = [];

  constructor() {
    // Initialize audio nodes
    this.synth = new Tone.PolySynth();
    this.filter = new Tone.Filter();
    this.delay = new Tone.FeedbackDelay();
    this.reverb = new Tone.Reverb();

    // Connect the audio chain
    this.synth.connect(this.filter);
    this.filter.connect(this.delay);
    this.delay.connect(this.reverb);
    this.reverb.connect(Tone.Destination);
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

  // Recording methods using MediaRecorder
  async startRecording() {
    if (this.recorder) return;

    const dest = Tone.context.createMediaStreamDestination();
    this.reverb.connect(dest);

    this.chunks = [];
    this.recorder = new MediaRecorder(dest.stream, {
      mimeType: 'audio/webm'
    });

    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.recorder.start();
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.recorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.recorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.chunks = [];
        this.recorder = null;
        resolve(blob);
      };

      this.recorder.stop();
    });
  }

  isRecording(): boolean {
    return this.recorder !== null && this.recorder.state === "recording";
  }
}