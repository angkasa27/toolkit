import { ToolShell } from "@/ui/tool-shell";

import { BackgroundControls } from "./components/background-controls";
import { ExportActions } from "./components/export-actions";
import { FormatControls } from "./components/format-controls";
import { PreviewPanel } from "./components/preview-panel";
import { ResolutionControls } from "./components/resolution-controls";
import { SourcePanel } from "./components/source-panel";
import { useSvgConverter } from "./use-svg-converter";

export function SvgConverterPage() {
  const converter = useSvgConverter();

  return (
    <ToolShell
      title="SVG Converter"
      description="Convert SVG files to PNG or JPG at a custom resolution."
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <PreviewPanel
          backgroundColor={converter.lastValidColor}
          isTransparent={converter.effectiveTransparent}
          onDragOver={converter.handleDragOver}
          onDrop={converter.handleDrop}
          svg={converter.svg}
        />

        <aside aria-label="SVG converter controls">
          <SourcePanel
            fileInputRef={converter.fileInputRef}
            onDragOver={converter.handleDragOver}
            onDrop={converter.handleDrop}
            onFileChange={converter.handleInputChange}
          />
          <FormatControls
            format={converter.format}
            onFormatChange={converter.handleFormatChange}
          />
          <ResolutionControls
            height={converter.height}
            onHeightChange={converter.handleHeightChange}
            onWidthChange={converter.handleWidthChange}
            width={converter.width}
          />
          <BackgroundControls
            canUseTransparent={converter.canUseTransparent}
            colorInput={converter.colorInput}
            isTransparent={converter.effectiveTransparent}
            lastValidColor={converter.lastValidColor}
            onColorInputChange={converter.handleColorInput}
            onTransparentChange={converter.handleTransparentChange}
          />
          <ExportActions
            error={converter.error}
            hasSvg={Boolean(converter.svg)}
            isGenerating={converter.isGenerating}
            onDownload={() => void converter.handleDownload()}
          />
        </aside>
      </div>
    </ToolShell>
  );
}
