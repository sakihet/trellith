import '../app.css'
import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { AppLayout } from './AppLayout'
import { load, save } from '../utils'
import { State } from '../types/state'
import { BoardList } from '../types/boardList'
import { CardForm } from './CardForm'
import { Card } from '../types/card'

type PageBoardProps = {
  board_id?: string
  path: string
}

type BoardState = {
  lists: BoardList[]
}

export type AddCardParams = {
  listId: string
  cardName: string
}

export function PageBoard(props: PageBoardProps) {
  console.log('props', props)
  const [didMount, setDidMount] = useState(false)
  const [state, setState] = useState<State>({ boards: [] })
  const [boardState, setBoardState] = useState<BoardState>({ lists: [] })
  const [draggingCardId, setDraggingCardId] = useState<string | undefined>(undefined)
  const [draggingCardListId, setDraggingCardListId] = useState<string | undefined>(undefined)
  const inputElement = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log('effect')
    setDidMount(true)
    const result = load()
    if (result) {
      setState(result)
      const b = result.boards.find(x => x.id === props.board_id)
      if (b) {
        setBoardState(b)
      }
    }
  }, [])

  useEffect(() => {
    console.log('boardState effect', didMount)
    if (didMount) {
      const updated = state.boards.map(b => {
        if (b.id === props.board_id) {
          return { ...b, lists: boardState.lists }
        } else {
          return b
        }
      })
      save({ boards: updated })
    }
  }, [boardState])

  const handleClickDeleteCard = (e: JSX.TargetedEvent<HTMLButtonElement>, listId: string, cardId: string) => {
    console.log('click delete card', e)
    const updated = boardState.lists.map(l => {
      if (l.id === listId) {
        return { ...l, cards: l.cards.filter(x => x.id !== cardId) }
      } else {
        return l
      }
    })
    setBoardState({ lists: updated })
  }

  const handleClickDeleteList = (e: JSX.TargetedEvent<HTMLButtonElement>, id: string) => {
    console.log('click delete', e)
    setBoardState({ lists: [...boardState.lists.filter(l => l.id !== id)]})
    return undefined
  }

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragEnd = () => {
    setDraggingCardId(undefined)
    setDraggingCardListId(undefined)
  }

  const handleDragStart = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {cardId, listId} = e.currentTarget.dataset
    setDraggingCardId(cardId)
    setDraggingCardListId(listId)
  }

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {listId} = e.currentTarget.dataset
    if (draggingCardId && draggingCardListId && listId) {
      moveCard(draggingCardId, draggingCardListId, listId)
    }
  }

  const addCard = (params: AddCardParams) => {
    console.log('add card', params)
    const card: Card = {
      id: crypto.randomUUID(),
      name: params.cardName
    }
    const updated = boardState.lists.map(l => {
      if (l.id === params.listId) {
        return { ...l, cards: [...l.cards, card] }
      } else {
        return l
      }
    })
    setBoardState({ lists: updated })
  }

  const moveCard = (cardId: string, listIdSrc: string, listIdDst: string) => {
    const cardTarget = boardState.lists.find(l => l.id === listIdSrc)?.cards.find(c => c.id === cardId)
    if (cardTarget && (listIdSrc !== listIdDst)) {
      const updated = boardState.lists.map(l => {
        if (l.id === listIdSrc) {
          return { ...l, cards: l.cards.filter(x => x.id !== cardId)}
        } else if (l.id === listIdDst) {
          return { ...l, cards: [cardTarget, ...l.cards]}
        } else {
          return l
        }
      })
      setBoardState({ lists: updated })
    }
  }

  const handleSubmitList = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current) {
      const boardList = {
        id: crypto.randomUUID(),
        name: inputElement.current.value,
        cards: []
      }
      setBoardState({ lists: [...boardState.lists, boardList] })
      inputElement.current.value = ''
    }
  }

  return (
    <AppLayout>
      <div>
        <h2 class="text-large">
          {state.boards.find(x => x.id === props.board_id)?.name}
        </h2>
      </div>
      <div class="flex-row layout-stack-horizontal">
        {boardState.lists.length !== 0 && boardState.lists.map(list =>
          <div
            class="w-64 p-4 bg-secondary rounded-2 layout-stack-2"
            // draggable
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            data-list-id={list.id}
          >
            <div class="flex-row h-6">
              <div class="f-1">{list.name}</div>
              <button
                class="border-none text-secondary"
                type="button"
                onClick={e => handleClickDeleteList(e, list.id)}
              >x</button>
            </div>
            <div>
              <CardForm
                listId={list.id}
                addCard={addCard}
              />
            </div>
            <div>
              <div class="layout-stack-2">
                {list.cards.map(card =>
                  <div
                    class="rounded-1 p-2 bg-primary flex-row"
                    draggable
                    key={card.id}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    data-card-id={card.id}
                    data-list-id={list.id}
                  >
                    <div class="f-1">{card.name}</div>
                    <div>
                      <button
                        class="border-none text-secondary"
                        type="button"
                        onClick={e => handleClickDeleteCard(e, list.id, card.id)}
                      >x</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div class="p-4">
          <form onSubmit={handleSubmitList}>
            <input
              class="h-6 px-2 rounded-2 border-1 border-solid border-color-primary"
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
