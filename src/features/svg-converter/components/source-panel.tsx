import type { ChangeEvent, DragEvent, RefObject } from "react";

import { Button } from "@/components/ui/button";

type SourcePanelProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function SourcePanel({
  fileInputRef,
  onDragOver,
  onDrop,
  onFileChange,
}: SourcePanelProps) {
  return (
    <section
      className="flex flex-col gap-3 p-4"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium text-foreground">Source</h2>
        <p className="text-xs leading-5 text-muted-foreground">
          Select or drop one SVG file.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="justify-start"
      >
        Select SVG
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/svg+xml,.svg"
        onChange={onFileChange}
        className="hidden"
      />
    </section>
  );
}
