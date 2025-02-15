import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

interface KeyboardProps {
  noteOn: (midiNote: number) => void;
  noteOff: (midiNote: number) => void;
}

export function Keyboard({ noteOn, noteOff }: KeyboardProps) {
  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('c5');

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  return (
    <div className="mt-4">
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber: number) => noteOn(midiNumber)}
        stopNote={(midiNumber: number) => noteOff(midiNumber)}
        width={800}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
}
