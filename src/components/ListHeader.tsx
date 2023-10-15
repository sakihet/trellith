import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

export default function ListHeader(
  {
    id,
    name,
    cardsNum,
    updateListName,
    handleClickDeleteList,
    handleClickDeleteCards
  }: {
    id: string
    name: string
    cardsNum: number
    updateListName: (id: string, name: string) => void
    handleClickDeleteList: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
    handleClickDeleteCards: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
  }
) {
  const [editing, setEditing] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  const handleBlur = () => {
    setEditing(false)
  }
  const handleClickEdit = () => {
    setEditing(true)
    setTimeout(() => {
      inputElement.current?.focus()
    }, 100)
  }
  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current?.value) {
      updateListName(id, inputElement.current.value)
    }
    setEditing(false)
  }

  return (
    <div class="flex-row h-6 cursor-grab">
      <div class="f-1 overflow-hidden">
        {editing
          ? <form onSubmit={handleSubmit}>
            <input
              class="h-6 px-1 w-full"
              type="text"
              onBlur={handleBlur}
              value={name}
              ref={inputElement}
            />
          </form>
          : <div class="flex-row">
            <div
              class="f-1 nowrap overflow-x-hidden text-overflow-ellipsis"
              onClick={handleClickEdit}
            >
              {name}
            </div>
            <div class="px-2 text-secondary font-mono">
              {cardsNum}
            </div>
          </div>
        }
      </div>
      <div class="w-6">
        <details class="pattern-dropdown">
          <summary class="w-6 h-6 flex-column cursor-pointer hover">
            <div class="m-auto text-secondary">...</div>
          </summary>
          <div class="py-2 border-solid border-1 border-color-primary bg-primary drop-shadow">
            <ul class="list-style-none p-0 m-0 text-secondary">
              <li class="h-8">
                <button
                  class="px-4 py-2 cursor-pointer border-none bg-primary hover nowrap w-full text-left text-small"
                  type="button"
                  data-list-id={id}
                  onClick={handleClickDeleteCards}
                >
                  Delete all cards in this list
                </button>
              </li>
              <li class="h-8">
                <button
                  class="px-4 py-2 cursor-pointer border-none bg-primary hover nowrap w-full text-left text-small"
                  type="button"
                  data-list-id={id}
                  onClick={handleClickDeleteList}
                >
                  Delete this list
                </button>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  )
}
