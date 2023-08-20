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
      <div class="">
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
                deleteBoard={() => {}}
                updateBoardName={() => {}}
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
      </div>
    </AppLayout>
  )
}
