import { v4 as uuidv4 } from 'uuid'
import { beforeEach, describe, expect, it } from 'vitest'
import { ApplicationService } from '../../src/applications/applicationService'
import { Repository } from '../../src/repositories/repository'
import { State } from '../../src/types/state'

class RepositoryObject implements Repository {
  obj: State

  constructor(obj: State) {
    this.obj = obj
  }
  set(state: State) {
    this.obj = state
    return
  }
  get(): State {
    return this.obj
  }
  remove() {
    this.obj = { boards: [] }
    return
  }
}

describe('ApplicationService', () => {
  let service: ApplicationService
  const boardId1 = uuidv4()
  const listId1 = uuidv4()
  const cardId1 = uuidv4()
  const now = new Date()
  const state = {
    boards: [
      {
        id: boardId1,
        name: 'board1',
        lists: [
          {
            id: listId1,
            name: 'list1',
            cards: [
              {
                id: cardId1,
                name: 'card 1',
                description: '',
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
              }
            ]
          }
        ]
      }
    ]
  }

  beforeEach(() => {
    const repository = new RepositoryObject(state)
    service = new ApplicationService(repository)
  })
  it('createBoard', () => {
    const updated = service.createBoard(state, 'board2')
    expect(updated.boards.length).toEqual(2)
  })
  it('deleteBoard', () => {
    const updated = service.deleteBoard(state, boardId1)
    expect(updated.boards.length).toEqual(0)
  })
  it('createList', () => {
    const updated = service.createList(state, 'list2', boardId1)
    expect(updated.boards.find(b => b.id === boardId1)?.lists.length).toEqual(2)
  })
  it('deleteList', () => {
    const updated = service.deleteList(state, listId1, boardId1)
    expect(updated.boards.find(b => b.id === boardId1)?.lists.length).toEqual(0)
  })
  it('createCard', () => {
    const updated = service.createCard(state, 'card2', boardId1, listId1)
    expect(updated.boards.find(b => b.id === boardId1)?.lists.find(l => l.id === listId1)?.cards.length).toEqual(2)
  })
  it('deleteCard', () => {
    const updated = service.deleteCard(state, cardId1, boardId1, listId1)
    expect(updated.boards.find(b => b.id === boardId1)?.lists.find(l => l.id === listId1)?.cards.length).toEqual(0)
  })
  it('updateCardName', () => {
    const cardBefore = service.findCard(state, cardId1, boardId1, listId1)
    const updated = service.updateCardName(state, cardId1, 'updated', boardId1, listId1)
    const cardAfter = updated.boards.find(b => b.id === boardId1)?.lists.find(l => l.id === listId1)?.cards.find(c => c.id === cardId1)
    if (cardAfter && cardBefore) {
      expect(cardAfter.name).toEqual('updated')
      expect(new Date(cardAfter.updatedAt).getTime()).toBeGreaterThan(new Date(cardBefore.updatedAt).getTime())
    }
  })
})
