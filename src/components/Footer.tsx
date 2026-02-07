import type { Content } from '../content'
import Container from './Container'

type Props = {
  site: Content['site']
  footer: Content['footer']
}

export default function Footer({ site, footer }: Props) {
  return (
    <footer className="border-t border-brand-dark/40 bg-white py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent">{site.name}</p>
          <p className="mt-2 text-xs text-accent/70">{site.address}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wide text-accent/70">
          {footer.legal.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-accent">
              {item.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-accent/60">{footer.note}</p>
      </Container>
    </footer>
  )
}
