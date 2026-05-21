import { createFileRoute } from "@tanstack/react-router";

import { ToolShell } from "../../ui/tool-shell";

export const Route = createFileRoute("/tools/image-compressor")({
  component: ImageCompressorPage,
});

function ImageCompressorPage() {
  return (
    <ToolShell
      title="Image Compress"
      description="Compress images locally using browser APIs without uploading files."
    />
  );
}
