import type { Content } from '../content'
import { content as defaultContent } from '../content'
import { supabase } from './supabaseClient'

export type SectionKey = keyof Content

type SectionRow = {
  section_key: SectionKey
  data: unknown
}

export async function getContent(): Promise<Content> {
  const { data, error } = await supabase.from('content_sections').select('section_key,data')

  if (error) {
    throw new Error(error.message)
  }

  const map = new Map<SectionKey, unknown>()
  for (const row of (data ?? []) as SectionRow[]) {
    map.set(row.section_key, row.data)
  }

  const merged = { ...defaultContent } as Content
  const mergedRecord = merged as Record<SectionKey, Content[SectionKey]>
  ;(Object.keys(defaultContent) as SectionKey[]).forEach((key) => {
    if (map.has(key)) {
      mergedRecord[key] = map.get(key) as Content[SectionKey]
    }
  })

  return merged
}

export async function saveSection(sectionKey: SectionKey, data: Content[SectionKey]) {
  const { error } = await supabase.from('content_sections').upsert({
    section_key: sectionKey,
    data,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function saveAllSections(content: Content) {
  const payload = (Object.keys(content) as SectionKey[]).map((key) => ({
    section_key: key,
    data: content[key],
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from('content_sections').upsert(payload)

  if (error) {
    throw new Error(error.message)
  }
}

export async function uploadImage(file: File, pathPrefix: string) {
  const fileExt = file.name.split('.').pop() || 'jpg'
  const safeName = `${pathPrefix}/${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`

  const { error } = await supabase.storage.from('site-assets').upload(safeName, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from('site-assets').getPublicUrl(safeName)
  return data.publicUrl
}
