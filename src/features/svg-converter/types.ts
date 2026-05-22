export type OutputFormat = "png" | "jpg";

export type SvgDimensions = {
  height: number;
  width: number;
};

export type LoadedSvg = {
  dimensions: SvgDimensions;
  fileName: string;
  text: string;
  url: string;
};
