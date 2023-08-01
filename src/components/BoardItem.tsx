import { Link } from "preact-router/match"
import { JSX } from "preact/jsx-runtime"
import { Pos } from "../types/pos"

type BoardItemProps = {
  id: string
  name: string
  pos: Pos
  deleteBoard: (id: string) => void
  handleDragEnd: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export function BoardItem(props: BoardItemProps) {
  const { id, name, pos, deleteBoard, handleDragEnd, handleDragOver, handleDragStart, handleDrop } = props

  const handleClick = () => {
    deleteBoard(id)
  }

  return (
    <div
      class="flex-row"
      draggable
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      data-board-id={id}
      data-pos={pos}
    >
      <div class="f-1 p-2 bg-primary h-8">
        <Link
          class="text-decoration-none flex-row"
          href={`/board/${id}`}
          draggable={false}
        >
          { name }
        </Link>
      </div>
      <div class="bg-primary w-8 h-8 flex-column">
        <button
          class="m-auto border-none text-secondary"
          type="button"
          onClick={handleClick}
        >x</button>
      </div>
    </div>
  )
}
