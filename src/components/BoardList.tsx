import { JSX } from "preact/jsx-runtime"
import { Board } from "../types/board"
import BoardItem from "./BoardItem"

export default function BoardList(
  {
    boards,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDrop
  }: {
    boards: Board[]
    handleDragEnd: () => void
    handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  }
) {
  return (
    <div class="layout-stack-2 overflow-y-auto pattern-height-board-list py-2 pr-2 pattern-scrollbar-thick">
      {boards.map((board, idx) =>
        <BoardItem
          key={board.id}
          board={board}
          pos={idx === 0 ? "first" : (idx === (boards.length - 1) ? "last" : "middle")}
          cardsNum={board.lists.map(l => l.cards.length).reduce((accumulator, value) => { return accumulator + value }, 0)}
          handleDragEnd={handleDragEnd}
          handleDragOver={handleDragOver}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
        />
      )}
    </div>
  )
}
