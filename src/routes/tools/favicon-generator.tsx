import { createFileRoute } from "@tanstack/react-router";

import { FaviconGeneratorPage } from "../../features/favicon-generator/favicon-generator-page";

export const Route = createFileRoute("/tools/favicon-generator")({
  component: FaviconGeneratorPage,
});
