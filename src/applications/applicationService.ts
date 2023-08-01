import { v4 as uuidv4 } from 'uuid'
import { Repository } from "../repositories/repository"
import { Board } from "../types/board"
import { BoardList } from "../types/boardList"
import { State } from "../types/state"
import { Card } from '../types/card'
import { Pos } from '../types/pos'

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
      id: uuidv4(),
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
  moveBoard (state: State, draggingBoardId: string, pos: Pos): State {
    const board = state.boards.find(b => b.id === draggingBoardId)
    const updated = {boards: state.boards.filter(b => b.id !== draggingBoardId)}
    let stateMoved
    if (board) {
      switch (pos) {
        case 'first':
          stateMoved = {boards: [board, ...updated.boards]}
          this.repository.set(stateMoved)
          return stateMoved
        case 'middle':
          console.log('move to middle')
          // TODO
          break
        case 'last':
          stateMoved = {boards: [...updated.boards, board]}
          this.repository.set(stateMoved)
          return stateMoved
        default:
          break
      }
    }
    return state
  }
  // List
  createList (state: State, name: string, boardId: string): State {
    const list: BoardList = {
      id: uuidv4(),
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
  deleteList (state: State, id: string, boardId: string): State {
    const updatedBoards = state.boards.map(b => {
      if (b.id === boardId) {
        return {...b, lists: b.lists.filter(l => l.id !== id)}
      } else {
        return b
      }
    })
    state = {boards: updatedBoards}
    this.repository.set(state)
    return state
  }
  // Card
  createCard (state: State, name: string, boardId: string, listId: string): State {
    const card: Card = {
      id: uuidv4(),
      name: name
    }
    const board = state.boards.find(b => b.id === boardId)
    if (board) {
      const updatedLists = board.lists.map(l => {
        if (l.id === listId) {
          return {...l, cards: [...l.cards, card]}
        } else {
          return l
        }
      })
      const boards = state.boards.map(b => {
        if (b.id === boardId) {
          return {...b, lists: updatedLists}
        } else {
          return b
        }
      })
      const updatedState = {boards: boards}
      this.repository.set(updatedState)
      return updatedState
    }
    return state
  }
  deleteCard (state: State, cardId: string, boardId: string, listId: string): State {
    const board = state.boards.find(b => b.id === boardId)
    if (board) {
      const updatedLists = board.lists.map(l => {
        if (l.id === listId) {
          return {...l, cards: l.cards.filter(c => c.id !== cardId)}
        } else {
          return l
        }
      })
      const boards = state.boards.map(b => {
        if (b.id === boardId) {
          return {...b, lists: updatedLists}
        } else {
          return b
        }
      })
      const updatedState = {boards: boards}
      this.repository.set(updatedState)
      return updatedState
    }
    return state
  }
}
