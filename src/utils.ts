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
