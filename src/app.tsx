import { useState } from 'preact/hooks'
import './app.css'
import { BoardForm } from './components/BoardForm'
import { Board } from './types/board'
import { BoardItem } from './components/BoardItem'
import { AppLayout } from './components/AppLayout'

type State = {
  boards: Board[]
}

type AppProps = {
  path: string
}

export function App(props: AppProps) {
  const { path } = props
  console.log('path', path)
  const [state, setState] = useState<State>({ boards: []})

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
      <div class="layout-center">
        <div>
          <div>
            <h2 class="text-left text-large">Boards</h2>
          </div>
          <div>
            <BoardForm addBoard={addBoard}/>
          </div>
          <div>
            <ul class="list-style-none pl-0">
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
    </AppLayout>
  )
}
