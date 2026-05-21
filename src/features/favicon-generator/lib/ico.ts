import { FAVICON_SIZES } from "./constants";
import { renderFaviconPng } from "./image";
import type { BackgroundMode, LoadedImage, Offset } from "../types";

export async function generateIcoBlob({
  backgroundColor,
  backgroundMode,
  editorSize,
  image,
  offset,
  zoom,
}: {
  backgroundColor: string;
  backgroundMode: BackgroundMode;
  editorSize: number;
  image: LoadedImage;
  offset: Offset;
  zoom: number;
}) {
  const pngFrames = await Promise.all(
    FAVICON_SIZES.map(async (size) => ({
      data: new Uint8Array(
        await (
          await renderFaviconPng({
            backgroundColor,
            backgroundMode,
            editorSize,
            image,
            offset,
            size,
            zoom,
          })
        ).arrayBuffer(),
      ),
      size,
    })),
  );

  return createIcoBlob(pngFrames);
}

export function createIcoBlob(
  frames: Array<{
    data: Uint8Array;
    size: number;
  }>,
) {
  const directorySize = 6 + frames.length * 16;
  const imageDataSize = frames.reduce(
    (total, frame) => total + frame.data.length,
    0,
  );
  const buffer = new ArrayBuffer(directorySize + imageDataSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, frames.length, true);

  let imageOffset = directorySize;

  frames.forEach((frame, index) => {
    const entryOffset = 6 + index * 16;

    view.setUint8(entryOffset, frame.size === 256 ? 0 : frame.size);
    view.setUint8(entryOffset + 1, frame.size === 256 ? 0 : frame.size);
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, frame.data.length, true);
    view.setUint32(entryOffset + 12, imageOffset, true);
    bytes.set(frame.data, imageOffset);
    imageOffset += frame.data.length;
  });

  return new Blob([buffer], { type: "image/x-icon" });
}
