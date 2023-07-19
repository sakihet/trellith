import { useEffect, useState } from 'preact/hooks'
import '../app.css'
import { BoardForm } from './BoardForm'
import { Board } from '../types/board'
import { BoardItem } from './BoardItem'
import { AppLayout } from './AppLayout'

type State = {
  boards: Board[]
}

type PageIndexProps = {
  path: string
}

const LOCAL_STORAGE_KEY = 'dnd-board'

const save = (obj: {}) => {
  console.log('save')
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(obj))
}

const load = () => {
  console.log('load')
  const value = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (value) {
    return JSON.parse(value)
  } else {
    return { boards: [] }
  }
}

export function PageIndex(props: PageIndexProps) {
  const { path } = props
  console.log('path', path)
  const [didMount, setDidMount] = useState(false)
  const [state, setState] = useState<State>({ boards: [] })

  useEffect(() => {
    console.log('effect')
    setDidMount(true)
    const result = load()
    if (result) {
      setState(result)
    }
  }, [])

  useEffect(() => {
    console.log('state effect', didMount)
    if (didMount) {
      save(state)
    }
  }, [state])

  const addBoard = (name: string) => {
    console.log('add board', name)
    const board: Board = {
      id: crypto.randomUUID(),
      name: name
    }
    setState({ boards: [...state.boards, board]})
  }
  const deleteBoard = (id: string) => {
    console.log('delete board', id)
    setState({ boards: [...state.boards.filter(b => b.id !== id)]})
  }

  return (
    <AppLayout>
      <div class="p-4">
        <div class="layout-center">
          <div class="layout-stack-4">
            <div>
              <h2 class="text-left text-large">Boards</h2>
            </div>
            <div>
              <BoardForm addBoard={addBoard}/>
            </div>
            <div>
              <ul class="list-style-none pl-0 layout-stack-2">
                {state.boards.map(board =>
                  <BoardItem
                    key={board.id}
                    id={board.id}
                    name={board.name}
                    deleteBoard={deleteBoard}
                  />
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
