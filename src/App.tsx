import { content } from './content'
import About from './components/About'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Header from './components/Header'
import Hero from './components/Hero'
import Prices from './components/Prices'
import Services from './components/Services'

function App() {
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

export default App
