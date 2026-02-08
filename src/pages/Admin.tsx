import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { Content } from '../content'
import { content as defaultContent } from '../content'
import type { SectionKey } from '../lib/contentService'
import { getContent, saveAllSections, saveSection, uploadImage } from '../lib/contentService'
import { supabase } from '../lib/supabaseClient'
import { themeToStyle } from '../lib/theme'
import SitePage from '../components/SitePage'

const sectionLabels: Record<SectionKey, string> = {
  site: 'Site',
  nav: 'Navigation',
  header: 'Header',
  hero: 'Hero',
  services: 'Services',
  prices: 'Prices',
  gallery: 'Gallery',
  about: 'About',
  qualities: 'Qualities',
  contact: 'Contact',
  faq: 'FAQ',
  footer: 'Footer',
  theme: 'Theme',
}

const iconOptions = ['spark', 'precision', 'comfort'] as const

type Status = {
  type: 'success' | 'error' | 'info'
  message: string
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-accent/60">
      <span>{label}</span>
      <div className="text-sm font-normal text-accent">{children}</div>
    </label>
  )
}

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-brand-dark/40 bg-white px-4 py-2 text-sm text-accent shadow-sm focus:border-accent focus:outline-none"
    />
  )
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-brand-dark/40 bg-white px-4 py-2 text-sm text-accent shadow-sm focus:border-accent focus:outline-none"
      rows={props.rows ?? 4}
    />
  )
}

function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-brand-dark/40 bg-white px-4 py-2 text-sm text-accent shadow-sm focus:border-accent focus:outline-none"
    />
  )
}

export default function Admin() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(
    null,
  )
  const [authLoading, setAuthLoading] = useState(true)
  const [draft, setDraft] = useState<Content>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SectionKey>('hero')
  const [status, setStatus] = useState<Status | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return
      }
      setSession(data.session)
      setAuthLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthLoading(false)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session) {
      return
    }

    let active = true
    const load = async () => {
      try {
        setLoading(true)
        const data = await getContent()
        if (!active) {
          return
        }
        setDraft(data)
      } catch (err) {
        if (!active) {
          return
        }
        setStatus({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to load content',
        })
        setDraft(defaultContent)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [session])

  const sortedSections = useMemo(() => Object.keys(sectionLabels) as SectionKey[], [])

  const previewStyle = themeToStyle(draft.theme)

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    setStatus(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  const handleSaveSection = async () => {
    setSaving(true)
    setStatus(null)
    try {
      await saveSection(selected, draft[selected])
      setStatus({ type: 'success', message: `${sectionLabels[selected]} saved.` })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Save failed',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setStatus(null)
    try {
      await saveAllSections(draft)
      setStatus({ type: 'success', message: 'All sections saved.' })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Save failed',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (file: File, pathPrefix: string, onComplete: (url: string) => void) => {
    setUploadingKey(pathPrefix)
    setStatus({ type: 'info', message: 'Uploading image...' })
    try {
      const url = await uploadImage(file, pathPrefix)
      onComplete(url)
      setStatus({ type: 'success', message: 'Image uploaded.' })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Upload failed',
      })
    } finally {
      setUploadingKey(null)
    }
  }

  const renderEditor = () => {
    switch (selected) {
      case 'site': {
        const site = draft.site
        return (
          <div className="space-y-6">
            <Field label="Name">
              <TextInput value={site.name} onChange={(e) => setDraft({ ...draft, site: { ...site, name: e.target.value } })} />
            </Field>
            <Field label="Category">
              <TextInput
                value={site.category}
                onChange={(e) => setDraft({ ...draft, site: { ...site, category: e.target.value } })}
              />
            </Field>
            <Field label="Address">
              <TextInput
                value={site.address}
                onChange={(e) => setDraft({ ...draft, site: { ...site, address: e.target.value } })}
              />
            </Field>
            <Field label="Phone">
              <TextInput
                value={site.phone}
                onChange={(e) => setDraft({ ...draft, site: { ...site, phone: e.target.value } })}
              />
            </Field>
            <Field label="Phone Href">
              <TextInput
                value={site.phoneHref}
                onChange={(e) => setDraft({ ...draft, site: { ...site, phoneHref: e.target.value } })}
              />
            </Field>
          </div>
        )
      }
      case 'nav': {
        const nav = draft.nav
        return (
          <div className="space-y-4">
            {nav.map((item, index) => (
              <div key={`${item.label}-${index}`} className="rounded-2xl border border-brand-dark/40 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Label">
                    <TextInput
                      value={item.label}
                      onChange={(e) => {
                        const next = [...nav]
                        next[index] = { ...item, label: e.target.value }
                        setDraft({ ...draft, nav: next })
                      }}
                    />
                  </Field>
                  <Field label="Href">
                    <TextInput
                      value={item.href}
                      onChange={(e) => {
                        const next = [...nav]
                        next[index] = { ...item, href: e.target.value }
                        setDraft({ ...draft, nav: next })
                      }}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600"
                  onClick={() => {
                    const next = nav.filter((_, i) => i !== index)
                    setDraft({ ...draft, nav: next })
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
              onClick={() => setDraft({ ...draft, nav: [...nav, { label: 'New', href: '#new' }] })}
            >
              Add Item
            </button>
          </div>
        )
      }
      case 'header': {
        const header = draft.header
        return (
          <div className="space-y-6">
            <Field label="Call Button Label">
              <TextInput
                value={header.callLabel}
                onChange={(e) => setDraft({ ...draft, header: { ...header, callLabel: e.target.value } })}
              />
            </Field>
          </div>
        )
      }
      case 'hero': {
        const hero = draft.hero
        return (
          <div className="space-y-6">
            <Field label="Kicker">
              <TextInput value={hero.kicker} onChange={(e) => setDraft({ ...draft, hero: { ...hero, kicker: e.target.value } })} />
            </Field>
            <Field label="Claim">
              <TextInput value={hero.claim} onChange={(e) => setDraft({ ...draft, hero: { ...hero, claim: e.target.value } })} />
            </Field>
            <Field label="Subheading">
              <TextArea
                value={hero.subheading}
                onChange={(e) => setDraft({ ...draft, hero: { ...hero, subheading: e.target.value } })}
              />
            </Field>
            <Field label="Route URL">
              <TextInput
                value={hero.routeUrl}
                onChange={(e) => setDraft({ ...draft, hero: { ...hero, routeUrl: e.target.value } })}
              />
            </Field>
            <Field label="Hours Kicker">
              <TextInput
                value={hero.hoursKicker}
                onChange={(e) => setDraft({ ...draft, hero: { ...hero, hoursKicker: e.target.value } })}
              />
            </Field>
            <Field label="Hours Note">
              <TextInput
                value={hero.hoursNote}
                onChange={(e) => setDraft({ ...draft, hero: { ...hero, hoursNote: e.target.value } })}
              />
            </Field>
            <Field label="Hero Image">
              <div className="space-y-2">
                <TextInput
                  value={hero.imageUrl ?? ''}
                  onChange={(e) => setDraft({ ...draft, hero: { ...hero, imageUrl: e.target.value } })}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) {
                      return
                    }
                    handleUpload(file, 'hero', (url) => {
                      setDraft({ ...draft, hero: { ...hero, imageUrl: url } })
                    })
                  }}
                />
              </div>
            </Field>
            <Field label="Hero Image Alt">
              <TextInput
                value={hero.imageAlt ?? ''}
                onChange={(e) => setDraft({ ...draft, hero: { ...hero, imageAlt: e.target.value } })}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="CTA Call Label">
                <TextInput
                  value={hero.ctas.callLabel}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      hero: { ...hero, ctas: { ...hero.ctas, callLabel: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="CTA Booking Label">
                <TextInput
                  value={hero.ctas.bookingLabel}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      hero: { ...hero, ctas: { ...hero.ctas, bookingLabel: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="CTA Route Label">
                <TextInput
                  value={hero.ctas.routeLabel}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      hero: { ...hero, ctas: { ...hero.ctas, routeLabel: e.target.value } },
                    })
                  }
                />
              </Field>
            </div>
          </div>
        )
      }
      case 'services': {
        const services = draft.services
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kicker">
                <TextInput
                  value={services.kicker}
                  onChange={(e) => setDraft({ ...draft, services: { ...services, kicker: e.target.value } })}
                />
              </Field>
              <Field label="Title">
                <TextInput
                  value={services.title}
                  onChange={(e) => setDraft({ ...draft, services: { ...services, title: e.target.value } })}
                />
              </Field>
            </div>
            <Field label="Subtitle">
              <TextInput
                value={services.subtitle}
                onChange={(e) => setDraft({ ...draft, services: { ...services, subtitle: e.target.value } })}
              />
            </Field>
            <div className="space-y-4">
              {services.items.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-2xl border border-brand-dark/40 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Item Title">
                      <TextInput
                        value={item.title}
                        onChange={(e) => {
                          const next = [...services.items]
                          next[index] = { ...item, title: e.target.value }
                          setDraft({ ...draft, services: { ...services, items: next } })
                        }}
                      />
                    </Field>
                    <Field label="Item Description">
                      <TextInput
                        value={item.description}
                        onChange={(e) => {
                          const next = [...services.items]
                          next[index] = { ...item, description: e.target.value }
                          setDraft({ ...draft, services: { ...services, items: next } })
                        }}
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600"
                    onClick={() => {
                      const next = services.items.filter((_, i) => i !== index)
                      setDraft({ ...draft, services: { ...services, items: next } })
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
                onClick={() =>
                  setDraft({
                    ...draft,
                    services: {
                      ...services,
                      items: [...services.items, { title: 'New service', description: 'Description' }],
                    },
                  })
                }
              >
                Add Service
              </button>
            </div>
          </div>
        )
      }
      case 'prices': {
        const prices = draft.prices
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kicker">
                <TextInput
                  value={prices.kicker}
                  onChange={(e) => setDraft({ ...draft, prices: { ...prices, kicker: e.target.value } })}
                />
              </Field>
              <Field label="Title">
                <TextInput
                  value={prices.title}
                  onChange={(e) => setDraft({ ...draft, prices: { ...prices, title: e.target.value } })}
                />
              </Field>
            </div>
            <Field label="Subtitle">
              <TextInput
                value={prices.subtitle}
                onChange={(e) => setDraft({ ...draft, prices: { ...prices, subtitle: e.target.value } })}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Header Service">
                <TextInput
                  value={prices.tableHeaders.service}
                  onChange={(e) =>
                    setDraft({ ...draft, prices: { ...prices, tableHeaders: { ...prices.tableHeaders, service: e.target.value } } })
                  }
                />
              </Field>
              <Field label="Header Price">
                <TextInput
                  value={prices.tableHeaders.price}
                  onChange={(e) =>
                    setDraft({ ...draft, prices: { ...prices, tableHeaders: { ...prices.tableHeaders, price: e.target.value } } })
                  }
                />
              </Field>
            </div>
            <Field label="Note">
              <TextInput
                value={prices.note}
                onChange={(e) => setDraft({ ...draft, prices: { ...prices, note: e.target.value } })}
              />
            </Field>
            <div className="space-y-4">
              {prices.items.map((item, index) => (
                <div key={`${item.service}-${index}`} className="rounded-2xl border border-brand-dark/40 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Service">
                      <TextInput
                        value={item.service}
                        onChange={(e) => {
                          const next = [...prices.items]
                          next[index] = { ...item, service: e.target.value }
                          setDraft({ ...draft, prices: { ...prices, items: next } })
                        }}
                      />
                    </Field>
                    <Field label="Price">
                      <TextInput
                        value={item.price}
                        onChange={(e) => {
                          const next = [...prices.items]
                          next[index] = { ...item, price: e.target.value }
                          setDraft({ ...draft, prices: { ...prices, items: next } })
                        }}
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600"
                    onClick={() => {
                      const next = prices.items.filter((_, i) => i !== index)
                      setDraft({ ...draft, prices: { ...prices, items: next } })
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
                onClick={() =>
                  setDraft({
                    ...draft,
                    prices: {
                      ...prices,
                      items: [...prices.items, { service: 'New', price: '00' }],
                    },
                  })
                }
              >
                Add Price
              </button>
            </div>
          </div>
        )
      }
      case 'gallery': {
        const gallery = draft.gallery
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kicker">
                <TextInput
                  value={gallery.kicker}
                  onChange={(e) => setDraft({ ...draft, gallery: { ...gallery, kicker: e.target.value } })}
                />
              </Field>
              <Field label="Title">
                <TextInput
                  value={gallery.title}
                  onChange={(e) => setDraft({ ...draft, gallery: { ...gallery, title: e.target.value } })}
                />
              </Field>
            </div>
            <Field label="Subtitle">
              <TextInput
                value={gallery.subtitle}
                onChange={(e) => setDraft({ ...draft, gallery: { ...gallery, subtitle: e.target.value } })}
              />
            </Field>
            <Field label="Note">
              <TextInput
                value={gallery.note}
                onChange={(e) => setDraft({ ...draft, gallery: { ...gallery, note: e.target.value } })}
              />
            </Field>
            <div className="space-y-4">
              {gallery.items.map((item, index) => (
                <div key={`${item.label}-${index}`} className="rounded-2xl border border-brand-dark/40 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Label">
                      <TextInput
                        value={item.label}
                        onChange={(e) => {
                          const next = [...gallery.items]
                          next[index] = { ...item, label: e.target.value }
                          setDraft({ ...draft, gallery: { ...gallery, items: next } })
                        }}
                      />
                    </Field>
                    <Field label="Image Alt">
                      <TextInput
                        value={item.imageAlt ?? ''}
                        onChange={(e) => {
                          const next = [...gallery.items]
                          next[index] = { ...item, imageAlt: e.target.value }
                          setDraft({ ...draft, gallery: { ...gallery, items: next } })
                        }}
                      />
                    </Field>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Field label="Image URL">
                      <TextInput
                        value={item.imageUrl ?? ''}
                        onChange={(e) => {
                          const next = [...gallery.items]
                          next[index] = { ...item, imageUrl: e.target.value }
                          setDraft({ ...draft, gallery: { ...gallery, items: next } })
                        }}
                      />
                    </Field>
                    <div className="mt-6">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) {
                            return
                          }
                          handleUpload(file, `gallery/${index}`, (url) => {
                            const next = [...gallery.items]
                            next[index] = { ...item, imageUrl: url }
                            setDraft({ ...draft, gallery: { ...gallery, items: next } })
                          })
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600"
                    onClick={() => {
                      const next = gallery.items.filter((_, i) => i !== index)
                      setDraft({ ...draft, gallery: { ...gallery, items: next } })
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
                onClick={() =>
                  setDraft({
                    ...draft,
                    gallery: {
                      ...gallery,
                      items: [...gallery.items, { label: 'New', imageUrl: '', imageAlt: '' }],
                    },
                  })
                }
              >
                Add Image
              </button>
            </div>
          </div>
        )
      }
      case 'about': {
        const about = draft.about
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kicker">
                <TextInput
                  value={about.kicker}
                  onChange={(e) => setDraft({ ...draft, about: { ...about, kicker: e.target.value } })}
                />
              </Field>
              <Field label="Title">
                <TextInput
                  value={about.title}
                  onChange={(e) => setDraft({ ...draft, about: { ...about, title: e.target.value } })}
                />
              </Field>
            </div>
            <Field label="Subtitle">
              <TextInput
                value={about.subtitle}
                onChange={(e) => setDraft({ ...draft, about: { ...about, subtitle: e.target.value } })}
              />
            </Field>
            <Field label="Text">
              <TextArea
                value={about.text}
                onChange={(e) => setDraft({ ...draft, about: { ...about, text: e.target.value } })}
              />
            </Field>
          </div>
        )
      }
      case 'qualities': {
        const qualities = draft.qualities
        return (
          <div className="space-y-4">
            {qualities.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-2xl border border-brand-dark/40 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <TextInput
                      value={item.title}
                      onChange={(e) => {
                        const next = [...qualities]
                        next[index] = { ...item, title: e.target.value }
                        setDraft({ ...draft, qualities: next })
                      }}
                    />
                  </Field>
                  <Field label="Icon">
                    <SelectInput
                      value={item.icon}
                      onChange={(e) => {
                        const next = [...qualities]
                        next[index] = { ...item, icon: e.target.value as (typeof iconOptions)[number] }
                        setDraft({ ...draft, qualities: next })
                      }}
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>
                </div>
                <Field label="Description">
                  <TextInput
                    value={item.description}
                    onChange={(e) => {
                      const next = [...qualities]
                      next[index] = { ...item, description: e.target.value }
                      setDraft({ ...draft, qualities: next })
                    }}
                  />
                </Field>
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600"
                  onClick={() => {
                    const next = qualities.filter((_, i) => i !== index)
                    setDraft({ ...draft, qualities: next })
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
              onClick={() =>
                setDraft({
                  ...draft,
                  qualities: [...qualities, { title: 'New', description: 'Description', icon: 'spark' }],
                })
              }
            >
              Add Quality
            </button>
          </div>
        )
      }
      case 'contact': {
        const contact = draft.contact
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kicker">
                <TextInput
                  value={contact.kicker}
                  onChange={(e) => setDraft({ ...draft, contact: { ...contact, kicker: e.target.value } })}
                />
              </Field>
              <Field label="Title">
                <TextInput
                  value={contact.title}
                  onChange={(e) => setDraft({ ...draft, contact: { ...contact, title: e.target.value } })}
                />
              </Field>
            </div>
            <Field label="Subtitle">
              <TextInput
                value={contact.subtitle}
                onChange={(e) => setDraft({ ...draft, contact: { ...contact, subtitle: e.target.value } })}
              />
            </Field>
            <Field label="Opening Hours Note">
              <TextInput
                value={contact.openingHoursNote}
                onChange={(e) => setDraft({ ...draft, contact: { ...contact, openingHoursNote: e.target.value } })}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Route URL">
                <TextInput
                  value={contact.routeUrl}
                  onChange={(e) => setDraft({ ...draft, contact: { ...contact, routeUrl: e.target.value } })}
                />
              </Field>
              <Field label="Map Embed URL">
                <TextInput
                  value={contact.mapEmbedUrl}
                  onChange={(e) => setDraft({ ...draft, contact: { ...contact, mapEmbedUrl: e.target.value } })}
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Label Address">
                <TextInput
                  value={contact.labels.address}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, labels: { ...contact.labels, address: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="Label Phone">
                <TextInput
                  value={contact.labels.phone}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, labels: { ...contact.labels, phone: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="Label Hours">
                <TextInput
                  value={contact.labels.hours}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, labels: { ...contact.labels, hours: e.target.value } },
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Route Button Label">
              <TextInput
                value={contact.actions.routeLabel}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    contact: { ...contact, actions: { ...contact.actions, routeLabel: e.target.value } },
                  })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Instagram Label">
                <TextInput
                  value={contact.socialLabels.instagram}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: {
                        ...contact,
                        socialLabels: { ...contact.socialLabels, instagram: e.target.value },
                      },
                    })
                  }
                />
              </Field>
              <Field label="Instagram URL">
                <TextInput
                  value={contact.socials.instagram}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, socials: { ...contact.socials, instagram: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="Facebook Label">
                <TextInput
                  value={contact.socialLabels.facebook}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, socialLabels: { ...contact.socialLabels, facebook: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="Facebook URL">
                <TextInput
                  value={contact.socials.facebook}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, socials: { ...contact.socials, facebook: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="WhatsApp Label">
                <TextInput
                  value={contact.socialLabels.whatsapp}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, socialLabels: { ...contact.socialLabels, whatsapp: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="WhatsApp Placeholder">
                <TextInput
                  value={contact.socialLabels.whatsappPlaceholder}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: {
                        ...contact,
                        socialLabels: { ...contact.socialLabels, whatsappPlaceholder: e.target.value },
                      },
                    })
                  }
                />
              </Field>
              <Field label="WhatsApp URL">
                <TextInput
                  value={contact.socials.whatsapp}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      contact: { ...contact, socials: { ...contact.socials, whatsapp: e.target.value } },
                    })
                  }
                />
              </Field>
            </div>
          </div>
        )
      }
      case 'faq': {
        const faq = draft.faq
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Kicker">
                <TextInput value={faq.kicker} onChange={(e) => setDraft({ ...draft, faq: { ...faq, kicker: e.target.value } })} />
              </Field>
              <Field label="Title">
                <TextInput value={faq.title} onChange={(e) => setDraft({ ...draft, faq: { ...faq, title: e.target.value } })} />
              </Field>
            </div>
            <Field label="Subtitle">
              <TextInput
                value={faq.subtitle}
                onChange={(e) => setDraft({ ...draft, faq: { ...faq, subtitle: e.target.value } })}
              />
            </Field>
            <div className="space-y-4">
              {faq.items.map((item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-2xl border border-brand-dark/40 bg-white p-4 shadow-sm">
                  <Field label="Question">
                    <TextInput
                      value={item.question}
                      onChange={(e) => {
                        const next = [...faq.items]
                        next[index] = { ...item, question: e.target.value }
                        setDraft({ ...draft, faq: { ...faq, items: next } })
                      }}
                    />
                  </Field>
                  <Field label="Answer">
                    <TextArea
                      value={item.answer}
                      onChange={(e) => {
                        const next = [...faq.items]
                        next[index] = { ...item, answer: e.target.value }
                        setDraft({ ...draft, faq: { ...faq, items: next } })
                      }}
                    />
                  </Field>
                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600"
                    onClick={() => {
                      const next = faq.items.filter((_, i) => i !== index)
                      setDraft({ ...draft, faq: { ...faq, items: next } })
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
                onClick={() => setDraft({ ...draft, faq: { ...faq, items: [...faq.items, { question: 'New', answer: 'Answer' }] } })}
              >
                Add FAQ
              </button>
            </div>
          </div>
        )
      }
      case 'footer': {
        const footer = draft.footer
        return (
          <div className="space-y-6">
            <Field label="Note">
              <TextInput
                value={footer.note}
                onChange={(e) => setDraft({ ...draft, footer: { ...footer, note: e.target.value } })}
              />
            </Field>
            <div className="space-y-4">
              {footer.legal.map((item, index) => (
                <div key={`${item.label}-${index}`} className="rounded-2xl border border-brand-dark/40 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Label">
                      <TextInput
                        value={item.label}
                        onChange={(e) => {
                          const next = [...footer.legal]
                          next[index] = { ...item, label: e.target.value }
                          setDraft({ ...draft, footer: { ...footer, legal: next } })
                        }}
                      />
                    </Field>
                    <Field label="Href">
                      <TextInput
                        value={item.href}
                        onChange={(e) => {
                          const next = [...footer.legal]
                          next[index] = { ...item, href: e.target.value }
                          setDraft({ ...draft, footer: { ...footer, legal: next } })
                        }}
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600"
                    onClick={() => {
                      const next = footer.legal.filter((_, i) => i !== index)
                      setDraft({ ...draft, footer: { ...footer, legal: next } })
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
                onClick={() => setDraft({ ...draft, footer: { ...footer, legal: [...footer.legal, { label: 'New', href: '#' }] } })}
              >
                Add Link
              </button>
            </div>
          </div>
        )
      }
      case 'theme': {
        const theme = draft.theme
        const colors = theme.colors
        return (
          <div className="space-y-6">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="grid gap-4 md:grid-cols-[1fr_140px]">
                <Field label={key}>
                  <TextInput
                    value={value}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        theme: {
                          ...theme,
                          colors: { ...colors, [key]: e.target.value },
                        },
                      })
                    }
                  />
                </Field>
                <div className="mt-7">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        theme: { ...theme, colors: { ...colors, [key]: e.target.value } },
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )
      }
      default:
        return null
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-soft text-accent">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent/60">Loading</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-soft text-accent">
        <form onSubmit={handleSignIn} className="w-full max-w-sm space-y-4 rounded-3xl border border-brand-dark/40 bg-white p-8 shadow-soft">
          <h1 className="text-lg font-semibold">Admin Login</h1>
          {status && (
            <p className={status.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-accent/70'}>
              {status.message}
            </p>
          )}
          <Field label="Email">
            <TextInput name="email" type="email" required />
          </Field>
          <Field label="Password">
            <TextInput name="password" type="password" required />
          </Field>
          <button
            type="submit"
            className="w-full rounded-full bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand-soft"
          >
            Sign In
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-soft text-accent">
      <header className="border-b border-brand-dark/40 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/60">Admin</p>
            <p className="text-lg font-semibold">Content Studio</p>
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <span className={status.type === 'error' ? 'text-xs font-semibold text-red-600' : 'text-xs text-accent/70'}>
                {status.message}
              </span>
            )}
            <button
              type="button"
              className="rounded-full border border-brand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide"
              onClick={handleSaveSection}
              disabled={saving}
            >
              Save Section
            </button>
            <button
              type="button"
              className="rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-soft"
              onClick={handleSaveAll}
              disabled={saving}
            >
              Publish All
            </button>
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-wide text-accent/60"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/60">Blocks</p>
          {sortedSections.map((key) => (
            <button
              key={key}
              type="button"
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                selected === key
                  ? 'border-accent bg-accent text-brand-soft'
                  : 'border-brand-dark/40 bg-white text-accent hover:border-accent/50'
              }`}
              onClick={() => setSelected(key)}
            >
              {sectionLabels[key]}
            </button>
          ))}
        </aside>
        <main className="space-y-6">
          <div className="rounded-3xl border border-brand-dark/40 bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/60">Edit</p>
                <h2 className="text-lg font-semibold">{sectionLabels[selected]}</h2>
              </div>
              {uploadingKey && <span className="text-xs text-accent/60">Uploading...</span>}
            </div>
            {loading ? <p className="text-sm text-accent/60">Loading content...</p> : renderEditor()}
          </div>
          <div className="rounded-3xl border border-brand-dark/40 bg-white p-4 shadow-soft">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent/60">Live Preview</p>
            <div className="overflow-hidden rounded-2xl border border-brand-dark/40" style={previewStyle}>
              <SitePage content={draft} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
