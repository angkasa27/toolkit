import { Button } from "@/components/ui/button";

type ExportActionsProps = {
  hasImage: boolean;
  isGenerating: boolean;
  isGeneratingPack: boolean;
  onDownload: () => void;
  onDownloadPack: () => void;
};

export function ExportActions({
  hasImage,
  isGenerating,
  isGeneratingPack,
  onDownload,
  onDownloadPack,
}: ExportActionsProps) {
  return (
    <section className="flex flex-col gap-2 border-t border-border p-4">
      <Button
        type="button"
        disabled={!hasImage || isGenerating}
        onClick={onDownload}
      >
        {isGenerating ? "Generating..." : "Download favicon.ico"}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={!hasImage || isGeneratingPack}
        onClick={onDownloadPack}
      >
        {isGeneratingPack ? "Generating..." : "Download favicon pack"}
      </Button>

      <p className="text-xs leading-5 text-muted-foreground">
        ICO includes 16, 32, and 48px. Pack adds Apple and PWA icons.
      </p>
    </section>
  );
}
