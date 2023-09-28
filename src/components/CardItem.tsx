import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { useLocation } from "wouter-preact"
import { Pos } from "../types/pos"

type CardItemProps = {
  id: string
  listId: string
  name: string
  pos: Pos
  updateCardName: (id: string, name: string, listId: string) => void
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
    handleDragEnd,
    handleDragStart,
    handleDrop
  } = props
  const [editing, setEditing] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useLocation()

  const handleBlur = () => {
    setEditing(false)
  }
  const handleClickEdit = () => {
    setEditing(true)
    setTimeout(() => {
      inputElement.current?.focus()
    }, 100)
  }
  const handleClickOpenDialog = () => {
    setLocation(`${location}/card/${id}`)
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
      <div class="f-1 overflow-x-hidden">
        {editing
          ? <form onSubmit={handleSubmit}>
            <input
              class="h-6 w-full px-1"
              type="text"
              onBlur={handleBlur}
              value={name}
              ref={inputElement}
            />
          </form>
          :
          <div
            class="overflow-wrap-break-word"
            onClick={handleClickEdit}
          >
            {name}
          </div>
        }
      </div>
      <div class="hidden-child">
        <button
          class="h-6 w-6 border-none text-secondary px-1"
          type="button"
          onClick={handleClickOpenDialog}
        >○</button>
      </div>
    </div>
  )
}
