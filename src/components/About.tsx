import type { Content } from '../content'
import Container from './Container'
import SectionTitle from './SectionTitle'

type Props = {
  about: Content['about']
  qualities: Content['qualities']
}

const icons = {
  spark: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2l2.4 5.4L20 9l-5.6 1.8L12 16l-2.4-5.2L4 9l5.6-1.6L12 2z" />
    </svg>
  ),
  precision: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    </svg>
  ),
  comfort: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 11c0-3.9 3.1-7 7-7h2c3.9 0 7 3.1 7 7v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5z" />
      <path d="M8 12h8" />
    </svg>
  ),
}

export default function About({ about, qualities }: Props) {
  return (
    <section id="ueber-uns" className="bg-brand-soft py-16">
      <Container>
        <SectionTitle title={about.title} subtitle={about.subtitle} kicker={about.kicker} />
        <p className="mt-6 max-w-2xl text-base text-accent/70">{about.text}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {qualities.map((item) => (
            <div key={item.title} className="rounded-2xl border border-brand-dark/40 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-accent">
                {icons[item.icon] ?? icons.spark}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-accent">{item.title}</h3>
              <p className="mt-2 text-sm text-accent/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
