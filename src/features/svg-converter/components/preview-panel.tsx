import type { DragEvent } from "react";

import { cn } from "@/lib/utils";

import type { LoadedSvg } from "../types";

type PreviewPanelProps = {
  backgroundColor: string;
  isTransparent: boolean;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  svg: LoadedSvg | null;
};

export function PreviewPanel({
  backgroundColor,
  isTransparent,
  onDragOver,
  onDrop,
  svg,
}: PreviewPanelProps) {
  const previewAspectRatio = svg
    ? `${svg.dimensions.width} / ${svg.dimensions.height}`
    : "1 / 1";

  return (
    <section className="flex min-h-[430px] flex-col gap-5 border-b border-border p-4 lg:border-r lg:border-b-0 lg:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-foreground">Preview</h2>
          <p className="text-xs leading-5 text-muted-foreground">
            Drop a new SVG here or use the source control.
          </p>
        </div>
        {svg ? (
          <p className="max-w-44 truncate text-xs text-muted-foreground">
            {svg.fileName} · {Math.round(svg.dimensions.width)}×
            {Math.round(svg.dimensions.height)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div
          aria-label="SVG preview drop area"
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={cn(
            "flex max-h-[420px] w-full max-w-[520px] items-center justify-center overflow-hidden border border-border",
            isTransparent && "checkerboard",
            !svg && "rounded-lg",
          )}
          style={{
            aspectRatio: previewAspectRatio,
            ...(!isTransparent ? { backgroundColor } : undefined),
          }}
        >
          {svg ? (
            <img
              src={svg.url}
              alt=""
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          ) : (
            <p className="px-6 text-center text-sm leading-6 text-muted-foreground">
              Drop SVG here
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
