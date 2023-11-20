import { v4 as uuidv4 } from 'uuid'
import { Board } from '../types/board'
import BoardItem from './BoardItem'
import CardForm from './CardForm'
import CardItem from './CardItem'
import BoardList from './BoardList'
import CardList from './CardList'
import TheNavBar from './TheNavBar'
import TheFooter from './TheFooter'
import { Card } from '../types/card'
import { List } from '../types/list'
import BoardHeader from './BoardHeader'
import { signal } from '@preact/signals'
import AppButton from './AppButton'
import ListHeader from './ListHeader'

export default function PageComponents() {
  const board1: Board = {
    id: uuidv4(),
    name: 'Board 1',
    lists: []
  }
  const board2: Board = {
    id: uuidv4(),
    name: 'Board 2',
    lists: []
  }
  const board3: Board = {
    id: uuidv4(),
    name: 'Board 3',
    lists: []
  }
  const boards: Board[] = [
    board1, board2, board3
  ]
  const now = new Date().toISOString()
  const card1: Card = {
    id: uuidv4(),
    name: 'Card 1',
    description: '',
    createdAt: now,
    updatedAt: now
  }
  const card2: Card = {
    id: uuidv4(),
    name: 'Card 2',
    description: '',
    createdAt: now,
    updatedAt: now
  }
  const card3: Card = {
    id: uuidv4(),
    name: 'Card 3',
    description: '',
    createdAt: now,
    updatedAt: now
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
          <h3>AppButton</h3>
          <div>
            <AppButton
              text="Button"
              onClick={() => { }}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>BoardHeader</h3>
          <div>
            <BoardHeader
              id={board1.id}
              name={board1.name}
              updateBoardName={() => { }}
              deleteBoard={() => { }}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>BoardItem</h3>
          <div>
            <BoardItem
              board={board1}
              pos="first"
              cardsNum={8}
              handleDragEnd={() => { }}
              handleDragOver={() => { }}
              handleDragStart={() => { }}
              handleDrop={() => { }}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>BoardList</h3>
          <div>
            <BoardList
              boards={boards}
              handleDragEnd={() => { }}
              handleDragOver={() => { }}
              handleDragStart={() => { }}
              handleDrop={() => { }}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h2>BoardHeader</h2>
          <div>
            <BoardHeader
              id={board1.id}
              name={board1.name}
              updateBoardName={() => { }}
              deleteBoard={() => { }}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>CardForm</h3>
          <div>
            <CardForm
              listId={'list1'}
              addCard={() => { }}
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
              hasDescription={true}
              deleteCard={() => { }}
              updateCardName={() => { }}
              handleDragEnd={() => { }}
              handleDragStart={() => { }}
              handleDrop={() => { }}
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
              deleteCard={() => { }}
              updateCardName={() => { }}
              handleDragEndCard={() => { }}
              handleDragEnterCard={() => { }}
              handleDragStartCard={() => { }}
              handleDropOnCard={() => { }}
              handleDropOnSpacer={() => { }}
            />
          </div>
        </div>
        <div class="layout-stack-2">
          <h3>ListHeader</h3>
          <div>
            <ListHeader
              id={list1.id}
              name={list1.name}
              cardsNum={0}
              updateListName={() => { }}
              handleClickDeleteList={() => { }}
              handleClickDeleteCards={() => { }}
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
    </div>
  )
}
