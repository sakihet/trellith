import { Link } from "wouter-preact"
import { Theme } from "../types/theme"
import { Signal } from "@preact/signals"
import { applyTheme, setTheme } from "../utils"
import IconLightMode from "./IconLightMode"
import IconDarkMode from "./IconDarkMode"
import { showCommandPalette } from "../main"

export default function TheNavBar({ theme }: { theme: Signal<Theme> }) {
  const handleClick = () => {
    if (theme.value === 'light') {
      theme.value = 'dark'
    } else {
      theme.value = 'light'
    }
    applyTheme(theme.value)
    setTheme(theme.value)
  }

  const handleClickCommandPalette = () => {
    showCommandPalette.value = true
  }

  return (
    <header>
      <nav>
        <div class="h-12 p-3 flex-row bg-primary border-0 border-b-1 border-solid border-color-primary">
          <div class="f-1 h-6"></div>
          <div class="w-24 h-6">
            <Link
              href="/"
              class="text-decoration-none h-6"
            >
              <h1 class="m-0 h-6 text-center text-medium text-primary font-weight-600 hover-bg-link cursor-pointer">
                Trellith
              </h1>
            </Link>
          </div>
          <div class="f-1 h-6 text-right">
            <div class="layout-stack-horizontal-1">
              <button
                type="button"
                class="bg-transparent border-solid border-1 border-color-primary px-2 py-1 text-secondary text-small cursor-pointer"
                onClick={handleClickCommandPalette}
              >
                Command Palette
              </button>
              <Link
                href="/about"
                class="text-decoration-none text-secondary text-small hover px-2 py-1"
              >
                About
              </Link>
              <button
                type="button"
                class="h-6 w-6 border-solid border-1 border-color-primary text-medium bg-transparent cursor-pointer hover text-primary"
                onClick={handleClick}
              >
                {
                  theme.value === 'light'
                    ?
                    <IconLightMode />
                    :
                    <IconDarkMode />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
