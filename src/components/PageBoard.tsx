import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { Signal } from '@preact/signals'
import { useLocation } from 'wouter-preact'
import CardForm from './CardForm'
import BoardHeader from './BoardHeader'
import ListHeader from './ListHeader'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { Pos } from '../types/pos'
import { State } from '../types/state'
import CardList from './CardList'
import { Card } from '../types/card'
import { filterListsByCardName } from '../utils'
import { BgColor } from '../types/bgColor'
import IconAdd from './IconAdd'
import IconFilterList from './IconFilterList'
import IconClose from './IconClose'
import { CardDialog } from './CardDialog'

export type AddCardParams = {
  listId: string
  cardName: string
}

export default function PageBoard(
  {
    appState,
    boardId,
    cardId
  }: {
    appState: Signal<State>,
    boardId: string,
    cardId?: string
  }
) {
  const [draggingCardId, setDraggingCardId] = useState<string | undefined>(undefined)
  const [draggingCardListId, setDraggingCardListId] = useState<string | undefined>(undefined)
  const [draggingListId, setDraggingListId] = useState<string | undefined>(undefined)
  const inputElement = useRef<HTMLInputElement>(null)
  const inputCardFilterElement = useRef<HTMLInputElement>(null)
  const [dragEnteredListId, setDragEnteredListId] = useState<string | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(cardId ? true : false)
  const [query, setQuery] = useState('')
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)
  const [dialogCard, setDialogCard] = useState<Card | undefined>(undefined)
  const [dialogCardListId, setDialogCardListId] = useState<string | undefined>(undefined)
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (cardId) {
      setIsDialogOpen(true)
    } else {
      setIsDialogOpen(false)
    }
  }, [cardId])

  useEffect(() => {
    if (isDialogOpen && cardId) {
      setDialogCard(service.findCardFromBoard(appState.value, cardId, boardId))
      setDialogCardListId(service.findCardListIdFromBoard(appState.value, cardId, boardId))
    } else {
      setDialogCard(undefined)
      setDialogCardListId(undefined)
    }
  }, [isDialogOpen])

  const updateState = (state: State) => {
    appState.value = state
  }

  const selectBgColor = (e: JSX.TargetedMouseEvent<HTMLInputElement>) => {
    if (e.currentTarget.value !== 'none') {
      const bgColor = e.currentTarget.value as BgColor
      const updated = service.updateBoardBgColor(appState.value, bgColor, boardId)
      updateState(updated)
    } else {
      const updated = service.updateBoardBgColor(appState.value, null, boardId)
      updateState(updated)
    }
  }

  const handleBlurDialogCardDescription = (e: JSX.TargetedFocusEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value
    if (dialogCard && dialogCardListId) {
      const updated = service.updateCardDescription(appState.value, dialogCard.id, value, boardId, dialogCardListId)
      updateState(updated)
      setDialogCard(service.findCardFromBoard(appState.value, dialogCard.id, boardId))
    }
  }

  const handleClickDeleteCard = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    const { cardId, listId } = e.currentTarget.dataset
    if (cardId && listId && boardId) {
      const updated = service.deleteCard(appState.value, cardId, boardId, listId)
      updateState(updated)
      setLocation(`/board/${boardId}`)
    }
  }

  const deleteCard = (cardId: string, listId: string) => {
    const updated = service.deleteCard(appState.value, cardId, boardId, listId)
    updateState(updated)
  }

  const handleClickDeleteCards = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    const { listId } = e.currentTarget.dataset
    if (listId && boardId) {
      const updated = service.deleteCardsByList(appState.value, listId, boardId)
      updateState(updated)
    }
  }

  const handleClickDeleteList = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    if (window.confirm("Do you really want to delete this list?")) {
      const { listId } = e.currentTarget.dataset
      if (listId && boardId) {
        const updated = service.deleteList(appState.value, listId, boardId)
        updateState(updated)
      }
    }
  }

  const handleClickMask = (_e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    setIsDialogOpen(false)
    setLocation(`/board/${boardId}`)
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
    const { cardId, listId } = e.currentTarget.dataset
    setDraggingCardId(cardId)
    setDraggingCardListId(listId)
  }

  const handleDropOnCard = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const { cardId, listId, pos } = e.currentTarget.dataset
    if (pos && cardId && listId && boardId) {
      moveCard(pos as Pos, cardId, boardId, listId)
    }
  }

  const handleDropOnList = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const { listId, listPos } = e.currentTarget.dataset
    if (boardId) {
      if (draggingCardId && draggingCardListId && listId) {
        const updated = service.moveCardToAnotherList(appState.value, draggingCardId, boardId, draggingCardListId, listId)
        updateState(updated)
      } else if (!draggingCardId && draggingListId && listId) {
        const updated = service.moveList(appState.value, draggingListId, boardId, listId, listPos as Pos)
        updateState(updated)
      }
    }
  }

  const handleDropOnSpacer = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const { listId, spacer } = e.currentTarget.dataset
    if (listId && spacer && draggingCardId && boardId && draggingCardListId) {
      const updated = service.moveCardToLastOfAnotherList(appState.value, draggingCardId, boardId, draggingCardListId, listId)
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
    const { listId } = e.currentTarget.dataset
    if (listId) {
      setDraggingListId(listId)
    }
  }

  const updateListName = (id: string, name: string) => {
    const updated = service.updateListName(appState.value, name, boardId, id)
    updateState(updated)
  }

  const addCard = (params: AddCardParams) => {
    const updated = service.createCard(appState.value, params.cardName, boardId, params.listId)
    updateState(updated)
  }

  const moveCard = (pos: Pos, dropTargetCardId: string, dropTargetBoardId: string, dropTargetListId: string) => {
    if (draggingCardId && draggingCardListId) {
      const updated = service.moveCard(appState.value, draggingCardId, dropTargetBoardId, draggingCardListId, pos, dropTargetCardId, dropTargetBoardId, dropTargetListId)
      updateState(updated)
    }
  }

  const updateCardName = (id: string, name: string, listId: string) => {
    const updated = service.updateCardName(appState.value, id, name, boardId, listId)
    updateState(updated)
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
      const updated = service.createList(appState.value, inputElement.current.value, boardId)
      updateState(updated)
      inputElement.current.value = ''
    }
  }

  const handleDragEnterCard = (e: JSX.TargetedEvent<HTMLDivElement>) => {
    const { listId } = e.currentTarget.dataset
    setDragEnteredListId(listId)
  }

  const handleSubmitDialogCardName = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const cardName = formData.get('cardName')?.toString()
    if (cardName && dialogCard && dialogCardListId) {
      const updated = service.updateCardName(appState.value, dialogCard.id, cardName, boardId, dialogCardListId)
      updateState(updated)
      setDialogCard(service.findCardFromBoard(appState.value, dialogCard.id, boardId))
    }
  }

  const found = appState.value.boards.find(b => {
    return b.id === boardId
  })

  const handleSubmit = (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = inputCardFilterElement.current?.value
    if (query) {
      setQuery(query)
    } else {
      setQuery('')
    }
  }

  const handleReset = () => {
    setQuery('')
  }

  return (
    <div class={`flex-column h-full layout-stack-2 bg-${found?.bgColor ? found.bgColor : 'primary'}`}>
      <div class="py-3 layout-stack-2">
        {found &&
          <div class="px-3 h-6">
            <BoardHeader
              id={found.id}
              name={found.name}
              bgColor={found.bgColor}
              updateBoardName={updateBoardName}
              selectBgColor={selectBgColor}
              deleteBoard={deleteBoard}
            />
          </div>
        }
        <div class="px-3 h-6">
          <form onSubmit={handleSubmit} onReset={handleReset} autocomplete="off">
            <div class="flex-row">
              <label for="card-filter">
                <div class="inline-block h-6 w-6 text-center border-solid border-1 border-color-primary bg-primary">
                  <IconFilterList />
                </div>
              </label>
              <input
                id="card-filter"
                type="text"
                class="w-48 h-6 px-2 bg-primary border-solid border-1 border-color-primary border-x-none"
                placeholder="Filter"
                ref={inputCardFilterElement}
              />
              <button
                type="reset"
                class="h-6 w-6 border-solid border-1 border-color-primary bg-primary text-secondary text-medium cursor-pointer"
              >
                <IconClose />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="f-1 flex-row layout-stack-horizontal-4 overflow-x-auto px-3 pattern-scrollbar-thick">
        {found && filterListsByCardName(query, found.lists).map((list, idx) =>
          <div class="flex-column">
            <div
              class="w-64 p-3 bg-secondary rounded-2 layout-stack-3 drop-shadow"
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
                cardsNum={list.cards.length}
                updateListName={updateListName}
                handleClickDeleteCards={handleClickDeleteCards}
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
                deleteCard={deleteCard}
                handleDragEndCard={handleDragEndCard}
                handleDragEnterCard={handleDragEnterCard}
                handleDragStartCard={handleDragStartCard}
                handleDropOnCard={handleDropOnCard}
                handleDropOnSpacer={handleDropOnSpacer}
              />
            </div>
          </div>
        )}
        <div class="py-3">
          <form onSubmit={handleSubmitList} autocomplete="off">
            <div class="flex-row">
              <label for="adding-list">
                <div class="inline-block h-6 w-6 text-center border-solid border-1 border-color-primary bg-primary text-primary flex-column bg-primary">
                  <IconAdd />
                </div>
              </label>
              <input
                id="adding-list"
                class="h-6 px-2 bg-primary border-solid border-1 border-color-primary border-l-none"
                type="text"
                placeholder="Enter list title..."
                ref={inputElement}
              />
            </div>
          </form>
        </div>
      </div>
      {dialogCardListId &&
        <CardDialog
          isOpen={isDialogOpen && !!dialogCard && !!dialogCardListId}
          card={dialogCard}
          cardListId={dialogCardListId}
          handleBlurCardDescription={handleBlurDialogCardDescription}
          handleClickDeleteCard={handleClickDeleteCard}
          handleClickMask={handleClickMask}
          handleSubmitCardName={handleSubmitDialogCardName}
        />
      }
    </div>
  )
}
