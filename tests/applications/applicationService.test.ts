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

  beforeEach(() => {
  })
  it('createBoard', () => {
    const state = {boards: []}
    const repository = new RepositoryObject(state)
    service = new ApplicationService(repository)
    const updated = service.createBoard(state, 'board1')
    expect(updated.boards.length).toEqual(1)
  })
})
