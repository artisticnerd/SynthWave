import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SynthEngine } from "@/lib/synth";

interface RecorderManagerProps {
  synth: SynthEngine | undefined;
}

export function RecorderManager({ synth }: RecorderManagerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    if (!synth) return;

    try {
      await synth.startRecording();
      setIsRecording(true);
      setRecordedBlob(null);
      toast({
        title: "Recording Started",
        description: "Your synth performance is now being recorded.",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = async () => {
    if (!synth) return;

    try {
      const blob = await synth.stopRecording();
      setRecordedBlob(blob);
      setIsRecording(false);
      toast({
        title: "Recording Finished",
        description: "Click the download button to save your recording.",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to stop recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!recordedBlob) return;

    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synth-recording-${new Date().toISOString()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      {!isRecording ? (
        <Button
          onClick={handleStartRecording}
          disabled={!synth || synth.isRecording()}
          variant="secondary"
          className="gap-2"
        >
          <Mic className="w-4 h-4" />
          Record
        </Button>
      ) : (
        <Button
          onClick={handleStopRecording}
          variant="secondary"
          className="gap-2"
        >
          <Square className="w-4 h-4" />
          Stop
        </Button>
      )}

      {recordedBlob && (
        <Button
          onClick={handleDownload}
          variant="outline"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      )}
    </div>
  );
}
