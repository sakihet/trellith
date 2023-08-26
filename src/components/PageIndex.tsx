import { useEffect, useState } from 'preact/hooks'
import '../app.css'
import { BoardForm } from './BoardForm'
import { BoardItem } from './BoardItem'
import { AppLayout } from './AppLayout'
import { State } from '../types/state'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { JSX } from 'preact/jsx-runtime'
import { Pos } from '../types/pos'

type PageIndexProps = {
  path: string
}

export function PageIndex(props: PageIndexProps) {
  const { path } = props
  console.log('path', path)
  const [state, setState] = useState<State>({ boards: [] })
  const [draggingBoardId, setDraggingBoardId] = useState<string | undefined>(undefined)
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  useEffect(() => {
    console.log('effect')
    const result = service.load()
    if (result) {
      setState(result)
    }
  }, [])

  const addBoard = (name: string) => {
    const updated = service.createBoard(state, name)
    setState(updated)
  }

  const deleteBoard = (id: string) => {
    const updated = service.deleteBoard(state, id)
    setState(updated)
  }

  const updateBoardName = (id: string, name: string) => {
    const updated = service.updateBoardName(state, name, id)
    setState(updated)
  }

  const handleClickClear = () => {
    if (window.confirm('Do you really want to clear data?')) {
      const updated = service.clear()
      setState(updated)
    }
  }

  const handleDragEnd = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    console.log('drag end', e)
    setDraggingBoardId(undefined)
  }

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLDivElement>) => e.preventDefault()

  const handleDragStart = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
    const {boardId} = e.currentTarget.dataset
    if (boardId) {
      setTimeout(() => {setDraggingBoardId(boardId)}, 100)
      console.log(draggingBoardId)
    }
  }

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const {boardId, pos} = e.currentTarget.dataset
    if (boardId && pos && draggingBoardId) {
      const updated = service.moveBoard(state, draggingBoardId, pos as Pos, boardId)
      setState(updated)
    }
  }

  return (
    <AppLayout>
      <div class="layout-center overflow-y-hidden">
        <div class="layout-stack-2 overflow-y-hidden">
          <div class="flex-row">
            <h2 class="text-left text-large text-primary f-1">Boards</h2>
            <div class="flex-column">
              <button
                class="m-auto px-2 py-1 border-1 border-solid border-color-primary"
                type="button"
                onClick={handleClickClear}
              >Clear</button>
            </div>
          </div>
          <div>
            <BoardForm addBoard={addBoard}/>
          </div>
          <div class="overflow-y-hidden">
            <div class="layout-stack-2 overflow-y-auto height-board-list py-2 pr-2">
              {state.boards.map((board, idx) =>
                <BoardItem
                  key={board.id}
                  board={board}
                  pos={idx === 0 ? "first" : (idx === (state.boards.length - 1) ? "last" : "middle")}
                  deleteBoard={deleteBoard}
                  updateBoardName={updateBoardName}
                  handleDragEnd={handleDragEnd}
                  handleDragOver={handleDragOver}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
