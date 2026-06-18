const sections = [
  {
    title: 'Information you provide',
    body:
      'When you generate an image, the prompt text and selected settings are sent to the Imagio generation endpoint so the image request can be processed. Do not enter private, sensitive, or confidential information into prompts.',
  },
  {
    title: 'Browser storage',
    body:
      'Imagio can store generated image entries, prompt history, and gallery preferences in your browser localStorage. This data stays on your device unless you clear your browser data or use browser tools to remove it.',
  },
  {
    title: 'Service providers',
    body:
      'The site may use hosting, analytics, image generation, security, and advertising providers to operate the service, understand aggregate usage, protect the app, and support monetization.',
  },
  {
    title: 'Google advertising cookies',
    body:
      'Third-party vendors, including Google, may use cookies to serve ads based on your prior visits to this website or other websites. Google advertising cookies allow Google and its partners to serve personalized or non-personalized ads.',
  },
  {
    title: 'Your choices',
    body:
      'You can clear local browser data, use private browsing, block cookies in your browser, or manage personalized advertising through Google Ads Settings and other industry opt-out tools where available.',
  },
];

export function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl text-white">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">
        Privacy
      </p>
      <h1 className="mt-3 font-syne text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-white/50">Effective date: June 18, 2026</p>
      <p className="mt-5 text-lg leading-8 text-white/70">
        This policy explains how Imagio AI handles information when you use the
        website. It is written for a lightweight browser-based creative tool,
        not for an account-based service.
      </p>

      <section className="mt-10 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-white/10 bg-slate-950/40 p-5">
            <h2 className="font-syne text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 leading-7 text-white/60">{section.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-lg border border-white/10 bg-slate-950/40 p-5">
        <h2 className="font-syne text-2xl font-semibold">Helpful privacy links</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <a className="text-cyan-200 hover:text-cyan-100" href="https://adssettings.google.com/" target="_blank" rel="noreferrer">
            Google Ads Settings
          </a>
          <a className="text-cyan-200 hover:text-cyan-100" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            Google Privacy Policy
          </a>
          <a className="text-cyan-200 hover:text-cyan-100" href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">
            AboutAds choices
          </a>
        </div>
      </section>
    </article>
  );
}
