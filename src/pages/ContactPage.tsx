import { ExternalLink, Github } from 'lucide-react';

export function ContactPage() {
  return (
    <article className="mx-auto max-w-4xl text-white">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">Contact</p>
      <h1 className="mt-3 font-syne text-4xl font-bold sm:text-5xl">Contact and support</h1>
      <p className="mt-5 text-lg leading-8 text-white/70">
        For bug reports, support questions, or improvement ideas, use the public
        GitHub repository. This keeps issues visible and makes it easier to
        track fixes.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <a
          href="https://github.com/its3li/Imagio/issues"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-200/50 hover:bg-slate-900/70"
        >
          <Github className="h-6 w-6 text-cyan-200" />
          <h2 className="mt-4 font-syne text-2xl font-semibold">Open an issue</h2>
          <p className="mt-3 leading-7 text-white/60">
            Report bugs, broken pages, generation errors, or policy concerns.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
            GitHub issues <ExternalLink className="h-4 w-4" />
          </span>
        </a>

        <a
          href="https://github.com/its3li/Imagio"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-200/50 hover:bg-slate-900/70"
        >
          <Github className="h-6 w-6 text-cyan-200" />
          <h2 className="mt-4 font-syne text-2xl font-semibold">View source</h2>
          <p className="mt-3 leading-7 text-white/60">
            Review the codebase, deployment files, and safety-related changes.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
            Repository <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      </section>
    </article>
  );
}
