import * as Tone from 'tone';

export class SynthEngine {
  synth: Tone.PolySynth;
  filter: Tone.Filter;
  delay: Tone.FeedbackDelay;
  reverb: Tone.Reverb;
  recorder: MediaRecorder | null = null;
  chunks: BlobPart[] = [];
  audioContext: AudioContext | null = null;

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

  // Recording methods using MediaRecorder with WAV format
  async startRecording() {
    if (this.recorder) return;

    const dest = Tone.context.createMediaStreamDestination();
    this.reverb.connect(dest);

    // Create a new AudioContext for recording
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(dest.stream);
    const processor = this.audioContext.createScriptProcessor(2048, 2, 2);

    this.chunks = [];

    processor.onaudioprocess = (e) => {
      if (!this.recorder) return;

      // Convert to 16-bit PCM
      const left = e.inputBuffer.getChannelData(0);
      const right = e.inputBuffer.getChannelData(1);
      const interleaved = new Float32Array(left.length * 2);

      for (let i = 0; i < left.length; i++) {
        interleaved[i * 2] = left[i];
        interleaved[i * 2 + 1] = right[i];
      }

      this.chunks.push(interleaved);
    };

    source.connect(processor);
    processor.connect(this.audioContext.destination);

    // Start recording
    this.recorder = new MediaRecorder(dest.stream);
    this.recorder.start();
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.recorder || !this.audioContext) {
        reject(new Error('No recording in progress'));
        return;
      }

      // Convert recorded chunks to WAV format
      const sampleRate = this.audioContext.sampleRate;
      const numChannels = 2;
      let totalLength = 0;

      // Calculate total length
      for (const chunk of this.chunks) {
        totalLength += chunk.length;
      }

      // Create the final buffer
      const finalBuffer = new Float32Array(totalLength);
      let offset = 0;

      // Combine all chunks
      for (const chunk of this.chunks) {
        finalBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      // Create WAV file
      const wavBuffer = this.createWavFile(finalBuffer, sampleRate, numChannels);
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

      // Clean up
      this.chunks = [];
      this.recorder.stop();
      this.recorder = null;
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      resolve(wavBlob);
    });
  }

  private createWavFile(audioData: Float32Array, sampleRate: number, numChannels: number): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');                    // RIFF identifier
    view.setUint32(4, 36 + audioData.length * 2, true); // file length
    writeString(8, 'WAVE');                    // RIFF type
    writeString(12, 'fmt ');                   // format chunk identifier
    view.setUint32(16, 16, true);             // format chunk length
    view.setUint16(20, 1, true);              // sample format (1 = PCM)
    view.setUint16(22, numChannels, true);    // number of channels
    view.setUint32(24, sampleRate, true);     // sample rate
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, numChannels * 2, true);// block align
    view.setUint16(34, 16, true);             // bits per sample
    writeString(36, 'data');                  // data chunk identifier
    view.setUint32(40, audioData.length * 2, true); // data chunk length

    // Write audio data
    const volume = 0.8;
    let offset = 44;
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }

    return buffer;
  }

  isRecording(): boolean {
    return this.recorder !== null && this.recorder.state === "recording";
  }
}