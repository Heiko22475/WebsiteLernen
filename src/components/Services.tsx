import type { Content } from '../content'
import Container from './Container'
import SectionTitle from './SectionTitle'

type Props = {
  services: Content['services']
}

export default function Services({ services }: Props) {
  return (
    <section id="leistungen">
      <Container>
        <SectionTitle title={services.title} subtitle={services.subtitle} kicker={services.kicker} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-brand-dark/40 bg-white p-6 shadow-sm transition hover:border-accent/50"
            >
              <h3 className="text-lg font-semibold text-accent">{item.title}</h3>
              <p className="mt-3 text-sm text-accent/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
