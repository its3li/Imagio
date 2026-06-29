import { Link } from 'react-router-dom';
import { guideArticles } from '../data/guideArticles';

export function GuidesPage() {
  return (
    <article className="mx-auto max-w-5xl text-white">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">
        Articles
      </p>
      <h1 className="mt-3 font-syne text-4xl font-bold sm:text-5xl">
        AI image creation guides
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
        These original guides cover prompt writing, format choices, safe creative
        workflows, and practical image planning. They are meant to help visitors
        get better results before they open the generator.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {guideArticles.map((article) => (
          <Link
            key={article.slug}
            to={`/guides/${article.slug}`}
            className="rounded-lg border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-200/50 hover:bg-slate-900/70"
          >
            <p className="text-sm text-cyan-100/75">
              {article.updated} - {article.readTime}
            </p>
            <h2 className="mt-3 font-syne text-2xl font-semibold">{article.title}</h2>
            <p className="mt-3 leading-7 text-white/60">{article.description}</p>
            <span className="mt-5 inline-block text-sm font-semibold text-cyan-200">
              Read guide
            </span>
          </Link>
        ))}
      </section>
    </article>
  );
}
