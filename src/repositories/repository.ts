import { State } from "../types/state";

const LOCAL_STORAGE_KEY = 'trellith'

export interface Repository {
  set: (state: State) => void
  get: () => State
  remove: () => void
}

export class RepositoryLocalStorage implements Repository {
  set (state: State) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    return
  }
  get (): State {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (value) {
      return JSON.parse(value)
    } else {
      return {boards: []}
    }
  }
  remove () {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return
  }
}
