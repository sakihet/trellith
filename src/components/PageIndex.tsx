import { useEffect, useState } from 'preact/hooks'
import '../app.css'
import { BoardForm } from './BoardForm'
import { BoardItem } from './BoardItem'
import { AppLayout } from './AppLayout'
import { load } from '../utils'
import { State } from '../types/state'
import { ApplicationService } from '../applications/applicationService'
import { Repository } from '../repositories/repository'

type PageIndexProps = {
  path: string
}

export function PageIndex(props: PageIndexProps) {
  const { path } = props
  console.log('path', path)
  const [state, setState] = useState<State>({ boards: [] })
  const repository = new Repository()
  const service = new ApplicationService(repository)

  useEffect(() => {
    console.log('effect')
    const result = load()
    if (result) {
      setState(result)
    }
  }, [])

  const addBoard = (name: string) => {
    console.log('add board', name)
    const updated = service.createBoard(state, name)
    setState(updated)
  }
  const deleteBoard = (id: string) => {
    console.log('delete board', id)
    const updated = service.deleteBoard(state, id)
    setState(updated)
  }

  const handleClickClear = () => {
    if (window.confirm('Do you really want to clear data?')) {
      const updated = service.clear()
      setState(updated)
    }
  }

  return (
    <AppLayout>
      <div class="">
        <div class="layout-center">
          <div class="layout-stack-4">
            <div>
              <h2 class="text-left text-large">Boards</h2>
            </div>
            <div class="text-right">
              <button
                class=""
                type="button"
                onClick={handleClickClear}
              >Clear</button>
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
