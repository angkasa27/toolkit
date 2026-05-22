import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResolutionControlsProps = {
  height: number;
  onHeightChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  width: number;
};

export function ResolutionControls({
  height,
  onHeightChange,
  onWidthChange,
  width,
}: ResolutionControlsProps) {
  return (
    <section className="flex flex-col gap-3 border-t border-border p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium text-foreground">Resolution</h2>
        <p className="text-xs leading-5 text-muted-foreground">
          Aspect ratio stays locked.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="svg-width">Width</Label>
          <Input
            id="svg-width"
            inputMode="numeric"
            min={1}
            max={8192}
            type="number"
            value={width}
            onChange={(event) => onWidthChange(event.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="svg-height">Height</Label>
          <Input
            id="svg-height"
            inputMode="numeric"
            min={1}
            max={8192}
            type="number"
            value={height}
            onChange={(event) => onHeightChange(event.currentTarget.value)}
          />
        </div>
      </div>
    </section>
  );
}
