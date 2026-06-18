const values = [
  {
    title: 'Useful before monetization',
    body:
      'The site is built as a real creative tool first: prompt input, image generation, downloads, sharing, and a personal browser gallery.',
  },
  {
    title: 'Original supporting content',
    body:
      'Prompt guidance, examples, and policy pages explain how the tool works and help visitors get better results without guesswork.',
  },
  {
    title: 'General-audience safety',
    body:
      'Explicit prompts are blocked by backend checks before the image API is called, and safe mode is always sent with generation requests.',
  },
];

export function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl text-white">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">About</p>
      <h1 className="mt-3 font-syne text-4xl font-bold sm:text-5xl">About Imagio AI</h1>
      <p className="mt-5 text-lg leading-8 text-white/70">
        Imagio AI is an independent image-generation tool created by Ali Sayed.
        It helps visitors turn text prompts into downloadable artwork for
        concept sketches, social posts, mood boards, thumbnails, and visual
        exploration.
      </p>
      <p className="mt-4 text-base leading-7 text-white/60">
        The project focuses on a simple creative loop: write a prompt, choose an
        aspect ratio, generate safe-for-work images, and save useful results in
        the browser. Supporting pages on the site explain prompt writing,
        privacy, acceptable use, and contact options so the experience is clear
        for both visitors and reviewers.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-lg border border-white/10 bg-slate-950/40 p-5">
            <h2 className="font-syne text-xl font-semibold">{value.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{value.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-white/10 bg-slate-950/40 p-6">
        <h2 className="font-syne text-2xl font-semibold">Editorial focus</h2>
        <p className="mt-3 leading-7 text-white/60">
          Imagio publishes practical AI image prompt examples and guidance for
          people who want more predictable creative results. The content is
          centered on visual composition, prompt clarity, safe creative use, and
          responsible handling of generated images.
        </p>
      </section>
    </article>
  );
}
