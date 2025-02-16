import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { SynthEngine } from "@/lib/synth";
import { WaveformExplorer } from "@/components/tutorial/WaveformExplorer";

interface TutorialStep {
  title: string;
  description: string;
  component: React.FC<{
    synth: SynthEngine | undefined;
    onComplete: () => void;
  }>;
}

const steps: TutorialStep[] = [
  {
    title: "Understanding Waveforms",
    description:
      "Learn about the basic building blocks of synthesis: sine, square, sawtooth, and triangle waves.",
    component: WaveformExplorer,
  },
  // More steps will be added as we implement them
  // Video tutorials will be added as we implement them
];

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [synth, setSynth] = useState<SynthEngine>();
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (isStarted && !synth) {
      const initSynth = async () => {
        const synthEngine = new SynthEngine();
        await synthEngine.start();
        setSynth(synthEngine);
      };
      initSynth();
    }
  }, [isStarted, synth]);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((curr) => curr + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((curr) => curr - 1);
    }
  };

  const currentProgress = ((currentStep + 1) / steps.length) * 100;

  const StepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Sound Design Tutorial</h1>

        {!isStarted ? (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Sound Design</CardTitle>
              <CardDescription>
                Learn the basics of synthesis through interactive examples and
                challenges. We'll guide you through understanding waveforms,
                filters, envelopes, and effects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStart}>Start Tutorial</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <Progress value={currentProgress} />
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StepComponent synth={synth} onComplete={handleNext} />
              </CardContent>
            </Card>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
