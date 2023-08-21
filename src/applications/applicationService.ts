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
    if (board) {
      switch (pos) {
        case 'first':
          const updatedAtFirst = {boards: [board, ...state.boards.filter(b => b.id !== draggingBoardId)]}
          this.repository.set(updatedAtFirst)
          return updatedAtFirst
        case 'middle':
          const idxDragging = state.boards.findIndex(b => b.id === draggingBoardId)
          const idxDropTarget = state.boards.findIndex(b => b.id === dropTargetBoardId)
          const found = state.boards.find(b => b.id === draggingBoardId)
          if (found) {
            const stateDeleted = {boards: state.boards.filter(b => b.id !== draggingBoardId)}
            const idx = stateDeleted.boards.findIndex(b => b.id === dropTargetBoardId)
            const idxSlice = (idxDragging < idxDropTarget) ? (idx + 1) : ((idxDropTarget < idxDragging) ? idx : 0)
            const updatedAtMiddle = {boards: [...stateDeleted.boards.slice(0, idxSlice), found, ...stateDeleted.boards.slice(idxSlice)]}
            this.repository.set(updatedAtMiddle)
            return updatedAtMiddle
          } else {
            throw Error('moveBoard failed')
          }
      case 'last':
          const updatedAtLast = {boards: [...state.boards.filter(b => b.id !== draggingBoardId), board]}
          this.repository.set(updatedAtLast)
          return updatedAtLast
        default:
          break
      }
    }
    return state
  }
  updateBoardName (state: State, name: string, boardId: string) {
    const updated = {boards: state.boards.map(b => {
      return (b.id === boardId) ? {...b, name: name} : b
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
        return (b.id === boardId) ? {...b, lists: [...b.lists, list]} : b
      })
    }
    this.repository.set(updated)
    return updated
  }
  deleteList (state: State, id: string, boardId: string): State {
    const updated = {
      boards: state.boards.map(b => {
        return (b.id === boardId) ? {...b, lists: b.lists.filter(l => l.id !== id)} : b
      })
    }
    this.repository.set(updated)
    return updated
  }
  updateListName (state: State, name: string, boardId: string, listId: string) {
    const updated = {boards: state.boards.map(b => {
      if (b.id === boardId) {
        return {...b, lists: b.lists.map(l => {
          return (l.id === listId) ? {...l, name: name} : l
        })}
      } else {
        return b
      }
    })}
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
        return (l.id === listId) ? {...l, cards: [...l.cards, card]} :l
      })
      const updated = {
        boards: state.boards.map(b => {
          return (b.id === boardId) ? {...b, lists: updatedLists} : b
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
        return (l.id === listId) ? {...l, cards: l.cards.filter(c => c.id !== cardId)} : l
      })
      const updated = {
        boards: state.boards.map(b => {
          return (b.id === boardId) ? {...b, lists: updatedLists} : b
        })
      }
      this.repository.set(updated)
      return updated
    }
    return state
  }
  moveCard (
    state: State,
    draggingCardId: string,
    pos: Pos,
    dropTargetCardId: string,
    dropTargetBoardId: string,
    dropTargetListId: string
  ): State {
    const board = state.boards.find(b => b.id === dropTargetBoardId)
    if (board) {
      const list = board.lists.find(l => l.id === dropTargetListId)
      if (list) {
        const card = list.cards.find(c => c.id === draggingCardId)
        if (card) {
          switch (pos) {
            case 'first':
              const listsUpdatedAtfirst = board.lists.map(l => {
                return (l.id === list.id) ? {...list, cards: [card, ...list.cards.filter(c => c.id !== draggingCardId)]} : l
              })
              const updatedAtFirst = {
                boards: state.boards.map(b => {
                  return (b.id === board.id) ? {...b, lists: listsUpdatedAtfirst} : b
                })
              }
              this.repository.set(updatedAtFirst)
              return updatedAtFirst
            case 'middle':
              const idxDragging = list.cards.findIndex(c => c.id === draggingCardId)
              const idxDropTarget = list.cards.findIndex(c => c.id === dropTargetCardId)
              let cardsUpdated = list.cards.filter(c => c.id !== draggingCardId)
              const idx = cardsUpdated.findIndex(c => c.id === dropTargetCardId)
              if (idxDragging < idxDropTarget) {
                cardsUpdated.splice(idx + 1, 0, card)
              } else if (idxDropTarget < idxDragging) {
                cardsUpdated.splice(idx, 0, card)
              }
              const listsUpdatedAtMiddle = board.lists.map(l => {
                return (l.id === list.id) ? {...list, cards: cardsUpdated} : l
              })
              const updatedAtMiddle = {
                boards: state.boards.map(b => {
                  return (b.id === board.id) ? {...b, lists: listsUpdatedAtMiddle} : b
                })
              }
              this.repository.set(updatedAtMiddle)
              return updatedAtMiddle
            case 'last':
              const listsUpdatedAtLast = board.lists.map(l => {
                return (l.id === list.id) ? {...list, cards: [...list.cards.filter(c => c.id !== draggingCardId), card]} : l
              })
              const updatedAtLast = {
                boards: state.boards.map(b => {
                  return (b.id === board.id) ? {...b, lists: listsUpdatedAtLast} : b
                })
              }
              this.repository.set(updatedAtLast)
              return updatedAtLast
          }
        }
      }
    }
    return state
  }
  updateCardName (state: State, cardId: string, name: string, boardId: string, listId: string): State {
    const updated = {
      boards: state.boards.map(b => {
        return ((b.id === boardId)
          ? {...b, lists: b.lists.map(l => {
              return ((l.id === listId)
                ? {...l, cards: l.cards.map(c => {
                  return ((c.id === cardId)
                    ? {...c, name: name}
                    : c)}
                  )}
                : l
              )
            })}
          : b
        )
      })
    }
    return updated
  }
}
