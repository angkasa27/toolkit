import { createFileRoute } from "@tanstack/react-router";

import { SvgConverterPage } from "../../features/svg-converter/svg-converter-page";

export const Route = createFileRoute("/tools/svg-converter")({
  component: SvgConverterPage,
});
