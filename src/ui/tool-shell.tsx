import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { ThemeToggle } from "../components/theme-toggle";

type ToolShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export function ToolShell({ children, title, description }: ToolShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6 text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          to="/"
          aria-label="Back to tools"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus:outline-none focus-visible:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center py-5">
        <section className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl leading-7 font-normal text-foreground">
                {title}
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          {children}
        </section>
      </main>

      <footer className="text-center text-sm text-muted-foreground">
        Toolkit runs client-side in your browser.
      </footer>
    </div>
  );
}
