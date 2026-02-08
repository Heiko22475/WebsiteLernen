import type { Content } from '../content'
import Container from './Container'
import SectionTitle from './SectionTitle'

type Props = {
  gallery: Content['gallery']
}

export default function Gallery({ gallery }: Props) {
  return (
    <section id="galerie">
      <Container>
        <SectionTitle title={gallery.title} subtitle={gallery.subtitle} kicker={gallery.kicker} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-brand-dark/40 bg-brand-soft"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || item.label}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/60">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-accent/60">{gallery.note}</p>
      </Container>
    </section>
  )
}
