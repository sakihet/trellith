import { v4 as uuidv4 } from 'uuid'
import { Board } from '../types/board'
import { BoardForm } from './BoardForm'
import { BoardItem } from './BoardItem'
import { CardForm } from './CardForm'
import { CardItem } from './CardItem'
import { BoardList } from './BoardList'
import { CardList } from './CardList'
import { TheNavBar } from './TheNavBar'
import { TheFooter } from './TheFooter'
import { Card } from '../types/card'
import { List } from '../types/list'
import { BoardHeader } from './BoardHeader'
import { signal } from '@preact/signals'

type PageComponentsProps = {
  path: string
}

export function PageComponents(props: PageComponentsProps) {
  console.log(props)

  const board1: Board = {
    id: uuidv4(),
    name: 'Board 1',
    lists: []
  }
  const board2: Board = {
    id: uuidv4(),
    name: 'Board 1',
    lists: []
  }
  const board3: Board = {
    id: uuidv4(),
    name: 'Board 1',
    lists: []
  }
  const boards: Board[] = [
    board1, board2, board3
  ]
  const card1: Card = {
    id: uuidv4(),
    name: 'Card 1',
  }
  const card2: Card = {
    id: uuidv4(),
    name: 'Card 2'
  }
  const card3: Card = {
    id: uuidv4(),
    name: 'Card 3'
  }
  const cards = [card1, card2, card3]
  const list1: List = {
    id: uuidv4(),
    name: 'List 1',
    cards: cards
  }

  return (
    <div class="layout-stack-4 p-6">
      <div>
        <h2>Components</h2>
      </div>
      <div class="layout-stack-4">
        <div class="layout-stack-2">
          <h3>BoardForm</h3>
          <div>
            <BoardForm
              addBoard={() => {}}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>BoardItem</h3>
          <div>
            <BoardItem
              board={board1}
              pos="first"
              handleDragEnd={() => {}}
              handleDragOver={() => {}}
              handleDragStart={() => {}}
              handleDrop={() => {}}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>BoardList</h3>
          <div>
            <BoardList
              boards={boards}
              handleDragEnd={() => {}}
              handleDragOver={() => {}}
              handleDragStart={() => {}}
              handleDrop={() => {}}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h2>BoardHeader</h2>
          <div>
            <BoardHeader
              id={board1.id}
              name={board1.name}
              updateBoardName={() => {}}
              deleteBoard={() => {}}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>CardForm</h3>
          <div>
            <CardForm
              listId={'list1'}
              addCard={() => {}}
            />
          </div>
        </div>
        <div class="layout-stack-2">
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
        <div class="layout-stack-2">
          <h3>CardList</h3>
          <div>
            <CardList
              cards={cards}
              listId={list1.id}
              isDragEnterCardFromTheOther={false}
              updateCardName={() => {}}
              handleClickDeleteCard={() => {}}
              handleDragEndCard={() => {}}
              handleDragEnterCard={() => {}}
              handleDragStartCard={() => {}}
              handleDropOnCard={() => {}}
              handleDropOnSpacer={()=> {}}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>TheNavBar</h3>
          <div>
            <TheNavBar theme={signal("light")} />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>TheFooter</h3>
          <div>
            <TheFooter />
          </div>
        </div>
      </div>
      <hr />
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
  )
}
