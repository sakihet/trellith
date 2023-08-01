import crypto from "crypto"
import { BoardState } from "../components/PageBoard"
import { Repository } from "../repositories/repository"
import { Board } from "../types/board"
import { BoardList } from "../types/boardList"
import { State } from "../types/state"

export class ApplicationService {
  repository: Repository

  constructor (
    repository: Repository
  ) {
    this.repository = repository
  }

  // Utils
  clear (): State {
    const state = {boards: []}
    this.repository.remove()
    return state
  }
  load (): State {
    return this.repository.get()
  }
  // Board
  createBoard (state: State, name: string): State {
    const board: Board = {
      id: crypto.randomUUID(),
      name: name,
      lists: []
    }
    state = { boards: [board, ...state.boards]}
    this.repository.set(state)
    return state
  }
  deleteBoard (state: State, id: string): State {
    state = { boards: [...state.boards.filter(b => b.id !== id)]}
    this.repository.set(state)
    return state
  }
  // List
  createList (state: State, name: string, boardId: string): State {
    const list: BoardList = {
      id: crypto.randomUUID(),
      name: name,
      cards: []
    }
    const updatedBoards = state.boards.map(b => {
      if (b.id === boardId) {
        return {...b, lists: [...b.lists, list]}
      } else {
        return b
      }
    })
    state = {boards: updatedBoards}
    this.repository.set(state)
    return state
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
