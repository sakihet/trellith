import { BoardState } from "../components/PageBoard"
import { Board } from "../types/board"
import { BoardList } from "../types/boardList"
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
  createList (boardState: BoardState, name: string): BoardState {
    const list: BoardList = {
        id: crypto.randomUUID(),
        name: name,
        cards: []
      }
    boardState = { lists: [...boardState.lists, list] }
    return boardState
  }
  deleteList (boardState: BoardState, id: string): BoardState {
    boardState = { lists: [...boardState.lists.filter(l => l.id !== id)] }
    return boardState
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
