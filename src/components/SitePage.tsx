import type { Content } from '../content'
import About from './About'
import Contact from './Contact'
import Faq from './Faq'
import Footer from './Footer'
import Gallery from './Gallery'
import Header from './Header'
import Hero from './Hero'
import Prices from './Prices'
import Services from './Services'

type Props = {
  content: Content
}

export default function SitePage({ content }: Props) {
  return (
    <div className="bg-brand-soft text-accent">
      <Header site={content.site} nav={content.nav} header={content.header} />
      <main className="space-y-24 pb-24">
        <Hero site={content.site} hero={content.hero} />
        <Services services={content.services} />
        <Prices prices={content.prices} />
        <Gallery gallery={content.gallery} />
        <About about={content.about} qualities={content.qualities} />
        <Contact site={content.site} contact={content.contact} />
        <Faq faq={content.faq} />
      </main>
      <Footer site={content.site} footer={content.footer} />
    </div>
  )
}
