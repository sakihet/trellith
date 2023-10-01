import { Theme } from "./types/theme"

export const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.firstElementChild?.classList.add('dark')
  } else {
    document.firstElementChild?.classList.remove('dark')
  }
}

export const getTheme = (): Theme => {
  const key = 'theme'
  const item = localStorage.getItem(key)
  if (item) {
    return item as Theme || 'light'
  } else {
    return window.matchMedia('(preferes-color-scheme: dark)').matches ? 'dark' : 'light'
  }
}

export const setTheme = (theme: Theme) => {
  localStorage.setItem('theme', theme)
}

export const relativeTime = (dateStr: string): string => {
  const now = new Date().getTime()
  const diff = now - new Date(dateStr).getTime()
  const formatter = new Intl.RelativeTimeFormat('en')
  let formatted
  if (diff < 1000 * 10) {
    formatted = 'now'
  } else if (diff < 1000 * 60) {
    formatted = formatter.format(-(Math.floor(diff / 1000)), 'second')
  } else if (diff < 1000 * 60 * 60) {
    formatted = formatter.format(-(Math.floor(diff / (1000 * 60))), 'minute')
  } else if (diff < 1000 * 60 * 60 * 24) {
    formatted = formatter.format(-(Math.floor(diff / (1000 * 60 * 60))), 'hour')
  } else {
    formatted = formatter.format(-(Math.floor(diff / (1000 * 60 * 60 * 24))), 'day')
  }
  return formatted
}
