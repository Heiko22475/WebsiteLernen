import type { CSSProperties } from 'react'
import type { Theme } from '../content'

type ThemeStyle = CSSProperties

export function applyTheme(theme?: Theme) {
  if (!theme) {
    return
  }

  const root = document.documentElement
  root.style.setProperty('--color-brand', theme.colors.brand)
  root.style.setProperty('--color-brand-dark', theme.colors.brandDark)
  root.style.setProperty('--color-brand-soft', theme.colors.brandSoft)
  root.style.setProperty('--color-accent', theme.colors.accent)
  root.style.setProperty('--color-accent-dark', theme.colors.accentDark)
  root.style.setProperty('--color-accent-soft', theme.colors.accentSoft)
}

export function themeToStyle(theme?: Theme): ThemeStyle {
  if (!theme) {
    return {}
  }

  return {
    ['--color-brand' as string]: theme.colors.brand,
    ['--color-brand-dark' as string]: theme.colors.brandDark,
    ['--color-brand-soft' as string]: theme.colors.brandSoft,
    ['--color-accent' as string]: theme.colors.accent,
    ['--color-accent-dark' as string]: theme.colors.accentDark,
    ['--color-accent-soft' as string]: theme.colors.accentSoft,
  }
}
