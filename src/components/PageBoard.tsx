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
import { relativeTime } from '../utils'

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
  const [dragEnteredListId, setDragEnteredListId] = useState<string | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(cardId ? true : false)
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)
  const [dialogCard, setDialogCard] = useState<Card | undefined>(undefined)
  const [dialogCardListId, setDialogCardListId] = useState<string | undefined>(undefined)
  const [dialogCardEditingName, setDialogCardEditingName] = useState<boolean>(false)
  const [dialogCardEditingDescription, setDialogCardEditingDescription] = useState<boolean>(false)
  const refDialogCardNameInput = useRef<HTMLInputElement>(null)
  const refDialogCardDescriptionTextarea = useRef<HTMLTextAreaElement>(null)
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

  const handleBlurDialogCardDescription = () => {
    setDialogCardEditingDescription(false)
    if (refDialogCardDescriptionTextarea.current?.value && dialogCard && dialogCardListId) {
      const updated = service.updateCardDescription(appState.value, dialogCard.id, refDialogCardDescriptionTextarea.current.value, boardId, dialogCardListId)
      updateState(updated)
      setDialogCard(service.findCardFromBoard(appState.value, dialogCard.id, boardId))
    }
  }

  const handleBlurDialogCardName = () => {
    setDialogCardEditingName(false)
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
    const { listId } = e.currentTarget.dataset
    if (listId && boardId) {
      const updated = service.deleteList(appState.value, listId, boardId)
      updateState(updated)
    }
  }

  const handleClickDialogCardDescription = () => {
    setDialogCardEditingDescription(true)
    setTimeout(() => {
      refDialogCardDescriptionTextarea.current?.focus()
    }, 100)
  }

  const handleClickDialogCardName = () => {
    setDialogCardEditingName(true)
    setTimeout(() => {
      refDialogCardNameInput.current?.focus()
    }, 100)
  }

  const handleClickMask = () => {
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
    if (refDialogCardNameInput.current?.value && dialogCard && dialogCardListId) {
      const updated = service.updateCardName(appState.value, dialogCard.id, refDialogCardNameInput.current.value, boardId, dialogCardListId)
      updateState(updated)
      setDialogCardEditingName(false)
      setDialogCard(service.findCardFromBoard(appState.value, dialogCard.id, boardId))
    }
  }

  const found = appState.value.boards.find(b => {
    return b.id === boardId
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
      <div class="f-1 flex-row layout-stack-horizontal-4 overflow-x-auto px-3 pattern-scrollbar-thick">
        {found && found.lists.map((list, idx) =>
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
          <form onSubmit={handleSubmitList}>
            <div class="border-1 border-solid border-color-primary inline-block">
              <label class="flex-row divide-solid divide-x-1 divide-color-primary">
                <div class="w-6 text-center text-secondary flex-column bg-primary">
                  <span class="m-auto">+</span>
                </div>
                <input
                  class="h-6 px-2 border-none"
                  type="text"
                  placeholder="Enter list title..."
                  ref={inputElement}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
      {isDialogOpen && dialogCard && dialogCardListId &&
        <div
          class="pattern-mask"
          onClick={handleClickMask}
        />
      }
      {isDialogOpen && dialogCard && dialogCardListId &&
        <dialog
          open
          class="layout-center w-full flex-column p-8 border-solid border-1 border-color-primary layout-stack-4 bg-primary mt-24"
        >
          <div class="flex-row">
            <div class="text-large f-1">
              {dialogCardEditingName
                ?
                <form onSubmit={handleSubmitDialogCardName}>
                  <input
                    class="h-8 w-full border-solid border-1 border-color-primary text-large"
                    type="text"
                    ref={refDialogCardNameInput}
                    onBlur={handleBlurDialogCardName}
                    value={dialogCard.name}
                  />
                </form>
                : <div onClick={handleClickDialogCardName}>{dialogCard.name}</div>
              }
            </div>
            <div class="">
              <details class="pattern-dropdown">
                <summary class="w-6 h-6 flex-column cursor-pointer hover">
                  <div class="m-auto text-secondary">...</div>
                </summary>
                <div class="border-solid border-1 border-color-primary py-2 bg-primary drop-shadow">
                  <ul class="list-style-none p-0 m-0 text-secondary">
                    <li class="h-8">
                      <button
                        class="w-full text-left px-4 py-2 cursor-pointer border-none bg-primary hover nowrap text-secondary"
                        type="button"
                        onClick={handleClickDeleteCard}
                        data-card-id={dialogCard.id}
                        data-list-id={dialogCardListId}
                      >Delete</button>
                    </li>
                  </ul>
                </div>
              </details>

            </div>
          </div>
          <div class="f-1">
            {dialogCardEditingDescription
              ?
              <textarea
                class="border-solid border-1 border-color-primary w-full text-medium font-sans-serif"
                rows={4}
                ref={refDialogCardDescriptionTextarea}
                onBlur={handleBlurDialogCardDescription}
              >{dialogCard.description}</textarea>
              :
              <div
                onClick={handleClickDialogCardDescription}
                class="font-sans-serif overflow-x-hidden overflow-wrap-break-word pre-wrap text-secondary"
              >
                {dialogCard.description === ""
                  ? "No description"
                  : dialogCard.description
                }
              </div>
            }
          </div>
          <div class="text-right layout-stack-2">
            <div class="text-tertiary text-small">
              <span>Created: {relativeTime(dialogCard.createdAt)}</span>
            </div>
            <div class="text-tertiary text-small">
              <span>Updated: {relativeTime(dialogCard.updatedAt)}</span>
            </div>
          </div>
        </dialog>
      }
    </div>
  )
}
