import type { Content } from '../content'
import Container from './Container'
import SectionTitle from './SectionTitle'

type Props = {
  faq: Content['faq']
}

export default function Faq({ faq }: Props) {
  return (
    <section id="faq" className="bg-brand-soft py-16">
      <Container>
        <SectionTitle title={faq.title} subtitle={faq.subtitle} kicker={faq.kicker} />
        <div className="mt-10 space-y-4">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="rounded-2xl border border-brand-dark/40 bg-white px-6 py-4 shadow-sm"
            >
              <summary className="cursor-pointer text-base font-semibold text-accent">
                {item.question}
              </summary>
              <p className="mt-3 text-sm text-accent/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
