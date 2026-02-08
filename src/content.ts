export type Theme = {
  colors: {
    brand: string
    brandDark: string
    brandSoft: string
    accent: string
    accentDark: string
    accentSoft: string
  }
}

export type Content = {
  site: {
    name: string
    category: string
    address: string
    phone: string
    phoneHref: string
  }
  nav: { label: string; href: string }[]
  header: { callLabel: string }
  hero: {
    kicker: string
    claim: string
    subheading: string
    routeUrl: string
    hoursKicker: string
    hoursNote: string
    imageUrl?: string
    imageAlt?: string
    ctas: {
      callLabel: string
      routeLabel: string
      bookingLabel: string
    }
  }
  services: {
    kicker: string
    title: string
    subtitle: string
    items: { title: string; description: string }[]
  }
  prices: {
    kicker: string
    title: string
    subtitle: string
    tableHeaders: { service: string; price: string }
    items: { service: string; price: string }[]
    note: string
  }
  gallery: {
    kicker: string
    title: string
    subtitle: string
    items: { label: string; imageUrl?: string; imageAlt?: string }[]
    note: string
  }
  about: {
    kicker: string
    title: string
    subtitle: string
    text: string
  }
  qualities: {
    title: string
    description: string
    icon: 'spark' | 'precision' | 'comfort'
  }[]
  contact: {
    kicker: string
    title: string
    subtitle: string
    openingHoursNote: string
    routeUrl: string
    mapEmbedUrl: string
    labels: { address: string; phone: string; hours: string }
    actions: { routeLabel: string }
    socialLabels: {
      instagram: string
      facebook: string
      whatsapp: string
      whatsappPlaceholder: string
    }
    socials: { instagram: string; facebook: string; whatsapp: string }
  }
  faq: {
    kicker: string
    title: string
    subtitle: string
    items: { question: string; answer: string }[]
  }
  footer: {
    legal: { label: string; href: string }[]
    note: string
  }
  theme: Theme
}

const address = 'Badestube 6A, 36251 Bad Hersfeld'
const addressEncoded = 'Badestube%206A%2C%2036251%20Bad%20Hersfeld'

export const content: Content = {
  site: {
    name: '77 Style Salon',
    category: 'Barbershop / Herrenfriseur',
    address,
    phone: '06621 7092099',
    phoneHref: 'tel:066217092099',
  },
  nav: [
    { label: 'Leistungen', href: '#leistungen' },
    { label: 'Preise', href: '#preise' },
    { label: 'Galerie', href: '#galerie' },
    { label: 'Ueber uns', href: '#ueber-uns' },
    { label: 'Kontakt', href: '#kontakt' },
    { label: 'FAQ', href: '#faq' },
  ],
  header: { callLabel: 'Anrufen' },
  hero: {
    kicker: 'Bad Hersfeld',
    claim: 'Moderne Cuts, klare Kanten und entspannter Style.',
    subheading:
      'Ein hochwertiger Barbershop fuer Herren, der Praezision, Sauberkeit und eine ruhige Atmosphaere verbindet.',
    routeUrl: `https://www.google.com/maps/dir/?api=1&destination=${addressEncoded}`,
    hoursKicker: 'TODO',
    hoursNote: 'TODO: Oeffnungszeiten folgen.',
    imageUrl: '',
    imageAlt: '',
    ctas: {
      callLabel: 'Anrufen',
      routeLabel: 'Route',
      bookingLabel: 'Termin anfragen',
    },
  },
  services: {
    kicker: 'Leistungen',
    title: 'Leistungen',
    subtitle: 'Klare Leistungen, fair kommuniziert und schnell verstanden.',
    items: [
      { title: 'Haarschnitt', description: 'Praezise Schnitte, sauber verblendet, exakt auf deinen Stil.' },
      { title: 'Bartpflege', description: 'Konturen, Form und Pflege fuer einen klaren Look.' },
      { title: 'Styling', description: 'Finish mit passenden Produkten fuer den Alltag.' },
      { title: 'Konturen', description: 'Exakte Linien und saubere Kanten an Haar und Bart.' },
      { title: 'Waschen', description: 'Gruendliche Reinigung und frisches Gefuehl.' },
      { title: 'Beratung', description: 'Individuelle Empfehlung fuer Schnitt, Bart und Pflege.' },
    ],
  },
  prices: {
    kicker: 'Preise',
    title: 'Preise',
    subtitle: 'Transparenz ist uns wichtig, die Details folgen.',
    tableHeaders: { service: 'Leistung', price: 'Preis' },
    items: [
      { service: 'Haarschnitt', price: 'TODO' },
      { service: 'Bartpflege', price: 'TODO' },
      { service: 'Haarschnitt + Bart', price: 'TODO' },
      { service: 'Styling', price: 'TODO' },
      { service: 'Konturen', price: 'TODO' },
      { service: 'Beratung', price: 'TODO' },
    ],
    note: 'TODO: Preise auf Anfrage / im Salon. Preisliste ergaenzen.',
  },
  gallery: {
    kicker: 'Galerie',
    title: 'Galerie',
    subtitle: 'Eindruecke aus dem Salon. Bilder folgen als Platzhalter.',
    items: [
      { label: 'Look 01', imageUrl: '', imageAlt: '' },
      { label: 'Look 02', imageUrl: '', imageAlt: '' },
      { label: 'Look 03', imageUrl: '', imageAlt: '' },
      { label: 'Look 04', imageUrl: '', imageAlt: '' },
      { label: 'Look 05', imageUrl: '', imageAlt: '' },
      { label: 'Look 06', imageUrl: '', imageAlt: '' },
      { label: 'Look 07', imageUrl: '', imageAlt: '' },
      { label: 'Look 08', imageUrl: '', imageAlt: '' },
    ],
    note: 'TODO: Galerie-Bilder austauschen.',
  },
  about: {
    kicker: 'Studio',
    title: 'Ueber uns',
    subtitle: 'Qualitaet, Ruhe und ein cleanes Handwerk.',
    text:
      '77 Style Salon steht fuer einen modernen Herrenfriseur mit Fokus auf Praezision, entspannte Atmosphaere und saubere Linien. Wir nehmen uns Zeit, damit jeder Look stimmt.',
  },
  qualities: [
    { title: 'Sauberkeit', description: 'Hygienische Arbeitsweise, klare Standards, sauberes Werkzeug.', icon: 'spark' },
    { title: 'Praezision', description: 'Schnittfuehrung und Details, die den Unterschied machen.', icon: 'precision' },
    { title: 'Atmosphaere', description: 'Ruhiges Ambiente fuer einen entspannten Termin.', icon: 'comfort' },
  ],
  contact: {
    kicker: 'Kontakt',
    title: 'Standort & Kontakt',
    subtitle: 'Direkt erreichbar und zentral in Bad Hersfeld.',
    openingHoursNote: 'TODO: Oeffnungszeiten ergaenzen.',
    routeUrl: `https://www.google.com/maps/dir/?api=1&destination=${addressEncoded}`,
    mapEmbedUrl: `https://www.google.com/maps?q=${addressEncoded}&output=embed`,
    labels: { address: 'Adresse', phone: 'Telefon', hours: 'Oeffnungszeiten' },
    actions: { routeLabel: 'Route' },
    socialLabels: {
      instagram: 'Instagram',
      facebook: 'Facebook',
      whatsapp: 'WhatsApp',
      whatsappPlaceholder: 'WhatsApp (TODO)',
    },
    socials: {
      instagram: 'https://www.instagram.com/77stylesalon/',
      facebook: 'https://www.facebook.com/77stylesalon/',
      whatsapp: '',
    },
  },
  faq: {
    kicker: 'FAQ',
    title: 'FAQ',
    subtitle: 'Schnelle Antworten auf haeufige Fragen.',
    items: [
      {
        question: 'Brauche ich einen Termin?',
        answer: 'Empfohlen, damit wir genug Zeit fuer dich einplanen koennen. Kurzfristig gerne per Telefon.',
      },
      {
        question: 'Welche Zahlarten werden akzeptiert?',
        answer: 'Bitte direkt im Salon erfragen. TODO: genaue Zahlarten ergaenzen.',
      },
      {
        question: 'Gibt es Parkmoeglichkeiten?',
        answer: 'In der Umgebung gibt es oeffentliche Parkmoeglichkeiten. TODO: Details bestaetigen.',
      },
      {
        question: 'Wie kurzfristig kann ich absagen?',
        answer: 'Bitte so frueh wie moeglich Bescheid geben, damit wir Termine neu vergeben koennen.',
      },
    ],
  },
  footer: {
    legal: [
      { label: 'Impressum (TODO)', href: '#' },
      { label: 'Datenschutz (TODO)', href: '#' },
    ],
    note: 'TODO: Rechtstexte verlinken.',
  },
  theme: {
    colors: {
      brand: '#E6C97A',
      brandDark: '#D5B861',
      brandSoft: '#F5E8C7',
      accent: '#121212',
      accentDark: '#0A0A0A',
      accentSoft: '#2A2A2A',
    },
  },
}
