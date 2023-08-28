import { Link } from "preact-router/match"
import { JSX } from "preact/jsx-runtime"
import { Pos } from "../types/pos"
import { useRef, useState } from "preact/hooks"
import { Board } from "../types/board"

type BoardItemProps = {
  board: Omit<Board, 'lists'>
  pos: Pos
  deleteBoard: (id: string) => void
  updateBoardName: (id: string, name: string) => void
  handleDragEnd: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export function BoardItem(props: BoardItemProps) {
  const { board, pos, deleteBoard, updateBoardName, handleDragEnd, handleDragOver, handleDragStart, handleDrop } = props
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
  const handleClickDelete = () => {
    deleteBoard(board.id)
  }
  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current?.value) {
      updateBoardName(board.id, inputElement.current?.value)
    }
    setEditing(false)
  }

  return (
    <div
      class="flex-column h-14 p-3 bg-primary rounded-2 cursor-grab parent-hiding-child border-solid border-1 border-color-primary hover-bg-board-item"
      draggable
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      data-board-id={board.id}
      data-pos={pos}
    >
      <div class="h-4">
        {editing
          ? <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={board.name}
                onBlur={handleBlur}
                ref={inputElement}
              />
            </form>
          : <Link
              class="text-decoration-none flex-row text-primary"
              href={`/board/${board.id}`}
              draggable={false}
            >
              { board.name }
            </Link>
        }
      </div>
      <div class="h-4 flex-row hidden-child">
        <div class="f-1"></div>
        <button
          class="border-none text-secondary px-2"
          type="button"
          onClick={handleClickEdit}
        >Edit</button>
        <div class="w-1"></div>
        <button
          class="border-none text-secondary"
          type="button"
          onClick={handleClickDelete}
        >x</button>
      </div>
    </div>
  )
}
