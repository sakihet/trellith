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
    console.log('add board', name)
    const updated = service.createBoard(state, name)
    setState(updated)
  }
  const deleteBoard = (id: string) => {
    console.log('delete board', id)
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

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragStart = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    console.log('drag start')
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
              <div class="layout-stack-2">
                {state.boards.map((board, idx) =>
                  <BoardItem
                    key={board.id}
                    id={board.id}
                    name={draggingBoardId === board.id ? '' : board.name}
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
      </div>
    </AppLayout>
  )
}
