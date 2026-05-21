import { BrowserTabPreview } from "./components/browser-tab-preview";
import { CropEditor } from "./components/crop-editor";
import { EditControls } from "./components/edit-controls";
import { ExportActions } from "./components/export-actions";
import { SourceControls } from "./components/source-controls";
import { useFaviconGenerator } from "./use-favicon-generator";
import { ToolShell } from "@/ui/tool-shell";

export function FaviconGeneratorPage() {
  const favicon = useFaviconGenerator();

  return (
    <ToolShell
      title="Image to Favicon"
      description="Drop an image, position it in the square, then export the favicon files."
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <CropEditor
          backgroundColor={favicon.lastValidColor}
          backgroundMode={favicon.backgroundMode}
          editorRef={favicon.editorRef}
          editorSize={favicon.editorSize}
          image={favicon.image}
          offset={favicon.offset}
          onDragOver={favicon.handleDragOver}
          onDrop={favicon.handleDrop}
          onPointerDown={favicon.handlePointerDown}
          onPointerEnd={favicon.handlePointerEnd}
          onPointerMove={favicon.handlePointerMove}
          zoom={favicon.zoom}
        />

        <aside aria-label="Favicon controls">
          <SourceControls
            fileInputRef={favicon.fileInputRef}
            onFileChange={favicon.handleInputChange}
          />
          <EditControls
            backgroundMode={favicon.backgroundMode}
            colorInput={favicon.colorInput}
            error={favicon.error}
            hasImage={Boolean(favicon.image)}
            lastValidColor={favicon.lastValidColor}
            onBackgroundModeChange={favicon.setBackgroundMode}
            onColorInputChange={favicon.handleColorInput}
            onZoomChange={favicon.setZoom}
            zoom={favicon.zoom}
          />
          <BrowserTabPreview previewUrl={favicon.previewUrl} />
          <ExportActions
            hasImage={Boolean(favicon.image)}
            isGenerating={favicon.isGenerating}
            isGeneratingPack={favicon.isGeneratingPack}
            onDownload={() => void favicon.handleDownload()}
            onDownloadPack={() => void favicon.handleDownloadPack()}
          />
        </aside>
      </div>
    </ToolShell>
  );
}
