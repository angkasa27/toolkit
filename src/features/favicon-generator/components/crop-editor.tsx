import type { DragEvent, PointerEvent, RefObject } from "react";

import { cn } from "@/lib/utils";

import { getImageTransform } from "../lib/image";
import type { BackgroundMode, LoadedImage, Offset } from "../types";

type CropEditorProps = {
  backgroundColor: string;
  backgroundMode: BackgroundMode;
  editorRef: RefObject<HTMLDivElement | null>;
  editorSize: number;
  image: LoadedImage | null;
  offset: Offset;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerEnd: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  zoom: number;
};

export function CropEditor({
  backgroundColor,
  backgroundMode,
  editorRef,
  editorSize,
  image,
  offset,
  onDragOver,
  onDrop,
  onPointerDown,
  onPointerEnd,
  onPointerMove,
  zoom,
}: CropEditorProps) {
  const transform = image
    ? getImageTransform(image, editorSize, zoom, offset)
    : null;

  return (
    <div className="flex min-h-[min(64vw,430px)] flex-col gap-5 border-b border-border p-4 lg:border-r lg:border-b-0 lg:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-foreground">Crop</h2>
          <p className="text-xs leading-5 text-muted-foreground">
            Drag inside the square to reposition. Drop a new image on the editor
            anytime.
          </p>
        </div>
        {image ? (
          <p className="max-w-44 truncate text-xs text-muted-foreground">
            {image.name} · {image.width}×{image.height}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div
          ref={editorRef}
          aria-label="Favicon crop editor. Drag to move image or drop a new image."
          onDragOver={onDragOver}
          onDrop={onDrop}
          onPointerCancel={onPointerEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          className={cn(
            "relative aspect-square w-full max-w-[380px] touch-none overflow-hidden rounded-lg border border-border shadow-inner",
            image ? "cursor-grab active:cursor-grabbing" : "cursor-default",
            backgroundMode === "transparent" && "checkerboard",
          )}
          style={backgroundMode === "color" ? { backgroundColor } : undefined}
        >
          {image && transform ? (
            <img
              src={image.url}
              alt=""
              draggable={false}
              className="pointer-events-none absolute max-w-none select-none"
              style={{
                height: transform.height,
                left: transform.x,
                top: transform.y,
                width: transform.width,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-muted-foreground">
              Drop image here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
