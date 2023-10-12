import { v4 as uuidv4 } from 'uuid'
import AppButton from "./AppButton"
import { State } from '../types/state'
import { RepositoryLocalStorage } from '../repositories/repository'
import { ApplicationService } from '../applications/applicationService'
import { Signal } from '@preact/signals'
import { Card } from '../types/card'

const createCards = (startNum: number, endNum: number): Card[] => {
  const d = new Date().toISOString()
  return [...Array(endNum - startNum + 1).keys()].map(n => {
    return {
      id: uuidv4(),
      name: `Card ${startNum + n}`,
      description: '',
      createdAt: d,
      updatedAt: d
    }
  })
}

export default function PageDebug({ appState }: { appState: Signal<State> }) {
  const createSampleData = () => {
    const repository = new RepositoryLocalStorage()
    const service = new ApplicationService(repository)
    const state: State = {
      boards: [
        {
          id: uuidv4(),
          name: 'Board 1',
          lists: [
            {
              id: uuidv4(),
              name: 'List 1',
              cards: createCards(1, 20)
            },
            {
              id: uuidv4(),
              name: 'List 2',
              cards: createCards(21, 25)
            },
            {
              id: uuidv4(),
              name: 'List 3',
              cards: createCards(26, 45)
            },
            {
              id: uuidv4(),
              name: 'List 4',
              cards: createCards(46, 52)
            },
          ]
        }
      ]
    }
    service.import(appState.value, state)
  }

  return (
    <div class="layout-center">
      <div class="p-4">
        <div class="layout-stack-4">
          <h2>Debug</h2>
          <div class="layout-stack-4">
            <AppButton
              text="Create sample data"
              onClick={createSampleData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
