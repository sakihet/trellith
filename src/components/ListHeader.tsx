import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type ListHeaderProps = {
  id: string
  name: string
  updateListName: (id: string, name: string) => void
  handleClickDeleteList: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
}

export function ListHeader(props: ListHeaderProps) {
  const {id, name, updateListName, handleClickDeleteList} = props
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
    <div class="flex-row h-4 cursor-grab parent-hiding-child">
      <div class="f-1">
        {editing
          ? <form onSubmit={handleSubmit}>
              <input
                type="text"
                onBlur={handleBlur}
                value={name}
                ref={inputElement}
              />
            </form>
          : <div onClick={handleClickEdit}>
              {name}
            </div>
        }
      </div>
      <button
        class="border-none text-secondary hidden-child h-4 px-1"
        type="button"
        onClick={handleClickDeleteList}
        data-list-id={id}
      >x</button>
    </div>
  )
}
