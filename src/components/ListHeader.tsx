import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type ListHeaderProps = {
  id: string
  name: string
  cardsNum: number
  updateListName: (id: string, name: string) => void
  handleClickDeleteList: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
}

export function ListHeader(props: ListHeaderProps) {
  const { id, name, cardsNum, updateListName, handleClickDeleteList } = props
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
    <div class="flex-row h-6 cursor-grab pattern-hiding-child">
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
      <button
        class="border-none text-secondary pattern-hidden-child h-6 px-2"
        type="button"
        onClick={handleClickDeleteList}
        data-list-id={id}
      >x</button>
    </div>
  )
}
