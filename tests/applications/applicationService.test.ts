import { beforeEach, describe, expect, it } from 'vitest'
import { ApplicationService } from '../../src/applications/applicationService'

describe('ApplicationService', () => {
  let service

  beforeEach(() => {
    service = new ApplicationService()
  })
  it('createBoard', () => {
    const state = {boards: []}
    const updated = service.createBoard(state, 'board1')
    expect(updated.length).toEqual(1)
  })
})
