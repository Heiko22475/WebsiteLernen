import type { Content } from '../content'
import Container from './Container'

type Props = {
  site: Content['site']
  nav: Content['nav']
  header: Content['header']
}

export default function Header({ site, nav, header }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-dark/40 bg-brand-soft/90 backdrop-blur">
      <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/60">
            {site.category}
          </p>
          <p className="mt-1 text-xl font-semibold text-accent">{site.name}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <nav className="flex flex-wrap justify-end gap-2">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent/70 transition hover:border-accent hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={site.phoneHref}
            className="rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-soft shadow-sm transition hover:bg-accent-dark"
          >
            {header.callLabel}
          </a>
        </div>
      </Container>
    </header>
  )
}
