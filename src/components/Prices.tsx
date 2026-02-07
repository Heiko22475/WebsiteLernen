import type { Content } from '../content'
import Container from './Container'
import SectionTitle from './SectionTitle'

type Props = {
  prices: Content['prices']
}

export default function Prices({ prices }: Props) {
  return (
    <section id="preise" className="bg-brand-soft py-16">
      <Container>
        <SectionTitle title={prices.title} subtitle={prices.subtitle} kicker={prices.kicker} />
        <div className="mt-10 overflow-hidden rounded-2xl border border-brand-dark/40 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand text-xs uppercase tracking-wider text-accent">
              <tr>
                <th className="px-6 py-4">{prices.tableHeaders.service}</th>
                <th className="px-6 py-4">{prices.tableHeaders.price}</th>
              </tr>
            </thead>
            <tbody>
              {prices.items.map((item) => (
                <tr key={item.service} className="border-t border-brand-dark/40">
                  <td className="px-6 py-4 font-medium text-accent">{item.service}</td>
                  <td className="px-6 py-4 text-accent/70">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-accent/60">{prices.note}</p>
      </Container>
    </section>
  )
}
