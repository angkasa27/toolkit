import { Link, createFileRoute } from "@tanstack/react-router";

import { ThemeToggle } from "../components/theme-toggle";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const tools = [
  {
    to: "/tools/favicon-generator",
    name: "Image to Favicon",
  },
  {
    to: "/tools/svg-converter",
    name: "SVG Converter",
  },
  // {
  //   to: "/tools/json-sorter",
  //   name: "JSON Sorter",
  // },
  // {
  //   to: "/tools/image-compressor",
  //   name: "Image Compress",
  // },
] as const;

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-6 text-foreground">
      <header className="mx-auto flex w-full max-w-xl justify-end">
        <ThemeToggle />
      </header>

      <section className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-base leading-7 font-normal text-foreground">
            Small browser tools for images, JSON, and web assets.
          </h1>

          <nav
            aria-label="Available tools"
            className="mt-5 flex flex-col gap-1.5"
          >
            {tools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="block text-base leading-6 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus:outline-none focus-visible:underline"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <footer className="text-center text-sm text-muted-foreground">
        Files stay in your browser.
      </footer>
    </main>
  );
}
