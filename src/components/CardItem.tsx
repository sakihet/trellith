import { useEffect, useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { useLocation } from "wouter-preact"
import { Pos } from "../types/pos"

export default function CardItem(
  {
    id,
    listId,
    name,
    pos,
    hasDescription,
    deleteCard,
    updateCardName,
    handleDragEnd,
    handleDragStart,
    handleDrop
  }: {
    id: string,
    listId: string,
    name: string,
    pos: Pos,
    hasDescription: boolean,
    deleteCard: (cardId: string, listId: string) => void,
    updateCardName: (id: string, name: string, listId: string) => void,
    handleDragEnd: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void,
    handleDragStart: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void,
    handleDrop: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void,
  }) {
  const [editing, setEditing] = useState(false)
  const [composing, setComposing] = useState<boolean>(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const [location, setLocation] = useLocation()

  useEffect(() => {
    if (editing) {
      ref.current?.focus()
    }
  }, [editing])

  const handleBlur = () => {
    setEditing(false)
  }
  const handleClickEdit = () => {
    setEditing(true)
  }
  const handleClickOpenDialog = () => {
    setLocation(`${location}/card/${id}`)
  }
  const handleCompositionStart = () => {
    setComposing(true)
  }
  const handleCompositionEnd = () => {
    setComposing(false)
  }
  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !composing) {
      e.preventDefault()
      if (ref.current?.value) {
        updateCardName(id, ref.current?.value, listId)
        setEditing(false)
      } else if (ref.current?.value === '') {
        deleteCard(id, listId)
      }
    }
  }

  const isSeparator = (name: string): boolean => {
    return name === '---'
  }

  return (
    <div
      class="rounded-1 p-2 bg-primary flex-column cursor-grab drop-shadow pattern-hiding-child hover-bg-card-item"
      draggable
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      data-card-id={id}
      data-list-id={listId}
      data-pos={pos}
    >
      <div class="flex-row relative">
        <div class="f-1 overflow-x-hidden">
          {editing
            ?
            <textarea
              class="w-full borader-none rounded-1 p-2 resize-none text-medium font-sans-serif"
              onBlur={handleBlur}
              // @ts-ignore
              oncompositionstart={handleCompositionStart}
              oncompositionend={handleCompositionEnd}
              onKeyDown={handleKeyDown}
              ref={ref}
            >{name}</textarea>
            :
            <>
              {!isSeparator(name)
                ? <div
                  class="overflow-wrap-break-word"
                  onClick={handleClickEdit}
                >
                  {name}
                </div>
                : <button
                  class="w-full h-4 bg-transparent border-none px-2"
                  onClick={handleClickEdit}
                >
                  <hr class="border-solid border-1 border-color-primary" />
                </button>
              }
            </>
          }
        </div>
        {!isSeparator(name) && !editing &&
          <div class="pattern-hidden-child absolute r-0">
            <button
              class="h-6 w-6 border-none text-secondary px-1"
              type="button"
              onClick={handleClickOpenDialog}
            >○</button>
          </div>
        }
      </div>
      {hasDescription && <div
        class="h-6 text-secondary"
      >
        <span
          class="px-1"
          title="This card has a description."
        >≡</span>
      </div>}
    </div>
  )
}
