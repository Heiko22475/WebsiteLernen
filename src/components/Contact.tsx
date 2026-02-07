import type { Content } from '../content'
import Container from './Container'
import SectionTitle from './SectionTitle'

type Props = {
  site: Content['site']
  contact: Content['contact']
}

export default function Contact({ site, contact }: Props) {
  const hasWhatsapp = Boolean(contact.socials.whatsapp)

  return (
    <section id="kontakt">
      <Container>
        <SectionTitle title={contact.title} subtitle={contact.subtitle} kicker={contact.kicker} />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-brand-dark/40 bg-white p-6 shadow-sm">
            <div className="space-y-4 text-sm text-accent/70">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/60">
                  {contact.labels.address}
                </p>
                <p className="mt-2 text-base font-semibold text-accent">{site.address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/60">
                  {contact.labels.phone}
                </p>
                <a href={site.phoneHref} className="mt-2 inline-flex text-base font-semibold text-accent">
                  {site.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/60">
                  {contact.labels.hours}
                </p>
                <p className="mt-2 text-base text-accent/70">{contact.openingHoursNote}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={contact.routeUrl}
                className="rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wide text-brand-soft shadow-sm transition hover:bg-accent-dark"
              >
                {contact.actions.routeLabel}
              </a>
              <a
                href={contact.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-accent/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-accent/70 transition hover:border-accent hover:text-accent"
              >
                {contact.socialLabels.instagram}
              </a>
              <a
                href={contact.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-accent/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-accent/70 transition hover:border-accent hover:text-accent"
              >
                {contact.socialLabels.facebook}
              </a>
              {hasWhatsapp ? (
                <a
                  href={contact.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-accent/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-accent/70 transition hover:border-accent hover:text-accent"
                >
                  {contact.socialLabels.whatsapp}
                </a>
              ) : (
                <span className="rounded-full border border-dashed border-accent/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-accent/60">
                  {contact.socialLabels.whatsappPlaceholder}
                </span>
              )}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-brand-dark/40 bg-brand-soft shadow-sm">
            <iframe
              title="Google Maps"
              src={contact.mapEmbedUrl}
              loading="lazy"
              className="h-full min-h-[320px] w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
