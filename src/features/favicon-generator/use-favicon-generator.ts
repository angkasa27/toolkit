import {
  type ChangeEvent,
  type DragEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_COLOR,
  FAVICON_PACK_IMAGES,
  SUPPORTED_TYPES,
} from "./lib/constants";
import { downloadBlob } from "./lib/download";
import { generateIcoBlob } from "./lib/ico";
import {
  loadImageFile,
  normalizeHexColor,
  renderFaviconPng,
} from "./lib/image";
import { createZipBlob } from "./lib/zip";
import type { BackgroundMode, LoadedImage, Offset } from "./types";

export function useFaviconGenerator() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{
    origin: Offset;
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);

  const [image, setImage] = useState<LoadedImage | null>(null);
  const [editorSize, setEditorSize] = useState(320);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("transparent");
  const [colorInput, setColorInput] = useState(DEFAULT_COLOR);
  const [lastValidColor, setLastValidColor] = useState(DEFAULT_COLOR);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPack, setIsGeneratingPack] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const size = Math.round(entry.contentRect.width);

      if (size > 0) {
        setEditorSize(size);
      }
    });

    observer.observe(editor);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image]);

  useEffect(() => {
    if (!image) {
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return null;
      });
      return;
    }

    let cancelled = false;
    let nextPreviewUrl: string | null = null;

    renderFaviconPng({
      backgroundColor: lastValidColor,
      backgroundMode,
      editorSize,
      image,
      offset,
      size: 32,
      zoom,
    })
      .then((blob) => {
        if (cancelled) {
          return;
        }

        nextPreviewUrl = URL.createObjectURL(blob);
        setPreviewUrl((currentUrl) => {
          if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
          }

          return nextPreviewUrl;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewUrl(null);
        }
      });

    return () => {
      cancelled = true;

      if (nextPreviewUrl) {
        URL.revokeObjectURL(nextPreviewUrl);
      }
    };
  }, [backgroundMode, editorSize, image, lastValidColor, offset, zoom]);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!SUPPORTED_TYPES.has(file.type)) {
      setError("Use a PNG, JPG, WebP, or SVG image.");
      return;
    }

    try {
      const nextImage = await loadImageFile(file);

      setImage((currentImage) => {
        if (currentImage) {
          URL.revokeObjectURL(currentImage.url);
        }

        return nextImage;
      });
      setOffset({ x: 0, y: 0 });
      setZoom(1);
      setError(null);
    } catch {
      setError("Could not read that image.");
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void handleFile(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    void handleFile(event.dataTransfer.files[0]);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!image) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      origin: offset,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setOffset({
      x: drag.origin.x + event.clientX - drag.startX,
      y: drag.origin.y + event.clientY - drag.startY,
    });
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function handleColorInput(value: string) {
    setColorInput(value);

    const validColor = normalizeHexColor(value);

    if (validColor) {
      setLastValidColor(validColor);
    }
  }

  async function handleDownload() {
    if (!image || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const icoBlob = await generateIcoBlob({
        backgroundColor: lastValidColor,
        backgroundMode,
        editorSize,
        image,
        offset,
        zoom,
      });

      downloadBlob(icoBlob, "favicon.ico");
    } catch {
      setError("Could not generate favicon.ico.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownloadPack() {
    if (!image || isGeneratingPack) {
      return;
    }

    setIsGeneratingPack(true);
    setError(null);

    try {
      const icoBlob = await generateIcoBlob({
        backgroundColor: lastValidColor,
        backgroundMode,
        editorSize,
        image,
        offset,
        zoom,
      });
      const pngFiles = await Promise.all(
        FAVICON_PACK_IMAGES.map(async ({ name, size }) => ({
          data: new Uint8Array(
            await (
              await renderFaviconPng({
                backgroundColor: lastValidColor,
                backgroundMode,
                editorSize,
                image,
                offset,
                size,
                zoom,
              })
            ).arrayBuffer(),
          ),
          name,
        })),
      );
      const manifest = {
        icons: [
          {
            sizes: "192x192",
            src: "/icon-192.png",
            type: "image/png",
          },
          {
            sizes: "512x512",
            src: "/icon-512.png",
            type: "image/png",
          },
        ],
        name: "",
        short_name: "",
        theme_color:
          backgroundMode === "color" ? lastValidColor : DEFAULT_COLOR,
      };
      const htmlSnippet = [
        '<link rel="icon" href="/favicon.ico" sizes="any">',
        '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
        '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
        '<link rel="manifest" href="/site.webmanifest">',
        "",
      ].join("\n");
      const encoder = new TextEncoder();
      const zipBlob = createZipBlob([
        {
          data: new Uint8Array(await icoBlob.arrayBuffer()),
          name: "favicon.ico",
        },
        ...pngFiles,
        {
          data: encoder.encode(JSON.stringify(manifest, null, 2)),
          name: "site.webmanifest",
        },
        {
          data: encoder.encode(htmlSnippet),
          name: "html-snippet.txt",
        },
      ]);

      downloadBlob(zipBlob, "favicon-pack.zip");
    } catch {
      setError("Could not generate favicon pack.");
    } finally {
      setIsGeneratingPack(false);
    }
  }

  return {
    backgroundMode,
    colorInput,
    editorRef,
    editorSize,
    error,
    fileInputRef,
    handleColorInput,
    handleDownload,
    handleDownloadPack,
    handleDragOver,
    handleDrop,
    handleInputChange,
    handlePointerDown,
    handlePointerEnd,
    handlePointerMove,
    image,
    isGenerating,
    isGeneratingPack,
    lastValidColor,
    offset,
    previewUrl,
    setBackgroundMode,
    setZoom,
    zoom,
  };
}
