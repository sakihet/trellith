import { Board } from "../types/board"
import { State } from "../types/state"
import { remove, save } from "../utils"

export class ApplicationService {
  // Utils
  clear (): State {
    const state = {boards: []}
    remove()
    return state
  }
  // Board
  createBoard (state: State, name: string): State {
    const board: Board = {
      id: crypto.randomUUID(),
      name: name,
      lists: []
    }
    state = { boards: [board, ...state.boards]}
    save(state)
    return state
  }
  deleteBoard (state: State, id: string): State {
    state = { boards: [...state.boards.filter(b => b.id !== id)]}
    save(state)
    return state
  }
  // List
  createList () {
    // TODO
    return
  }
  deleteList () {
    // TODO
    return
  }
  // Card
  createCard () {
    // TODO
    return
  }
  deleteCard () {
    // TODO
    return
  }
}
