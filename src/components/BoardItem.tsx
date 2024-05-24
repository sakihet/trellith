import { Link } from "wouter-preact"
import { JSX } from "preact/jsx-runtime"
import { Pos } from "../types/pos"
import { Board } from "../types/board"
import { useEffect, useRef } from "preact/hooks"
import { draggable, dropTargetForElements, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"

export default function BoardItem(
  {
    board,
    pos,
    cardsNum,
    handleDragOver,
    handleDrop,
  }: {
    board: Omit<Board, 'lists'>
    pos: Pos
    cardsNum: number
    handleDragOver: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDrop: (elemTarget: HTMLDivElement, elemSource: HTMLDivElement) => void
  }
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el) {
      return combine(
        draggable({
          element: el,
          onDragStart: () => {
            console.log('draggable: drag start')
          },
          onDrop: () => {
            console.log('draggable: drop')
          },
        }),
        dropTargetForElements({
          element: el,
          onDragEnter: () => {
            console.log('target: drag enter')
          },
          onDragLeave: () => {
            console.log('target: drag leave')
          },
          onDrop: () => {
            console.log('target: drop')
          }
        }),
        monitorForElements({
          onDrop({ location, source }) {
            const target = location.current.dropTargets[0]
            handleDrop(target.element as HTMLDivElement, source.element as HTMLDivElement)
          },
        }),
      )
    }
  }, [])

  return (
    <div
      class={`flex-column h-20 bg-primary parent-hiding-child border-solid border-2 border-color-primary hover-bg-board-item bg-${board.bgColor ? board.bgColor : 'primary'}`}
      onDragOver={handleDragOver}
      data-board-id={board.id}
      data-pos={pos}
      ref={ref}
    >
      <Link
        class="p-4 cursor-pointer flex-column layout-stack-2 text-decoration-none text-primary"
        href={`/board/${board.id}`}
        draggable={false}
      >
        <div class="h-6 flex-row">
          <div class="f-1">
            {board.name}
          </div>
          <div class="text-secondary font-mono px-1">
            {cardsNum}
          </div>
        </div>
        <div class="h-4"></div>
      </Link>
    </div>
  )
}
