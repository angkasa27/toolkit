import { Button } from "@/components/ui/button";

type ExportActionsProps = {
  error: string | null;
  hasSvg: boolean;
  isGenerating: boolean;
  onDownload: () => void;
};

export function ExportActions({
  error,
  hasSvg,
  isGenerating,
  onDownload,
}: ExportActionsProps) {
  return (
    <section className="flex flex-col gap-3 border-t border-border p-4">
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        disabled={!hasSvg || isGenerating}
        onClick={onDownload}
      >
        {isGenerating ? "Exporting..." : "Download image"}
      </Button>
    </section>
  );
}
