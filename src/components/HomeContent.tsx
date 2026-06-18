import { Link } from 'react-router-dom';
import { sampleGalleryItems } from '../data/siteContent';

const workflowItems = [
  {
    title: 'Prompt structure',
    body:
      'Imagio works best with prompts that combine a subject, setting, style, lighting, and aspect ratio.',
  },
  {
    title: 'Private gallery',
    body:
      'Generated images can be saved in your browser gallery for quick downloads and prompt reference.',
  },
  {
    title: 'Safety checks',
    body:
      'Prompts pass through server-side filters before image generation so the tool stays safe for general audiences.',
  },
];

export function HomeContent() {
  return (
    <section className="mx-auto mt-16 max-w-6xl space-y-14 text-white">
      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">
            Creative workflow
          </p>
          <h2 className="mt-3 font-syne text-3xl font-bold sm:text-4xl">
            A focused space for turning text ideas into usable artwork
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Imagio is a browser-based AI image generator for concept art,
            thumbnails, mood boards, character ideas, and visual experiments.
            The site keeps the creation flow simple while giving visitors clear
            guidance on prompts, safe use, and image handling.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/prompt-guide"
              className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Read the prompt guide
            </Link>
            <Link
              to="/about"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              About Imagio
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {workflowItems.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-white/10 bg-slate-950/40 p-4"
            >
              <h3 className="font-syne text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">
              Prompt examples
            </p>
            <h2 className="mt-2 font-syne text-3xl font-bold">Starter ideas with reusable patterns</h2>
          </div>
          <Link to="/gallery" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">
            Browse gallery inspiration
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {sampleGalleryItems.slice(0, 3).map((item) => (
            <article key={item.title} className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/40">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-syne text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.notes}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
