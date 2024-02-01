import { JSX } from "preact/jsx-runtime"
import { Board } from "../types/board"
import BoardItem from "./BoardItem"
import { useState } from "preact/hooks"

export default function BoardList(
  {
    boards,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleDrop,
    handleToggleDialog
  }: {
    boards: Board[]
    handleDragEnd: () => void
    handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleToggleDialog: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void
  }
) {
  const [query, setQuery] = useState('')

  const handleSearch = (e: JSX.TargetedMouseEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value)
  }

  return (
    <div class="layout-stack-4 overflow-y-auto pattern-height-board-list py-2 pr-2 pattern-scrollbar-thick">
      <input
        type="search"
        class="h-6 w-48 px-2 border-solid border-1 border-color-primary bg-primary"
        placeholder="Filter"
        onSearch={handleSearch}
        disabled={boards.length === 0}
      />
      {boards.length === 0
        ?
        <button
          type="button"
          class="h-20 w-full border-none bg-secondary text-secondary hover cursor-pointer"
          onClick={handleToggleDialog}
        >Create new board</button>
        :
        <div class="layout-stack-2">
          {
            boards.filter(b => b.name.includes(query)).map((board, idx) =>
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
            )
          }
        </div>
      }
    </div>
  )
}
