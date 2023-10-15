import { v4 as uuidv4 } from 'uuid'
import { Repository } from "../repositories/repository"
import { Board } from "../types/board"
import { List } from "../types/list"
import { State } from "../types/state"
import { Card } from '../types/card'
import { Pos } from '../types/pos'

const migrateState = (state: State): State => {
  const boardsUpdaetd = state.boards.map(b => {
    const listsUpdated = b.lists.map(l => {
      const cardsUpdated = l.cards.map(c => {
        const nowStr = new Date().toISOString()
        if (!c.description) {
          c.description = ''
        }
        if (!c.createdAt) {
          c.createdAt = nowStr
        }
        if (!c.updatedAt) {
          c.updatedAt = nowStr
        }
        return c
      })
      return { ...l, cards: cardsUpdated }
    })
    return { ...b, lists: listsUpdated }
  })
  return { boards: boardsUpdaetd }
}

export class ApplicationService {
  repository: Repository

  constructor(
    repository: Repository
  ) {
    this.repository = repository
  }

  // Utils
  clear(): State {
    this.repository.remove()
    return { boards: [] }
  }
  load(): State {
    const result = this.repository.get()
    const resultUpdated = migrateState(result)
    return resultUpdated
  }
  // import
  import(state: State, stateImport: State): State {
    const updated = { boards: [...stateImport.boards, ...state.boards] }
    this.repository.set(updated)
    return updated
  }
  // Board
  createBoard(state: State, name: string): State {
    const board: Board = {
      id: uuidv4(),
      name: name,
      lists: []
    }
    const updated = { boards: [board, ...state.boards] }
    this.repository.set(updated)
    return updated
  }
  deleteBoard(state: State, id: string): State {
    const updated = { boards: [...state.boards.filter(b => b.id !== id)] }
    this.repository.set(updated)
    return updated
  }
  moveBoard(state: State, draggingBoardId: string, pos: Pos, dropTargetBoardId: string): State {
    const board = state.boards.find(b => b.id === draggingBoardId)
    if (board) {
      switch (pos) {
        case 'first':
          const updatedAtFirst = { boards: [board, ...state.boards.filter(b => b.id !== draggingBoardId)] }
          this.repository.set(updatedAtFirst)
          return updatedAtFirst
        case 'middle':
          const idxDragging = state.boards.findIndex(b => b.id === draggingBoardId)
          const idxDropTarget = state.boards.findIndex(b => b.id === dropTargetBoardId)
          const found = state.boards.find(b => b.id === draggingBoardId)
          if (found) {
            const stateDeleted = { boards: state.boards.filter(b => b.id !== draggingBoardId) }
            const idx = stateDeleted.boards.findIndex(b => b.id === dropTargetBoardId)
            const idxSlice = (idxDragging < idxDropTarget) ? (idx + 1) : ((idxDropTarget < idxDragging) ? idx : 0)
            const updatedAtMiddle = { boards: [...stateDeleted.boards.slice(0, idxSlice), found, ...stateDeleted.boards.slice(idxSlice)] }
            this.repository.set(updatedAtMiddle)
            return updatedAtMiddle
          } else {
            throw Error('moveBoard failed')
          }
        case 'last':
          const updatedAtLast = { boards: [...state.boards.filter(b => b.id !== draggingBoardId), board] }
          this.repository.set(updatedAtLast)
          return updatedAtLast
        default:
          break
      }
    }
    return state
  }
  updateBoardName(state: State, name: string, boardId: string) {
    const updated = {
      boards: state.boards.map(b => {
        return (b.id === boardId) ? { ...b, name: name } : b
      })
    }
    this.repository.set(updated)
    return updated
  }
  // List
  createList(state: State, name: string, boardId: string): State {
    const list: List = {
      id: uuidv4(),
      name: name,
      cards: []
    }
    const updated = {
      boards: state.boards.map(b => {
        return (b.id === boardId) ? { ...b, lists: [...b.lists, list] } : b
      })
    }
    this.repository.set(updated)
    return updated
  }
  deleteList(state: State, id: string, boardId: string): State {
    const updated = {
      boards: state.boards.map(b => {
        return (b.id === boardId) ? { ...b, lists: b.lists.filter(l => l.id !== id) } : b
      })
    }
    this.repository.set(updated)
    return updated
  }
  findList(state: State, id: string, boardId: string): List | undefined {
    return state.boards.find(b => b.id === boardId)?.lists.find(l => l.id === id)
  }
  moveList(state: State, draggingListId: string, boardId: string, dropTargetListId: string, pos: Pos): State {
    const board = state.boards.find(b => b.id === boardId)
    if (board) {
      const idxDragging = board.lists.findIndex(b => b.id === draggingListId)
      const idxDropTarget = board.lists.findIndex(b => b.id === dropTargetListId)
      const found = board.lists.find(l => l.id === draggingListId)
      const listsDeleted = board.lists.filter(l => l.id !== draggingListId)
      if (found) {
        switch (pos) {
          case 'first':
            const listsUpdatedAtFirst = [found, ...listsDeleted]
            const updatedAtFirst: State = {
              boards: state.boards.map(b => {
                return (b.id === boardId) ? { ...b, lists: listsUpdatedAtFirst } : b
              })
            }
            this.repository.set(updatedAtFirst)
            return updatedAtFirst
          case 'middle':
            const idx = listsDeleted.findIndex(l => l.id === dropTargetListId)
            const idxSlice = (idxDragging < idxDropTarget) ? (idx + 1) : ((idxDropTarget < idxDragging) ? idx : 0)
            const listsUpdated = [...listsDeleted.slice(0, idxSlice), found, ...listsDeleted.slice(idxSlice)]
            const updatedAtMiddle: State = {
              boards: state.boards.map(b => {
                return (b.id === boardId) ? { ...b, lists: listsUpdated } : b
              })
            }
            this.repository.set(updatedAtMiddle)
            return updatedAtMiddle
          case 'last':
            const listsUpdatedAtLast = [...listsDeleted, found]
            const updatedAtLast: State = {
              boards: state.boards.map(b => {
                return (b.id === boardId) ? { ...b, lists: listsUpdatedAtLast } : b
              })
            }
            this.repository.set(updatedAtLast)
            return updatedAtLast
          default:
            break
        }
      }
    }
    return state
  }
  updateListName(state: State, name: string, boardId: string, listId: string) {
    const updated = {
      boards: state.boards.map(b => {
        if (b.id === boardId) {
          return {
            ...b, lists: b.lists.map(l => {
              return (l.id === listId) ? { ...l, name: name } : l
            })
          }
        } else {
          return b
        }
      })
    }
    this.repository.set(updated)
    return updated
  }
  // Card
  createCard(state: State, name: string, boardId: string, listId: string): State {
    const now = new Date()
    const card: Card = {
      id: uuidv4(),
      name: name,
      description: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
    const board = state.boards.find(b => b.id === boardId)
    if (board) {
      const updatedLists = board.lists.map(l => {
        return (l.id === listId) ? { ...l, cards: [...l.cards, card] } : l
      })
      const updated = {
        boards: state.boards.map(b => {
          return (b.id === boardId) ? { ...b, lists: updatedLists } : b
        })
      }
      this.repository.set(updated)
      return updated
    }
    return state
  }
  deleteCard(state: State, cardId: string, boardId: string, listId: string): State {
    const board = state.boards.find(b => b.id === boardId)
    if (board) {
      const updatedLists = board.lists.map(l => {
        return (l.id === listId) ? { ...l, cards: l.cards.filter(c => c.id !== cardId) } : l
      })
      const updated = {
        boards: state.boards.map(b => {
          return (b.id === boardId) ? { ...b, lists: updatedLists } : b
        })
      }
      this.repository.set(updated)
      return updated
    }
    return state
  }
  deleteCardsByList(state: State, listId: string, boardId: string): State {
    const board = state.boards.find(b => b.id === boardId)
    if (board) {
      const updatedLists = board.lists.map(l => {
        return (l.id === listId) ? { ...l, cards: [] } : l
      })
      const updated = {
        boards: state.boards.map(b => {
          return (b.id === boardId) ? { ...b, lists: updatedLists } : b
        })
      }
      this.repository.set(updated)
      return updated
    }
    return state
  }
  moveCard(
    state: State,
    draggingCardId: string,
    draggingCardBoardId: string,
    draggingCardListId: string,
    pos: Pos,
    dropTargetCardId: string,
    dropTargetBoardId: string,
    dropTargetListId: string
  ): State {
    const found = this.findCard(state, draggingCardId, draggingCardBoardId, draggingCardListId)
    const foundList = this.findList(state, draggingCardListId, draggingCardBoardId)
    const foundListDropTarget = this.findList(state, dropTargetListId, dropTargetBoardId)
    if (found && foundList && foundListDropTarget) {
      const idxDragging = foundList.cards.findIndex(c => c.id === draggingCardId)
      const idxDropTarget = foundListDropTarget.cards.findIndex(c => c.id === dropTargetCardId)
      const stateDeleted = this.deleteCard(state, draggingCardId, draggingCardBoardId, draggingCardListId)
      const dropTargetBoard = stateDeleted.boards.find(b => b.id === dropTargetBoardId)
      if (dropTargetBoard) {
        switch (pos) {
          case 'first':
            const listsUpdatedAtFirst = dropTargetBoard.lists.map(l => {
              return (l.id === dropTargetListId) ? { ...l, cards: [found, ...l.cards] } : l
            })
            const updatedAtFirst = {
              boards: stateDeleted.boards.map(b => {
                return (b.id === dropTargetBoardId) ? { ...b, lists: listsUpdatedAtFirst } : b
              })
            }
            this.repository.set(updatedAtFirst)
            return updatedAtFirst
          case 'middle':
            if (draggingCardListId === dropTargetListId) {
              if (idxDropTarget) {
                const dropTargetList = dropTargetBoard.lists.find(l => l.id === dropTargetListId)
                if (dropTargetList) {
                  const idx = dropTargetList.cards.findIndex(c => c.id === dropTargetCardId)
                  const idxSlice = (idxDragging < idxDropTarget) ? (idx + 1) : ((idxDropTarget < idxDragging) ? idx : 0)
                  const updatedAtMiddle: State = {
                    boards: stateDeleted.boards.map(b => {
                      if (b.id === dropTargetBoardId) {
                        return {
                          ...b, lists: b.lists.map(l => {
                            if (l.id === dropTargetListId) {
                              return { ...l, cards: [...l.cards.slice(0, idxSlice), found, ...l.cards.slice(idxSlice)] }
                            } else {
                              return l
                            }
                          })
                        }
                      } else {
                        return b
                      }
                    })
                  }
                  this.repository.set(updatedAtMiddle)
                  return updatedAtMiddle
                }
              }
            } else {
              const updatedAtMiddle: State = {
                boards: stateDeleted.boards.map(b => {
                  if (b.id === dropTargetBoardId) {
                    return {
                      ...b, lists: b.lists.map(l => {
                        if (l.id === dropTargetListId) {
                          return { ...l, cards: [...l.cards.slice(0, idxDropTarget), found, ...l.cards.slice(idxDropTarget)] }
                        } else {
                          return l
                        }
                      })
                    }
                  } else {
                    return b
                  }
                })
              }
              this.repository.set(updatedAtMiddle)
              return updatedAtMiddle
            }
            break
          case 'last':
            if (draggingCardListId === dropTargetListId) {
              const listsUpdatedAtLast = dropTargetBoard.lists.map(l => {
                return (l.id === dropTargetListId) ? { ...l, cards: [...l.cards, found] } : l
              })
              const updatedAtLast = {
                boards: stateDeleted.boards.map(b => {
                  return (b.id === dropTargetBoardId) ? { ...b, lists: listsUpdatedAtLast } : b
                })
              }
              this.repository.set(updatedAtLast)
              return updatedAtLast
            } else {
              const updatedAtLast: State = {
                boards: stateDeleted.boards.map(b => {
                  if (b.id === dropTargetBoardId) {
                    return {
                      ...b, lists: b.lists.map(l => {
                        if (l.id === dropTargetListId) {
                          return { ...l, cards: [...l.cards.slice(0, idxDropTarget), found, ...l.cards.slice(idxDropTarget)] }
                        } else {
                          return l
                        }
                      })
                    }
                  } else {
                    return b
                  }
                })
              }
              this.repository.set(updatedAtLast)
              return updatedAtLast
            }
          default:
            break
        }
      }
    }
    return state
  }
  findCard(state: State, id: string, boardId: string, listId: string) {
    return state.boards.find(b => b.id === boardId)?.lists.find(l => l.id === listId)?.cards.find(b => b.id === id)
  }
  findCardFromBoard(state: State, id: string, boardId: string) {
    return state.boards.find(b => b.id === boardId)?.lists.map(l => l.cards.find(b => b.id === id)).filter(c => c)[0]
  }
  findCardListIdFromBoard(state: State, id: string, boardId: string) {
    let listId
    state.boards.map(b => {
      if (b.id === boardId) {
        b.lists.map(l => {
          const found = l.cards.find(c => c.id === id)
          if (found) {
            listId = l.id
          }
        })
      }
    })
    return listId
  }
  moveCardToAnotherList(state: State, id: string, boardId: string, listIdSrc: string, listIdDst: string) {
    const found = this.findCard(state, id, boardId, listIdSrc)
    if (found && (listIdSrc !== listIdDst)) {
      const stateDeleted = this.deleteCard(state, id, boardId, listIdSrc)
      const updated: State = {
        boards: stateDeleted.boards.map(b => {
          if (b.id === boardId) {
            return {
              ...b, lists: b.lists.map(l => {
                return (l.id === listIdDst) ? { ...l, cards: [found, ...l.cards] } : l
              })
            }
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
  moveCardToLastOfAnotherList(state: State, id: string, boardId: string, listIdSrc: string, listIdDst: string) {
    const found = this.findCard(state, id, boardId, listIdSrc)
    if (found && (listIdSrc !== listIdDst)) {
      const stateDeleted = this.deleteCard(state, id, boardId, listIdSrc)
      const updated: State = {
        boards: stateDeleted.boards.map(b => {
          if (b.id === boardId) {
            return {
              ...b, lists: b.lists.map(l => {
                return (l.id === listIdDst) ? { ...l, cards: [...l.cards, found] } : l
              })
            }
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
  updateCardName(state: State, cardId: string, name: string, boardId: string, listId: string): State {
    const now = new Date()
    const updated = {
      boards: state.boards.map(b => {
        return ((b.id === boardId)
          ? {
            ...b, lists: b.lists.map(l => {
              return ((l.id === listId)
                ? {
                  ...l, cards: l.cards.map(c => {
                    return ((c.id === cardId)
                      ? { ...c, name: name, updatedAt: now.toISOString() }
                      : c)
                  }
                  )
                }
                : l
              )
            })
          }
          : b
        )
      })
    }
    this.repository.set(updated)
    return updated
  }
  updateCardDescription(state: State, cardId: string, description: string, boardId: string, listId: string): State {
    const now = new Date()
    const updated = {
      boards: state.boards.map(b => {
        return ((b.id === boardId)
          ? {
            ...b, lists: b.lists.map(l => {
              return ((l.id === listId)
                ? {
                  ...l, cards: l.cards.map(c => {
                    return ((c.id === cardId)
                      ? { ...c, description: description, updatedAt: now.toISOString() }
                      : c)
                  }
                  )
                }
                : l
              )
            })
          }
          : b
        )
      })
    }
    this.repository.set(updated)
    return updated
  }
}
