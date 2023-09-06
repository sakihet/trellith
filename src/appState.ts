import { Signal, signal } from "@preact/signals"
import { State } from "./types/state"

export function createAppState() {
  const appState: Signal<State> = signal<State>({boards:[]})
  return {appState}
}
