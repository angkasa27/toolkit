import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import type { BackgroundMode } from "../types";

type EditControlsProps = {
  backgroundMode: BackgroundMode;
  colorInput: string;
  error: string | null;
  hasImage: boolean;
  lastValidColor: string;
  onBackgroundModeChange: (mode: BackgroundMode) => void;
  onColorInputChange: (value: string) => void;
  onZoomChange: (zoom: number) => void;
  zoom: number;
};

export function EditControls({
  backgroundMode,
  colorInput,
  error,
  hasImage,
  lastValidColor,
  onBackgroundModeChange,
  onColorInputChange,
  onZoomChange,
  zoom,
}: EditControlsProps) {
  return (
    <section className="flex flex-col gap-5 border-t border-border p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="favicon-zoom">Resize</Label>
          <p className="text-xs text-muted-foreground">
            {Math.round(zoom * 100)}%
          </p>
        </div>
        <Slider
          id="favicon-zoom"
          min={0.25}
          max={4}
          step={0.01}
          value={[zoom]}
          disabled={!hasImage}
          onValueChange={(value) => {
            const nextZoom = Array.isArray(value) ? value[0] : value;

            onZoomChange(nextZoom ?? zoom);
          }}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-foreground">
          Background
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={backgroundMode === "transparent" ? "secondary" : "outline"}
            onClick={() => onBackgroundModeChange("transparent")}
          >
            Transparent
          </Button>
          <Button
            type="button"
            variant={backgroundMode === "color" ? "secondary" : "outline"}
            onClick={() => onBackgroundModeChange("color")}
          >
            Custom
          </Button>
        </div>

        {backgroundMode === "color" ? (
          <div className="flex items-center gap-3">
            <input
              aria-label="Background color"
              type="color"
              value={lastValidColor}
              onChange={(event) => onColorInputChange(event.target.value)}
              className={cn(
                "h-9 w-12 shrink-0 rounded-md border border-input bg-transparent p-1",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              )}
            />
            <Input
              aria-label="Background hex color"
              value={colorInput}
              onChange={(event) => onColorInputChange(event.target.value)}
            />
          </div>
        ) : null}
      </fieldset>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
