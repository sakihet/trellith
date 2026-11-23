import { TargetedDragEvent } from "preact"
import { Link } from "wouter-preact"

import { Board } from "../types/board"
import { Pos } from "../types/pos"

export default function BoardItem({
  board,
  pos,
  cardsNum,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  handleDrop,
}: {
  board: Omit<Board, "lists">
  pos: Pos
  cardsNum: number
  handleDragEnd: (e: TargetedDragEvent<HTMLDivElement>) => void
  handleDragOver: (e: TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: TargetedDragEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      class={`flex-column h-20 bg-primary parent-hiding-child border-solid border-2 border-color-primary hover-bg-board-item bg-${board.bgColor ? board.bgColor : "primary"}`}
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
        <div class="h-6 flex-row">
          <div class="f-1">{board.name}</div>
          <div class="text-secondary font-mono px-1">{cardsNum}</div>
        </div>
        <div class="h-4"></div>
      </Link>
    </div>
  )
}
