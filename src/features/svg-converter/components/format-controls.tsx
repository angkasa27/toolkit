import { Button } from "@/components/ui/button";

import type { OutputFormat } from "../types";

type FormatControlsProps = {
  format: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
};

export function FormatControls({
  format,
  onFormatChange,
}: FormatControlsProps) {
  return (
    <section className="flex flex-col gap-3 border-t border-border p-4">
      <h2 className="text-sm font-medium text-foreground">Format</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={format === "png" ? "secondary" : "outline"}
          onClick={() => onFormatChange("png")}
        >
          PNG
        </Button>
        <Button
          type="button"
          variant={format === "jpg" ? "secondary" : "outline"}
          onClick={() => onFormatChange("jpg")}
        >
          JPG
        </Button>
      </div>
    </section>
  );
}
