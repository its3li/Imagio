import { Link, Navigate, useParams } from 'react-router-dom';
import { getGuideArticle, guideArticles } from '../data/guideArticles';

export function GuideArticlePage() {
  const { slug } = useParams();
  const article = getGuideArticle(slug);

  if (!article) {
    return <Navigate to="/guides" replace />;
  }

  const relatedArticles = guideArticles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl text-white">
      <Link to="/guides" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">
        Back to guides
      </Link>
      <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">
        AI Image Guide
      </p>
      <h1 className="mt-3 font-syne text-4xl font-bold leading-tight sm:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-sm text-white/50">
        Updated {article.updated} - {article.readTime}
      </p>
      <p className="mt-6 text-lg leading-8 text-white/70">{article.description}</p>

      <div className="mt-10 space-y-10">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-syne text-3xl font-semibold">{section.heading}</h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-white/60">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-12 rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-6">
        <h2 className="font-syne text-2xl font-semibold">Try the idea in Imagio</h2>
        <p className="mt-3 leading-7 text-white/70">
          After reading, open the generator and test one small prompt change at a
          time. Keep the version that gives the clearest subject, strongest
          composition, and safest result for your audience.
        </p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Open generator
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="font-syne text-2xl font-semibold">More guides</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {relatedArticles.map((item) => (
            <Link
              key={item.slug}
              to={`/guides/${item.slug}`}
              className="rounded-lg border border-white/10 bg-slate-950/40 p-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
