import { Signal, signal } from "@preact/signals"

import { State } from "./types/state"
import { Theme } from "./types/theme"
import { getTheme } from "./utils"

export function createAppState() {
  const appState: Signal<State> = signal<State>({ boards: [] })
  const appTheme: Signal<Theme> = signal<Theme>(getTheme())
  const showCommandPalette = signal(false)
  const showBoardDialog = signal(false)

  return { appState, appTheme, showCommandPalette, showBoardDialog }
}
