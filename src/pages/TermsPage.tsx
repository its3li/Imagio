const terms = [
  {
    title: 'Acceptable use',
    body:
      'Use Imagio for lawful, safe-for-work creative projects. Do not request explicit sexual content, hateful content, harassment, illegal activity, or content that invades privacy.',
  },
  {
    title: 'Generated output',
    body:
      'AI-generated images can be unpredictable. You are responsible for reviewing outputs before publishing, sharing, or using them in a project.',
  },
  {
    title: 'Intellectual property',
    body:
      "Do not use prompts that intentionally copy protected characters, brands, private people, or artwork in a way that violates someone else's rights.",
  },
  {
    title: 'Availability',
    body:
      'The site depends on hosting and generation providers. Image creation may be delayed, unavailable, or changed without notice.',
  },
];

export function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl text-white">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">Terms</p>
      <h1 className="mt-3 font-syne text-4xl font-bold sm:text-5xl">Terms of Use</h1>
      <p className="mt-4 text-sm text-white/50">Effective date: June 18, 2026</p>
      <p className="mt-5 text-lg leading-8 text-white/70">
        These terms set the basic rules for using Imagio AI. By using the site,
        you agree to use the tool responsibly and to review generated content
        before relying on it.
      </p>

      <section className="mt-10 space-y-4">
        {terms.map((term) => (
          <div key={term.title} className="rounded-lg border border-white/10 bg-slate-950/40 p-5">
            <h2 className="font-syne text-2xl font-semibold">{term.title}</h2>
            <p className="mt-3 leading-7 text-white/60">{term.body}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
