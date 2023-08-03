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
    this.repository.remove()
    return {boards: []}
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
    const updated = {boards: [board, ...state.boards]}
    this.repository.set(updated)
    return updated
  }
  deleteBoard (state: State, id: string): State {
    const updated = {boards: [...state.boards.filter(b => b.id !== id)]}
    this.repository.set(updated)
    return updated
  }
  moveBoard (state: State, draggingBoardId: string, pos: Pos, dropTargetBoardId: string): State {
    const board = state.boards.find(b => b.id === draggingBoardId)
    let updated
    let stateMoved
    if (board) {
      switch (pos) {
        case 'first':
          stateMoved = {boards: [board, ...state.boards.filter(b => b.id !== draggingBoardId)]}
          this.repository.set(stateMoved)
          return stateMoved
        case 'middle':
          const idxDragging = state.boards.findIndex(b => b.id === draggingBoardId)
          const idxDropTarget = state.boards.findIndex(b => b.id === dropTargetBoardId)
          if (idxDragging < idxDropTarget) {
            updated = {boards: state.boards.filter(b => b.id !== draggingBoardId)}
            const idx = updated.boards.findIndex(b => b.id === dropTargetBoardId)
            updated.boards.splice(idx + 1, 0, board)
            this.repository.set(updated)
            return updated
          } else if (idxDropTarget < idxDragging) {
            updated = {boards: state.boards.filter(b => b.id !== draggingBoardId)}
            const idx = updated.boards.findIndex(b => b.id === dropTargetBoardId)
            updated.boards.splice(idx, 0, board)
             this.repository.set(updated)
            return updated
          } else {
          }
          break
        case 'last':
          updated = {boards: state.boards.filter(b => b.id !== draggingBoardId)}
          stateMoved = {boards: [...updated.boards, board]}
          this.repository.set(stateMoved)
          return stateMoved
        default:
          break
      }
    }
    return state
  }
  updateBoardName (state: State, name: string, boardId: string) {
    const updated = {boards: state.boards.map(b => {
      if (b.id === boardId) {
        return {...b, name: name}
      } else {
        return b
      }
    })}
    this.repository.set(updated)
    return updated
  }
  // List
  createList (state: State, name: string, boardId: string): State {
    const list: BoardList = {
      id: uuidv4(),
      name: name,
      cards: []
    }
    const updated = {
      boards: state.boards.map(b => {
        if (b.id === boardId) {
          return {...b, lists: [...b.lists, list]}
        } else {
          return b
        }
      })
    }
    this.repository.set(updated)
    return updated
  }
  deleteList (state: State, id: string, boardId: string): State {
    const updated = {
      boards: state.boards.map(b => {
        if (b.id === boardId) {
          return {...b, lists: b.lists.filter(l => l.id !== id)}
        } else {
          return b
        }
      })
    }
    this.repository.set(updated)
    return updated
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
      const updated = {
        boards: state.boards.map(b => {
          if (b.id === boardId) {
            return {...b, lists: updatedLists}
          } else {
            return b
          }
        })
      }
      this.repository.set(updated)
      return updated
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
      const updated = {
        boards: state.boards.map(b => {
          if (b.id === boardId) {
            return {...b, lists: updatedLists}
          } else {
            return b
          }
        })
      }
      this.repository.set(updated)
      return updated
    }
    return state
  }
}
