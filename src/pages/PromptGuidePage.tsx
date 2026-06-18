import { sampleGalleryItems, guideSections } from '../data/siteContent';

export function PromptGuidePage() {
  return (
    <article className="mx-auto max-w-5xl text-white">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">
        Guide
      </p>
      <h1 className="mt-3 font-syne text-4xl font-bold sm:text-5xl">
        AI image prompt guide
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
        Better image prompts usually describe the subject, setting, material,
        lighting, style, and camera frame. This guide gives Imagio visitors a
        reliable pattern for writing prompts that are detailed without becoming
        messy.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {guideSections.map((section) => (
          <div key={section.title} className="rounded-lg border border-white/10 bg-slate-950/40 p-5">
            <h2 className="font-syne text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{section.body}</p>
            <p className="mt-4 rounded-lg bg-white/10 p-3 text-sm leading-6 text-cyan-50/90">
              {section.example}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-syne text-3xl font-bold">Reusable prompt examples</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {sampleGalleryItems.map((item) => (
            <article key={item.title} className="rounded-lg border border-white/10 bg-slate-950/40 p-5">
              <h3 className="font-syne text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.notes}</p>
              <p className="mt-4 rounded-lg bg-black/25 p-3 text-sm leading-6 text-white/80">
                {item.prompt}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-6">
        <h2 className="font-syne text-2xl font-semibold">A simple prompt formula</h2>
        <p className="mt-3 leading-7 text-white/70">
          Use this order when you feel stuck: subject, setting, action, visual
          style, lighting, camera or composition, and final quality words. For
          example: "A ceramic fox reading under a desk lamp, cozy study, warm
          light, close-up product photography, soft shadows, detailed texture."
        </p>
      </section>
    </article>
  );
}
