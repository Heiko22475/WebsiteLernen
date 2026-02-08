import type { Content } from '../content'
import Container from './Container'

type Props = {
  site: Content['site']
  hero: Content['hero']
}

export default function Hero({ site, hero }: Props) {
  return (
    <section id="hero" className="pt-16">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/60">
            {hero.kicker}
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-accent md:text-5xl lg:text-6xl">
            <span className="text-accent">{site.name}</span>
          </h1>
          <p className="mt-4 text-xl text-accent/80 md:text-2xl">{hero.claim}</p>
          <div className="mt-6 h-1 w-16 rounded-full bg-brand" />
          <p className="mt-4 max-w-xl text-base text-accent/70">{hero.subheading}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={site.phoneHref}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark"
            >
              {hero.ctas.callLabel}
            </a>
            <a
              href="#kontakt"
              className="rounded-full border border-accent/30 px-6 py-3 text-sm font-semibold text-accent transition hover:border-accent hover:text-accent"
            >
              {hero.ctas.bookingLabel}
            </a>
            <a
              href={hero.routeUrl}
              className="rounded-full border border-accent/30 px-6 py-3 text-sm font-semibold text-accent transition hover:border-accent hover:text-accent"
            >
              {hero.ctas.routeLabel}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-accent/60">
            <span>{site.address}</span>
            <a href={site.phoneHref} className="font-semibold text-accent">
              {site.phone}
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-brand-dark/40 shadow-soft">
            {hero.imageUrl ? (
              <img
                src={hero.imageUrl}
                alt={hero.imageAlt || site.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-white" />
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-accent/20 bg-accent px-6 py-4 text-brand-soft shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              {hero.hoursKicker}
            </p>
            <p className="mt-2 text-lg font-semibold">{hero.hoursNote}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
