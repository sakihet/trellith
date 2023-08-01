import '../app.css'
import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { AppLayout } from './AppLayout'
import { save } from '../utils'
import { State } from '../types/state'
import { BoardList } from '../types/boardList'
import { CardForm } from './CardForm'
import { Card } from '../types/card'
import { BoardHeader } from './BoardHeader'
import { CardItem } from './CardItem'
import { ListHeader } from './ListHeader'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'

type PageBoardProps = {
  board_id?: string
  path: string
}

export type BoardState = {
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
  const [draggingListId, setDraggingListId] = useState<string | undefined>(undefined)
  const inputElement = useRef<HTMLInputElement>(null)
  const [boardName, setBoardName] = useState("")
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  useEffect(() => {
    console.log('effect')
    setDidMount(true)
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

  const handleClickDeleteCard = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    console.log('click delete card', e)
    const {cardId, listId} = e.currentTarget.dataset
    if (cardId && listId) {
      const updated = boardState.lists.map(l => {
        if (l.id === listId) {
          return { ...l, cards: l.cards.filter(x => x.id !== cardId) }
        } else {
          return l
        }
      })
      setBoardState({ lists: updated })
    }
  }

  const handleClickDeleteList = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    console.log('click delete', e)
    const {listId} = e.currentTarget.dataset
    if (listId && props.board_id) {
      const updated = service.deleteList(state, listId, props.board_id)
      setState(updated)
      const board = updated.boards.find(b => b.id === props.board_id)
      if (board) {
        setBoardState(board)
      }
    }
  }

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragEndCard = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    console.log('drag end', e)
    setDraggingCardId(undefined)
    setDraggingCardListId(undefined)
  }

  const handleDragStartCard = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {cardId, listId} = e.currentTarget.dataset
    setDraggingCardId(cardId)
    setDraggingCardListId(listId)
  }

  const swap = (ary: BoardList[], idx1: number, idx2: number) => {
    [ary[idx1], ary[idx2]] = [ary[idx2], ary[idx1]]
    return ary
  }

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {listId} = e.currentTarget.dataset
    if (draggingCardId && draggingCardListId && listId) {
      moveCard(draggingCardId, draggingCardListId, listId)
    } else if (!draggingCardId && draggingListId && listId) {
      swapList(draggingListId, listId)
    }
  }

  const swapList = (listId1: string, listId2: string) => {
    const idx1 = boardState.lists.findIndex(l => l.id === listId1)
    const idx2 = boardState.lists.findIndex(l => l.id === listId2)
    const swapped = swap(boardState.lists, idx1, idx2)
    setBoardState({ lists: swapped })
  }

  const handleDragEndList = () => {
    setDraggingListId(undefined)
  }

  const handleDragStartList = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {listId} = e.currentTarget.dataset
    if (listId) {
      setDraggingListId(listId)
    }
  }

  const addCard = (params: AddCardParams) => {
    console.log('add card', params)
    if (props.board_id) {
      const updated = service.createCard(state, params.cardName, props.board_id, params.listId)
      setState(updated)
      const board = updated.boards.find(b => b.id === props.board_id)
      if (board) {
        setBoardState(board)
      }
    }
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
      if (props.board_id) {
        const updated = service.createList(state, inputElement.current.value, props.board_id)
        setState(updated)
        const board = updated.boards.find(b => b.id === props.board_id)
        if (board) {
          setBoardState(board)
        }
        inputElement.current.value = ''
      }
    }
  }

  return (
    <AppLayout>
      <div>
        <BoardHeader name={boardName} />
      </div>
      <div class="flex-row layout-stack-horizontal">
        {boardState.lists.length !== 0 && boardState.lists.map(list =>
          <div
            class="w-64 p-4 bg-secondary rounded-2 layout-stack-2"
            draggable
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEndList}
            onDragStart={handleDragStartList}
            data-list-id={list.id}
          >
            <ListHeader
              id={list.id}
              name={list.name}
              handleClickDeleteList={handleClickDeleteList}
            />
            <div>
              <CardForm
                listId={list.id}
                addCard={addCard}
              />
            </div>
            <div>
              <div class="layout-stack-2">
                {list.cards.map(card =>
                  <CardItem
                    key={card.id}
                    id={card.id}
                    listId={list.id}
                    name={card.name}
                    handleClickDelete={handleClickDeleteCard}
                    handleDragEnd={handleDragEndCard}
                    handleDragStart={handleDragStartCard}
                  />
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
