import { useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { Signal } from '@preact/signals'
import { CardForm } from './CardForm'
import { BoardHeader } from './BoardHeader'
import { ListHeader } from './ListHeader'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { Pos } from '../types/pos'
import { State } from '../types/state'
import { CardList } from './CardList'

type PageBoardProps = {
  board_id?: string
  path: string
  appState: Signal<State>
}

export type AddCardParams = {
  listId: string
  cardName: string
}

export function PageBoard(props: PageBoardProps) {
  const {appState} = props
  const [draggingCardId, setDraggingCardId] = useState<string | undefined>(undefined)
  const [draggingCardListId, setDraggingCardListId] = useState<string | undefined>(undefined)
  const [draggingListId, setDraggingListId] = useState<string | undefined>(undefined)
  const inputElement = useRef<HTMLInputElement>(null)
  const [dragEnteredListId, setDragEnteredListId] = useState<string | undefined>(undefined)
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  const updateState = (state: State) => {
    appState.value = state
  }

  const handleClickDeleteCard = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    const {cardId, listId} = e.currentTarget.dataset
    if (cardId && listId && props.board_id) {
      const updated = service.deleteCard(appState.value, cardId, props.board_id, listId)
      updateState(updated)
    }
  }

  const handleClickDeleteList = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    const {listId} = e.currentTarget.dataset
    if (listId && props.board_id) {
      const updated = service.deleteList(appState.value, listId, props.board_id)
      updateState(updated)
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
        const updated = service.moveCardToAnotherList(appState.value, draggingCardId, props.board_id, draggingCardListId, listId)
        updateState(updated)
      } else if (!draggingCardId && draggingListId && listId) {
        const updated = service.moveList(appState.value, draggingListId, props.board_id, listId, listPos as Pos)
        updateState(updated)
      }
    }
  }

  const handleDropOnSpacer = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {listId, spacer} = e.currentTarget.dataset
    if (listId && spacer && draggingCardId && props.board_id && draggingCardListId) {
      const updated = service.moveCardToLastOfAnotherList(appState.value, draggingCardId, props.board_id, draggingCardListId, listId)
      updateState(updated)
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
      const updated = service.updateListName(appState.value, name, props.board_id, id)
      updateState(updated)
    }
  }

  const addCard = (params: AddCardParams) => {
    if (props.board_id) {
      const updated = service.createCard(appState.value, params.cardName, props.board_id, params.listId)
      updateState(updated)
    }
  }

  const moveCard = (pos: Pos, dropTargetCardId: string, dropTargetBoardId: string, dropTargetListId: string) => {
    if (draggingCardId && draggingCardListId) {
      const updated = service.moveCard(appState.value, draggingCardId, dropTargetBoardId, draggingCardListId, pos, dropTargetCardId, dropTargetBoardId, dropTargetListId)
      updateState(updated)
    }
  }

  const updateCardName = (id: string, name: string, listId: string) => {
    if (props.board_id) {
      const updated = service.updateCardName(appState.value, id, name, props.board_id, listId)
      updateState(updated)
    }
  }

  const deleteBoard = (id: string) => {
    const updated = service.deleteBoard(appState.value, id)
    updateState(updated)
  }

  const updateBoardName = (id: string, name: string) => {
    const updated = service.updateBoardName(appState.value, name, id)
    updateState(updated)
  }

  const handleSubmitList = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current) {
      if (props.board_id) {
        const updated = service.createList(appState.value, inputElement.current.value, props.board_id)
        updateState(updated)
        inputElement.current.value = ''
      }
    }
  }

  const handleDragEnterCard = (e: JSX.TargetedEvent<HTMLDivElement>) => {
    const {listId} = e.currentTarget.dataset
    setDragEnteredListId(listId)
  }

  const found = appState.value.boards.find(b => {
    return b.id === props.board_id
  })

  return (
    <div class="flex-column h-full">
      {found &&
        <div class="px-3">
          <BoardHeader
            id={found.id}
            name={found.name}
            updateBoardName={updateBoardName}
            deleteBoard={deleteBoard}
          />
        </div>
      }
      <div class="f-1 flex-row layout-stack-horizontal overflow-x-auto px-3 pattern-scrollbar-thick">
        {found && found.lists.map((list, idx) =>
          <div class="flex-column">
            <div
              class="w-64 p-3 bg-secondary rounded-2 layout-stack-4 drop-shadow"
              draggable
              onDrop={handleDropOnList}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEndList}
              onDragStart={handleDragStartList}
              data-list-id={list.id}
              data-list-pos={idx === 0 ? "first" : (idx === (found.lists.length - 1) ? "last" : "middle")}
            >
              <ListHeader
                id={list.id}
                name={list.name}
                updateListName={updateListName}
                handleClickDeleteList={handleClickDeleteList}
              />
              <CardForm
                listId={list.id}
                addCard={addCard}
              />
              <CardList
                cards={list.cards}
                listId={list.id}
                isDragEnterCardFromTheOther={!!draggingCardListId && (list.id !== draggingCardListId) && (list.id === dragEnteredListId)}
                updateCardName={updateCardName}
                handleClickDeleteCard={handleClickDeleteCard}
                handleDragEndCard={handleDragEndCard}
                handleDragEnterCard={handleDragEnterCard}
                handleDragStartCard={handleDragStartCard}
                handleDropOnCard={handleDropOnCard}
                handleDropOnSpacer={handleDropOnSpacer}
              />
            </div>
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
    </div>
  )
}
