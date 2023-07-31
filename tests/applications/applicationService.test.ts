import { beforeEach, describe, expect, it } from 'vitest'
import { ApplicationService } from '../../src/applications/applicationService'
import { Repository } from '../../src/repositories/repository'
import { State } from '../../src/types/state'

class RepositoryObject implements Repository {
  obj: State

  constructor (obj: State) {
    this.obj = obj
  }
  set (state: State) {
    this.obj = state
    return
  }
  get (): State {
    return this.obj
  }
  remove () {
    this.obj = {boards: []}
    return
  }
}

describe('ApplicationService', () => {
  let service
  const id = '75a2e479-2170-4569-af30-fd1323f66082'
  const state = {
    boards: [
      {
        id: id,
        name: 'board1',
        lists: []
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
    const updated = service.deleteBoard(state, id)
    expect(updated.boards.length).toEqual(0)
  })
  it.skip('createList', () => {
  })
  it.skip('deleteList', () => {
  })
  it.skip('createCard', () => {
  })
  it.skip('deleteCard', () => {
  })
})
