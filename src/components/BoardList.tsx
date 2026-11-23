import { TargetedMouseEvent, TargetedDragEvent, TargetedSubmitEvent } from "preact"
import { useRef, useState } from "preact/hooks"

import { Board } from "../types/board"
import { filterBoardsByName } from "../utils"
import BoardItem from "./BoardItem"
import IconClose from "./IconClose"
import IconFilterList from "./IconFilterList"

export default function BoardList({
  boards,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  handleDrop,
  handleToggleDialog,
}: {
  boards: Board[]
  handleDragEnd: () => void
  handleDragOver: (e: TargetedDragEvent<HTMLDivElement>) => void
  handleDragStart: (e: TargetedDragEvent<HTMLDivElement>) => void
  handleDrop: (e: TargetedDragEvent<HTMLDivElement>) => void
  handleToggleDialog: (e: TargetedMouseEvent<HTMLButtonElement>) => void
}) {
  const [query, setQuery] = useState("")
  const inputElement = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = inputElement.current?.value
    if (query) {
      setQuery(query)
    } else {
      setQuery("")
    }
  }

  const handleReset = () => {
    setQuery("")
  }

  return (
    <div class="layout-stack-4 overflow-y-auto pattern-height-board-list py-2 pr-2 pattern-scrollbar-thick">
      <form onSubmit={handleSubmit} onReset={handleReset} autocomplete="off">
        <div class="flex-row">
          <label for="board-filter">
            <div class="inline-block h-6 w-6 text-center border-solid border-1 border-color-primary">
              <IconFilterList />
            </div>
          </label>
          <input
            id="board-filter"
            type="text"
            class="w-48 h-6 px-2 bg-primary border-solid border-1 border-color-primary border-x-none"
            placeholder="Filter"
            disabled={boards.length === 0}
            ref={inputElement}
          />
          <button
            type="reset"
            class="h-6 w-6 border-solid border-1 border-color-primary bg-primary text-secondary text-medium cursor-pointer"
          >
            <IconClose />
          </button>
        </div>
      </form>
      {boards.length === 0 ? (
        <button
          type="button"
          class="h-20 w-full border-none bg-secondary text-secondary hover cursor-pointer"
          onClick={handleToggleDialog}
        >
          Create new board
        </button>
      ) : (
        <div class="layout-stack-2">
          {filterBoardsByName(query, boards).map((board, idx) => (
            <BoardItem
              key={board.id}
              board={board}
              pos={idx === 0 ? "first" : idx === boards.length - 1 ? "last" : "middle"}
              cardsNum={board.lists
                .map((l) => l.cards.length)
                .reduce((accumulator, value) => {
                  return accumulator + value
                }, 0)}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  )
}
