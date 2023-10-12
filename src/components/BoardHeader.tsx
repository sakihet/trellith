import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { navigate } from "wouter-preact/use-location"

export default function BoardHeader(
  {
    id,
    name,
    updateBoardName,
    deleteBoard
  }: {
    id: string
    name: string
    updateBoardName: (id: string, name: string) => void
    deleteBoard: (id: string) => void
  }
) {
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
    navigate('/')
  }

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current?.value) {
      updateBoardName(id, inputElement.current.value)
    }
    setIsEditing(false)
  }

  return (
    <div class="flex-row h-12 py-3">
      <h2
        class="f-1 text-medium m-0"
        onClick={handleClick}
      >
        {isEditing
          ? <form
            onSubmit={handleSubmit}
          >
            <input
              class="h-6 w-64 text-medium"
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
          <div class="border-solid border-1 border-color-primary py-2 bg-primary drop-shadow">
            <ul class="list-style-none p-0 m-0 text-secondary">
              <li class="h-8">
                <button
                  class="px-4 py-2 cursor-pointer border-none bg-primary hover"
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
