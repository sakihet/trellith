import { useState } from 'preact/hooks'
import './app.css'
import { BoardForm } from './components/BoardForm'
import { Board } from './types/board'
import { BoardItem } from './components/BoardItem'

type State = {
  boards: Board[]
}

export function App() {
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
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div> */}
      <div class="p-4">
        <div>
          <h1 class="text-center">DnD Board</h1>
          {/* <div>{ JSON.stringify(state) }</div> */}
        </div>
        <div class="layout-center">
          <div>
            <div>
              <h2 class="text-left">Boards</h2>
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
      </div>
    </>
  )
}
