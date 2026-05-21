import type { ChangeEvent, RefObject } from "react";

import { Button } from "@/components/ui/button";

type SourceControlsProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function SourceControls({
  fileInputRef,
  onFileChange,
}: SourceControlsProps) {
  return (
    <section className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium text-foreground">Source</h2>
        <p className="text-xs leading-5 text-muted-foreground">
          PNG, JPG, WebP, or SVG. Drop also works on the crop square.
        </p>
      </div>

      <Button
        id="favicon-upload"
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="justify-start"
      >
        Select image
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={onFileChange}
        className="hidden"
      />
    </section>
  );
}
