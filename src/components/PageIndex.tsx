import { useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { Signal } from '@preact/signals'
import BoardForm from './BoardForm'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { Pos } from '../types/pos'
import { State } from '../types/state'
import BoardList from './BoardList'
import AppButton from './AppButton'

export default function PageIndex({ appState }: { appState: Signal<State> }) {
  const [draggingBoardId, setDraggingBoardId] = useState<string | undefined>(undefined)
  const detailsElement = useRef<HTMLDetailsElement>(null)
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  const addBoard = (name: string) => {
    appState.value = service.createBoard(appState.value, name)
  }

  const handleClickClear = () => {
    if (window.confirm('Do you really want to clear data?')) {
      appState.value = service.clear()
      detailsElement.current?.removeAttribute('open')
    }
  }

  const handleDragEnd = () => setDraggingBoardId(undefined)

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLDivElement>) => e.preventDefault()

  const handleDragStart = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
    const { boardId } = e.currentTarget.dataset
    if (boardId) {
      setTimeout(() => { setDraggingBoardId(boardId) }, 100)
    }
  }

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLDivElement>) => {
    const { boardId, pos } = e.currentTarget.dataset
    if (boardId && pos && draggingBoardId) {
      appState.value = service.moveBoard(appState.value, draggingBoardId, pos as Pos, boardId)
    }
  }

  const STORAGE_LIMIT = 5200000
  const getSize = (): number => {
    if (localStorage['trellith']) {
      return new Blob(Object.values(localStorage['trellith'])).size
    } else {
      return 0
    }
  }
  const storageDataSize = getSize()

  return (
    <div class="px-3">
      <div class="layout-center overflow-hidden w-full layout-stack-8">
        <div class="overflow-hidden layout-stack-4">
          <div class="flex-row h-12 py-3 overflow-hidden">
            <h2 class="text-medium text-primary f-1 m-0">Boards</h2>
            <div class="layout-stack-horizontal-1">
              <AppButton
                text={'Clear'}
                onClick={handleClickClear}
              />
              <a
                class="px-2 py-1 text-secondary cursor-pointer text-small"
                download={"trellith.json"}
                href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.value))}
              >Export</a>
            </div>
          </div>
          <div>
            <BoardForm addBoard={addBoard} />
          </div>
          <div class="overflow-y-auto">
            <BoardList
              boards={appState.value.boards}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />
          </div>
          <div>
            <h2 class="text-medium">Storage</h2>
            {storageDataSize >= 0 &&
              <div class="px-4 py-1">
                <span class="text-secondary font-mono">
                  {storageDataSize} / {STORAGE_LIMIT} bytes used on localStorage
                </span>
                <progress
                  max={STORAGE_LIMIT}
                  value={storageDataSize}
                  class="w-full"
                ></progress>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
