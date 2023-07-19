import '../app.css'
import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { AppLayout } from './AppLayout'
import { load, save } from '../utils'
import { State } from '../types/state'
import { BoardList } from '../types/boardList'

type PageBoardProps = {
  path: string
}

type BoardState = {
  lists: BoardList[]
}

export function PageBoard(props: PageBoardProps) {
  console.log('props', props)
  const [didMount, setDidMount] = useState(false)
  const [state, setState] = useState<State>({ boards: [] })
  const [boardState, setBoardState] = useState<BoardState>({ lists: [] })
  const inputElement = useRef<HTMLInputElement>(null)
  const inputElementCard = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log('effect')
    setDidMount(true)
    const result = load()
    if (result) {
      setState(result)
    }
  }, [])

  useEffect(() => {
    console.log('boardState effect', didMount)
    if (didMount) {
      console.log('TODO: save', state)
    }
  }, [boardState])

  const handleClickDeleteCard = (listId: string, cardId: string) => {
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

  const handleSubmitCard = (e: JSX.TargetedEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    if (inputElementCard.current && inputElementCard.current.value.length !== 0) {
      const card = {
        id: crypto.randomUUID(),
        name: inputElementCard.current.value
      }
      const updated = boardState.lists.map(l => {
        if (l.id === id) {
          return { ...l, cards: [...l.cards, card] }
        } else {
          return l
        }
      })
      setBoardState({ lists: updated })
      inputElementCard.current.value = ''
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
        <div>
          <h2 class="text-large">
            {state.boards.find(x => x.id === props.board_id)?.name}
          </h2>
        </div>
        <div class="flex-row layout-stack-horizontal">
          {boardState.lists.length !== 0 &&
            <>
              {boardState.lists.map(list =>
                <div
                  class="w-64 p-4 bg-secondary rounded-2 layout-stack-2"
                  draggable
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
                    <form onSubmit={e => handleSubmitCard(e, list.id)}>
                      <input
                        class="h-6 px-2 rounded-2 border-0"
                        type="text"
                        placeholder="Add a card"
                        ref={inputElementCard}
                      />
                    </form>
                  </div>
                  <div>
                    <div class="layout-stack-2">
                      {list.cards.map(card =>
                        <div
                          class="rounded-1 p-2 bg-primary flex-row"
                          draggable
                          key={card.id}
                        >
                          <div class="f-1">{card.name}</div>
                          <div>
                            <button
                              class="border-none text-secondary"
                              type="button"
                              onClick={e => { handleClickDeleteCard(list.id, card.id)} }
                            >x</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          }
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
      </div>
    </AppLayout>
  )
}
