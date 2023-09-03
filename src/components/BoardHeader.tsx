import { route } from "preact-router"
import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type BoardHeaderProps = {
  id: string
  name: string
  updateBoardName: (id: string, name: string) => void
  deleteBoard: (id: string) => void
}

export function BoardHeader(props: BoardHeaderProps) {
  const { id, name, updateBoardName, deleteBoard } = props
  const [isEditing, setIsEditing] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  const handleBlur = () => {
    setIsEditing(false)
  }
  
  const handleClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputElement.current?.focus()
    }, 100)
  }

  const handleClickDelete = () => {
    deleteBoard(id)
    route('/')
  }

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current?.value) {
      updateBoardName(id, inputElement.current.value)
    }
    setIsEditing(false)
  }

  return (
    <div class="flex-row h-12 p-3">
      <h2
        class="f-1 text-medium m-0"
        onClick={handleClick}
      >
        {isEditing
          ? <form
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                value={name}
                onBlur={handleBlur}
                ref={inputElement}
              />
            </form>
          : <div>{name}</div>
        }
      </h2>
      <div class="w-6 h-6">
        <details class="pattern-dropdown">
          <summary class="w-6 h-6 border-solid border-1 border-color-primary flex-column cursor-pointer">
            <div class="m-auto text-secondary">...</div>
          </summary>
          <div class="border-solid border-1 border-color-primary py-1 r-3 bg-primary">
            <ul class="list-style-none pl-0 py-0 m-0 text-secondary">
              <li class="h-8 px-4 py-2 hover cursor-pointer">
                <button
                  class="unset px-4"
                  type="button"
                  onClick={handleClickDelete}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  )
}
