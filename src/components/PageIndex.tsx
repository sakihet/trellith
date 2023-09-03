import { useEffect, useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { AppLayout } from './AppLayout'
import { BoardForm } from './BoardForm'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { Pos } from '../types/pos'
import { State } from '../types/state'
import '../app.css'
import { BoardList } from './BoardList'

type PageIndexProps = {
  path: string
}

export function PageIndex(props: PageIndexProps) {
  const { path } = props
  console.log('path', path)
  const [state, setState] = useState<State>({ boards: [] })
  const [draggingBoardId, setDraggingBoardId] = useState<string | undefined>(undefined)
  const detailsElement = useRef<HTMLDetailsElement>(null)

  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  useEffect(() => {
    const result = service.load()
    if (result) {
      setState(result)
    }
  }, [])

  const addBoard = (name: string) => {
    const updated = service.createBoard(state, name)
    setState(updated)
  }

  const handleClickClear = () => {
    if (window.confirm('Do you really want to clear data?')) {
      const updated = service.clear()
      setState(updated)
      detailsElement.current?.removeAttribute('open')
    }
  }

  const handleDragEnd = () => setDraggingBoardId(undefined)

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
      <div class="layout-center overflow-hidden px-3 w-full">
        <div class="overflow-hidden">
          <div class="flex-row h-12 py-3 overflow-hidden">
            <h2 class="text-left text-medium text-primary f-1 m-0">Boards</h2>
            <button
              class="px-2 border-none text-secondary"
              type="button"
              onClick={handleClickClear}
            >Clear</button>
          </div>
          <div>
            <BoardForm addBoard={addBoard}/>
          </div>
          <div class="overflow-y-auto">
            <BoardList
              boards={state.boards}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
