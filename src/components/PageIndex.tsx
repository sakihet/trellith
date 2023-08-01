import { useEffect, useState } from 'preact/hooks'
import '../app.css'
import { BoardForm } from './BoardForm'
import { BoardItem } from './BoardItem'
import { AppLayout } from './AppLayout'
import { State } from '../types/state'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { JSX } from 'preact/jsx-runtime'

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
      setDraggingBoardId(boardId)
      console.log(draggingBoardId)
    }
  }

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    console.log('drop', e)
    const {boardId} = e.currentTarget.dataset
    console.log(boardId)
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
                {state.boards.map((board) =>
                  <BoardItem
                    key={board.id}
                    id={board.id}
                    name={board.name}
                    deleteBoard={deleteBoard}
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
