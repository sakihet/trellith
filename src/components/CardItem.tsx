import { JSX } from "preact/jsx-runtime"

type CardItemProps = {
  id: string
  listId: string
  name: string
  handleClickDelete: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
  handleDragEnd: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export function CardItem(props: CardItemProps) {
  const {id, listId, name, handleClickDelete, handleDragEnd, handleDragStart} = props

  return (
    <div
      class="rounded-1 p-2 bg-primary flex-row cursor-grab"
      draggable
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      data-card-id={id}
      data-list-id={listId}
    >
      <div class="f-1">{name}</div>
      <div>
        <button
          class="border-none text-secondary"
          type="button"
          data-card-id={id}
          data-list-id={listId}
          onClick={handleClickDelete}
        >x</button>
      </div>
    </div>
  )
}
