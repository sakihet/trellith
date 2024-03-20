import { Signal, signal } from "@preact/signals"
import { State } from "./types/state"
import { getTheme } from "./utils"
import { Theme } from "./types/theme"

export function createAppState() {
  const appState: Signal<State> = signal<State>({ boards: [] })
  const appTheme: Signal<Theme> = signal<Theme>(getTheme())

  return { appState, appTheme }
}
