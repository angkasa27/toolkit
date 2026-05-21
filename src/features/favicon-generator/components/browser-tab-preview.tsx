type BrowserTabPreviewProps = {
  previewUrl: string | null;
};

export function BrowserTabPreview({ previewUrl }: BrowserTabPreviewProps) {
  return (
    <section className="flex flex-col gap-3 border-t border-border pt-4 pl-4">
      <h2 className="text-sm font-medium text-foreground">Preview</h2>
      <div className="overflow-hidden rounded-tl-md border-l border-t border-border bg-background">
        <div className="flex max-w-64 items-center gap-2 rounded-tr-md bg-primary/10 px-3 py-2">
          <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-xs">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="size-4"
                width={16}
                height={16}
              />
            ) : (
              <span className="size-4 rounded-sm bg-secondary" />
            )}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            My website
          </span>
        </div>
        <div className="h-6 border-t border-border bg-background" />
      </div>
    </section>
  );
}
