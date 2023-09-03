import { v4 as uuidv4 } from 'uuid'
import '../app.css'
import { Board } from '../types/board'
import { AppLayout } from './AppLayout'
import { BoardForm } from './BoardForm'
import { BoardItem } from './BoardItem'
import { CardForm } from './CardForm'
import { CardItem } from './CardItem'

type PageComponentsProps = {
  path: string
}

export function PageComponents(props: PageComponentsProps) {
  console.log(props)

  const board: Board = {
    id: uuidv4(),
    name: 'Board 1',
    lists: []
  }

  return (
    <AppLayout>
      <div class="layout-stack-4">
        <div>
          <h2>Components</h2>
        </div>
        <div class="layout-stack-4">
          <div>
            <h3>BoardForm</h3>
            <div>
              <BoardForm
                addBoard={() => {}}
              />
            </div>
          </div>
          <div>
            <h3>BoardItem</h3>
            <div>
              <BoardItem
                board={board}
                pos="first"
                handleDragEnd={() => {}}
                handleDragOver={() => {}}
                handleDragStart={() => {}}
                handleDrop={() => {}}
              />
            </div>
          </div>
          <div>
            <h3>CardForm</h3>
            <div>
              <CardForm
                listId={'list1'}
                addCard={() => {}}
              />
            </div>
          </div>
          <div>
            <h3>CardItem</h3>
            <div>
              <CardItem
                id={'card1'}
                listId={'list1'}
                name={'Card 1'}
                pos={'first'}
                updateCardName={() => {}}
                handleClickDelete={() => {}}
                handleDragEnd={() => {}}
                handleDragStart={() => {}}
                handleDrop={() => {}}
              />
            </div>
          </div>
        </div>
        <div>
          <h2>Sandbox</h2>
        </div>
        <div>
          <details class="pattern-dropdown">
            <summary class="w-8 h-8 border-solid border-1 border-color-primary flex-column rounded-2 cursor-pointer">
              <div class="m-auto">...</div>
            </summary>
            <div class="border-solid border-1 border-color-primary rounded-2 py-2">
              <ul class="list-style-none pl-0 py-0 m-0 text-secondary">
                <li class="h-8 px-4 py-2 hover cursor-pointer">Item 1</li>
                <li class="h-8 px-4 py-2 hover cursor-pointer">Item 2</li>
                <li class="h-8 px-4 py-2 hover cursor-pointer">Item 3</li>
              </ul>
            </div>
          </details>
        </div>
        <div>
          <div class="flex-row h-8">
            <div class="f-1">
            </div>
            <div class="w-8 overflow-hidden">
              <details class="pattern-dropdown">
                <summary class="w-8 h-8 border-solid border-1 border-color-primary flex-column rounded-2 cursor-pointer">
                  <div class="m-auto">...</div>
                </summary>
                <div class="border-solid border-1 border-color-primary rounded-2 py-2 r-3 t-1">
                  <ul class="list-style-none pl-0 py-0 m-0 text-secondary">
                    <li class="h-8 px-4 py-2 hover cursor-pointer">Item 1</li>
                    <li class="h-8 px-4 py-2 hover cursor-pointer">Item 2</li>
                    <li class="h-8 px-4 py-2 hover cursor-pointer">Item 3</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
