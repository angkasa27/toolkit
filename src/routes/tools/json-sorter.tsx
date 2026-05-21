import { createFileRoute } from "@tanstack/react-router";

import { ToolShell } from "../../ui/tool-shell";

export const Route = createFileRoute("/tools/json-sorter")({
  component: JsonSorterPage,
});

function JsonSorterPage() {
  return (
    <ToolShell
      title="JSON Sorter"
      description="Paste JSON, sort keys recursively, and copy or download formatted output."
    />
  );
}
