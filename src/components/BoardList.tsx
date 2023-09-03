import { JSX } from "preact/jsx-runtime"
import { Board } from "../types/board"
import { BoardItem } from "./BoardItem"

type BoardListProps = {
  boards: Board[]
  handleDragEnd: () => void
  handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export function BoardList(props: BoardListProps) {
  const {boards, handleDragEnd, handleDragOver, handleDragStart, handleDrop} = props

  return (
    <div class="layout-stack-2 overflow-y-auto height-board-list py-2 pr-2">
      {boards.map((board, idx) =>
        <BoardItem
          key={board.id}
          board={board}
          pos={idx === 0 ? "first" : (idx === (boards.length - 1) ? "last" : "middle")}
          handleDragEnd={handleDragEnd}
          handleDragOver={handleDragOver}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
        />
      )}
    </div>
  )
}
