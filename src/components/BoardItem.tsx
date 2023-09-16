import { Link } from "wouter-preact"
import { JSX } from "preact/jsx-runtime"
import { Pos } from "../types/pos"
import { Board } from "../types/board"

type BoardItemProps = {
  board: Omit<Board, 'lists'>
  pos: Pos
  cardsNum: number
  handleDragEnd: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export function BoardItem(props: BoardItemProps) {
  const { board, pos, cardsNum, handleDragEnd, handleDragOver, handleDragStart, handleDrop } = props

  return (
    <div
      class="flex-column h-18 bg-primary parent-hiding-child border-solid border-1 border-color-primary hover-bg-board-item"
      draggable
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      data-board-id={board.id}
      data-pos={pos}
    >
      <Link
        class="p-4 cursor-pointer flex-column layout-stack-2 text-decoration-none text-primary"
        href={`/board/${board.id}`}
        draggable={false}
      >
        <div class="h-4 flex-row">
          <div class="f-1">
            {board.name}
          </div>
          <div class="text-secondary font-mono">
            {cardsNum}
          </div>
        </div>
        <div class="h-4"></div>
      </Link>
    </div>
  )
}
