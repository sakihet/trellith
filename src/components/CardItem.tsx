import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { Pos } from "../types/pos"

type CardItemProps = {
  id: string
  listId: string
  name: string
  pos: Pos
  updateCardName: (id: string, name: string, listId: string) => void
  handleClickDelete: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
  handleDragEnd: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export function CardItem(props: CardItemProps) {
  const {
    id,
    listId,
    name,
    pos,
    updateCardName,
    handleClickDelete,
    handleDragEnd,
    handleDragStart,
    handleDrop
  } = props
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
      updateCardName(id, inputElement.current?.value, listId)
    }
    setEditing(false)
  }

  return (
    <div
      class="rounded-1 p-2 bg-primary flex-row cursor-grab drop-shadow parent-hiding-child hover-bg-card-item"
      draggable
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      data-card-id={id}
      data-list-id={listId}
      data-pos={pos}
    >
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
          : <div onClick={handleClickEdit}>{name}</div>
        }
      </div>
      <div class="hidden-child">
        <button
          class="border-none text-secondary px-1"
          type="button"
          data-card-id={id}
          data-list-id={listId}
          onClick={handleClickDelete}
        >x</button>
      </div>
    </div>
  )
}
