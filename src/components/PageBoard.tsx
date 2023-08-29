import '../app.css'
import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { AppLayout } from './AppLayout'
import { CardForm } from './CardForm'
import { BoardHeader } from './BoardHeader'
import { CardItem } from './CardItem'
import { ListHeader } from './ListHeader'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { List } from '../types/list'
import { Pos } from '../types/pos'
import { State } from '../types/state'

type PageBoardProps = {
  board_id?: string
  path: string
}

export type BoardState = {
  lists: List[]
}

export type AddCardParams = {
  listId: string
  cardName: string
}

export function PageBoard(props: PageBoardProps) {
  console.log('props', props)
  const [state, setState] = useState<State>({ boards: [] })
  const [boardState, setBoardState] = useState<BoardState>({ lists: [] })
  const [draggingCardId, setDraggingCardId] = useState<string | undefined>(undefined)
  const [draggingCardListId, setDraggingCardListId] = useState<string | undefined>(undefined)
  const [draggingListId, setDraggingListId] = useState<string | undefined>(undefined)
  const inputElement = useRef<HTMLInputElement>(null)
  const [boardName, setBoardName] = useState("")
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  useEffect(() => {
    const result = service.load()
    if (result) {
      setState(result)
      const b = result.boards.find(x => x.id === props.board_id)
      if (b) {
        setBoardState(b)
        setBoardName(b.name)
      }
    }
  }, [])

  const updateStates = (state: State) => {
    setState(state)
    const board = state.boards.find(b => b.id === props.board_id)
    if (board) {
      setBoardState(board)
    }
  }

  const handleClickDeleteCard = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    const {cardId, listId} = e.currentTarget.dataset
    if (cardId && listId && props.board_id) {
      const updated = service.deleteCard(state, cardId, props.board_id, listId)
      updateStates(updated)
    }
  }

  const handleClickDeleteList = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    const {listId} = e.currentTarget.dataset
    if (listId && props.board_id) {
      const updated = service.deleteList(state, listId, props.board_id)
      updateStates(updated)
    }
  }

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLDivElement>) => e.preventDefault()

  const handleDragEndCard = () => {
    setDraggingCardId(undefined)
    setDraggingCardListId(undefined)
  }

  const handleDragStartCard = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
    const {cardId, listId} = e.currentTarget.dataset
    setDraggingCardId(cardId)
    setDraggingCardListId(listId)
  }

  const handleDropOnCard = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {cardId, listId, pos} = e.currentTarget.dataset
    if (pos && cardId && listId && props.board_id) {
      moveCard(pos as Pos, cardId, props.board_id, listId)
    }
  }

  const handleDropOnList = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {listId, listPos} = e.currentTarget.dataset
    if (props.board_id) {
      if (draggingCardId && draggingCardListId && listId) {
        const updated = service.moveCardToAnotherList(state, draggingCardId, props.board_id, draggingCardListId, listId)
        updateStates(updated)
      } else if (!draggingCardId && draggingListId && listId) {
        const updated = service.moveList(state, draggingListId, props.board_id, listId, listPos as Pos)
        updateStates(updated)
      }
    }
  }

  const handleDragEndList = () => {
    setDraggingListId(undefined)
  }

  const handleDragStartList = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
    const {listId} = e.currentTarget.dataset
    if (listId) {
      setDraggingListId(listId)
    }
  }

  const updateListName = (id: string, name: string) => {
    if (props.board_id) {
      const updated = service.updateListName(state, name, props.board_id, id)
      updateStates(updated)
    }
  }

  const addCard = (params: AddCardParams) => {
    if (props.board_id) {
      const updated = service.createCard(state, params.cardName, props.board_id, params.listId)
      updateStates(updated)
    }
  }

  const moveCard = (pos: Pos, dropTargetCardId: string, dropTargetBoardId: string, dropTargetListId: string) => {
    if (draggingCardId && draggingCardListId) {
      const updated = service.moveCard(state, draggingCardId, dropTargetBoardId, draggingCardListId, pos, dropTargetCardId, dropTargetBoardId, dropTargetListId)
      updateStates(updated)
    }
  }

  const updateCardName = (id: string, name: string, listId: string) => {
    if (props.board_id) {
      const updated = service.updateCardName(state, id, name, props.board_id, listId)
      setState(updated)
      const board = updated.boards.find(b => b.id === props.board_id)
      if (board) {
        setBoardState(board)
      }
    }
  }

  const updateBoardName = (id: string, name: string) => {
    const updated = service.updateBoardName(state, name, id)
    updateStates(updated)
    const board = updated.boards.find(b => b.id === props.board_id)
    if (board) {
      setBoardName(board.name)
    }
  }

  const handleSubmitList = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current) {
      if (props.board_id) {
        const updated = service.createList(state, inputElement.current.value, props.board_id)
        updateStates(updated)
        inputElement.current.value = ''
      }
    }
  }

  return (
    <AppLayout>
      <div>
        {props.board_id &&
          <BoardHeader
            id={props.board_id}
            name={boardName}
            updateBoardName={updateBoardName}
          />
        }
      </div>
      <div class="flex-row layout-stack-horizontal">
        {boardState.lists.length !== 0 && boardState.lists.map((list, idx) =>
          <div class="flex-column">
            <div
              class="w-64 p-4 bg-secondary rounded-2 layout-stack-4 drop-shadow"
              draggable
              onDrop={handleDropOnList}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEndList}
              onDragStart={handleDragStartList}
              data-list-id={list.id}
              data-list-pos={idx === 0 ? "first" : (idx === (boardState.lists.length - 1) ? "last" : "middle")}
            >
              <ListHeader
                id={list.id}
                name={list.name}
                updateListName={updateListName}
                handleClickDeleteList={handleClickDeleteList}
              />
              <div>
                <CardForm
                  listId={list.id}
                  addCard={addCard}
                />
              </div>
              <div class="overflow-y-auto">
                <div class="layout-stack-2 height-card-list">
                  {list.cards.map((card, idx) =>
                    <CardItem
                      key={card.id}
                      id={card.id}
                      listId={list.id}
                      name={card.name}
                      pos={idx === 0 ? "first" : (idx === (list.cards.length - 1) ? "last" : "middle")}
                      updateCardName={updateCardName}
                      handleClickDelete={handleClickDeleteCard}
                      handleDragEnd={handleDragEndCard}
                      handleDragStart={handleDragStartCard}
                      handleDrop={handleDropOnCard}
                    />
                  )}
                </div>
              </div>
            </div>
            <div class="f-1"></div>
          </div>
        )}
        <div class="p-4">
          <form onSubmit={handleSubmitList}>
            <input
              class="h-6 px-2 rounded-2 border-solid border-1 border-color-primary"
              type="text"
              placeholder="Enter list title..."
              ref={inputElement}
            />
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
