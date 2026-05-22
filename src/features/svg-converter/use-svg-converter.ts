import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { DEFAULT_BACKGROUND_COLOR, normalizeHexColor } from "./lib/color";
import { downloadBlob } from "./lib/download";
import {
  clampDimension,
  getAspectRatio,
  getDownloadName,
  getHeightFromWidth,
  getWidthFromHeight,
  loadSvgFile,
  renderSvgToBlob,
} from "./lib/svg";
import type { LoadedSvg, OutputFormat } from "./types";

export function useSvgConverter() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [svg, setSvg] = useState<LoadedSvg | null>(null);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [transparent, setTransparent] = useState(true);
  const [colorInput, setColorInput] = useState(DEFAULT_BACKGROUND_COLOR);
  const [lastValidColor, setLastValidColor] = useState(
    DEFAULT_BACKGROUND_COLOR,
  );
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const ratio = svg ? getAspectRatio(svg.dimensions) : 1;
  const canUseTransparent = format === "png";
  const effectiveTransparent = canUseTransparent && transparent;

  useEffect(() => {
    return () => {
      if (svg) {
        URL.revokeObjectURL(svg.url);
      }
    };
  }, [svg]);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const nextSvg = await loadSvgFile(file);

      setSvg((currentSvg) => {
        if (currentSvg) {
          URL.revokeObjectURL(currentSvg.url);
        }

        return nextSvg;
      });
      setWidth(clampDimension(nextSvg.dimensions.width));
      setHeight(clampDimension(nextSvg.dimensions.height));
      setError(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not read that SVG.",
      );
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

  function handleFormatChange(nextFormat: OutputFormat) {
    setFormat(nextFormat);

    if (nextFormat === "jpg") {
      setTransparent(false);
    }
  }

  function handleWidthChange(value: string) {
    const nextWidth = clampDimension(Number(value));

    setWidth(nextWidth);
    setHeight(getHeightFromWidth(nextWidth, ratio));
  }

  function handleHeightChange(value: string) {
    const nextHeight = clampDimension(Number(value));

    setHeight(nextHeight);
    setWidth(getWidthFromHeight(nextHeight, ratio));
  }

  function handleTransparentChange(nextTransparent: boolean) {
    if (!canUseTransparent) {
      return;
    }

    setTransparent(nextTransparent);
  }

  function handleColorInput(value: string) {
    setColorInput(value);

    const validColor = normalizeHexColor(value);

    if (validColor) {
      setLastValidColor(validColor);
    }
  }

  async function handleDownload() {
    if (!svg || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const blob = await renderSvgToBlob({
        backgroundColor: lastValidColor,
        format,
        height,
        svgText: svg.text,
        transparent: effectiveTransparent,
        width,
      });

      downloadBlob(blob, getDownloadName(svg.fileName, format));
    } catch {
      setError("Could not export that SVG.");
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    canUseTransparent,
    colorInput,
    effectiveTransparent,
    error,
    fileInputRef,
    format,
    handleColorInput,
    handleDownload,
    handleDragOver,
    handleDrop,
    handleFormatChange,
    handleHeightChange,
    handleInputChange,
    handleTransparentChange,
    handleWidthChange,
    height,
    isGenerating,
    lastValidColor,
    svg,
    transparent,
    width,
  };
}
