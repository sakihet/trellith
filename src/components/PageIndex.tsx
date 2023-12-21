import { useRef, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { Signal } from '@preact/signals'
import { ApplicationService } from '../applications/applicationService'
import { RepositoryLocalStorage } from '../repositories/repository'
import { Pos } from '../types/pos'
import { State } from '../types/state'
import BoardList from './BoardList'
import { Board } from '../types/board'
import { BoardFormDialog } from './BoardFormDialog'
import { BgColor } from '../types/bgColor'

export default function PageIndex({ appState }: { appState: Signal<State> }) {
  const [draggingBoardId, setDraggingBoardId] = useState<string | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const detailsElement = useRef<HTMLDetailsElement>(null)
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)
  const inputFileElement = useRef<HTMLInputElement>(null)

  const addBoard = (name: string, listNames: string[], bgColor: BgColor | null) => {
    appState.value = service.createBoard(appState.value, name, listNames, bgColor)
  }

  const handleChangeImport = () => {
    if (inputFileElement.current && inputFileElement.current.files) {
      const file = inputFileElement.current?.files[0]
      const reader = new FileReader()
      reader.addEventListener(
        "load",
        () => {
          if (typeof (reader.result) === 'string') {
            const result = JSON.parse(reader.result)
            const boardIdsImport: string[] = result.boards.map((b: Board) => b.id)
            const boardIdsCurrent: string[] = appState.value.boards.map((b: Board) => b.id)
            const canImport = boardIdsImport.every(id => !boardIdsCurrent.includes(id))
            if (canImport) {
              appState.value = service.import(appState.value, result)
            } else {
              console.log('Duplication error.')
            }
          }
        },
        false
      )
      reader.readAsText(file)
    }
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

  const handleToggleDialog = () => {
    setDialogOpen(true)
  }

  const handleClickMouse = () => {
    setDialogOpen(false)
  }

  return (
    <div class="px-3">
      <div class="layout-center overflow-hidden w-full layout-stack-8">
        <div class="overflow-hidden">
          <div class="layout-stack-2">
            <div class="flex-row h-10 py-3">
              <h2 class="text-medium text-primary f-1 m-0">Boards</h2>
              <div class="flex-row layout-stack-horizontal-1">
                <button
                  class="w-6 h-6 border-1 border-solid border-color-primary bg-transparent cursor-pointer hover"
                  type="button"
                  onClick={handleToggleDialog}
                >+</button>
                <details class="pattern-dropdown">
                  <summary class="w-6 h-6 border-solid border-1 border-color-primary flex-column cursor-pointer hover">
                    <div class="m-auto text-secondary">...</div>
                  </summary>
                  <div class="border-solid border-1 border-color-primary py-2 bg-primary drop-shadow">
                    <ul class="list-style-none p-0 m-0 text-secondary">
                      <li class="h-8">
                        <button
                          class="w-full text-left px-4 py-2 cursor-pointer border-none bg-primary hover nowrap text-primary"
                          type="button"
                          onClick={handleClickClear}
                        >Delete boards</button>
                      </li>
                      <li class="h-8">
                        <a
                          class="px-4 py-2 text-primary cursor-pointer text-small text-decoration-none block hover"
                          download={"trellith.json"}
                          href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.value))}
                        >Export</a>
                      </li>
                      <li class="h-8">
                        <label>
                          <span class="px-4 py-2 text-primary cursor-pointer text-small block hover">Import</span>
                          <input
                            class="pattern-file display-none"
                            type="file"
                            accept=".json"
                            ref={inputFileElement}
                            onChange={handleChangeImport}
                          />
                        </label>
                      </li>
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </div>
          <div>
            <BoardFormDialog
              open={dialogOpen}
              handleClickMask={handleClickMouse}
              addBoard={addBoard}
            />
          </div>
          <div class="overflow-y-auto">
            <BoardList
              boards={appState.value.boards}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              handleToggleDialog={handleToggleDialog}
            />
          </div>
          <div>
            <h2 class="text-medium">Storage</h2>
            {storageDataSize >= 0 &&
              <div class="py-2">
                <span class="text-secondary font-mono">
                  {storageDataSize} / {STORAGE_LIMIT} bytes used on localStorage
                </span>
                <progress
                  max={STORAGE_LIMIT}
                  value={storageDataSize}
                  class="pattern-progress w-full h-4"
                ></progress>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
