import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type BackgroundControlsProps = {
  canUseTransparent: boolean;
  colorInput: string;
  isTransparent: boolean;
  lastValidColor: string;
  onColorInputChange: (value: string) => void;
  onTransparentChange: (transparent: boolean) => void;
};

export function BackgroundControls({
  canUseTransparent,
  colorInput,
  isTransparent,
  lastValidColor,
  onColorInputChange,
  onTransparentChange,
}: BackgroundControlsProps) {
  return (
    <section className="flex flex-col gap-3 border-t border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="transparent-background">Transparent background</Label>
          <p className="text-xs leading-5 text-muted-foreground">
            Available for PNG only.
          </p>
        </div>
        <Switch
          id="transparent-background"
          checked={isTransparent}
          disabled={!canUseTransparent}
          onCheckedChange={onTransparentChange}
        />
      </div>

      {!isTransparent ? (
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
    </section>
  );
}
