import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import type { SynthSettings } from "@shared/schema";

interface PresetManagerProps {
  currentSettings: SynthSettings;
  onLoadPreset: (settings: SynthSettings) => void;
}

export function PresetManager({ currentSettings, onLoadPreset }: PresetManagerProps) {
  const [newPresetName, setNewPresetName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: presets = [] } = useQuery({
    queryKey: ["/api/presets"],
  });

  const createPreset = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/presets", {
        name: newPresetName,
        settings: currentSettings,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setNewPresetName("");
      toast({
        title: "Success",
        description: "Preset saved successfully!",
      });
    },
  });

  const deletePreset = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/presets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      toast({
        title: "Success",
        description: "Preset deleted successfully!",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Preset name"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
            />
            <Button 
              onClick={() => createPreset.mutate()}
              disabled={!newPresetName || createPreset.isPending}
            >
              Save
            </Button>
          </div>

          <div className="space-y-2">
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                <span className="flex-grow">{preset.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoadPreset(preset.settings)}
                >
                  Load
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePreset.mutate(preset.id)}
                  disabled={deletePreset.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
