import { JSX } from "preact/jsx-runtime"
import { Card } from "../types/card"
import { relativeTime } from "../utils"
import { useRef, useState } from "preact/hooks"
import IconMoreHoriz from "./IconMoreHoriz"

export function CardDialog({
  isOpen,
  card,
  cardListId,
  handleBlurCardDescription,
  handleClickDeleteCard,
  handleClickMask,
  handleSubmitCardName
}: {
  isOpen: boolean
  card: Card | undefined
  cardListId: string
  handleBlurCardDescription: (e: JSX.TargetedFocusEvent<HTMLTextAreaElement>) => void
  handleClickDeleteCard: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void
  handleClickMask: (e: JSX.TargetedMouseEvent<HTMLDivElement>) => void
  handleSubmitCardName: (e: JSX.TargetedEvent<HTMLFormElement>) => void
}) {
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false)
  const refDescriptionTextarea = useRef<HTMLTextAreaElement>(null)
  const refNameInput = useRef<HTMLInputElement>(null)

  const handleBlurName = () => {
    setIsEditingName(false)
  }

  const handleBlurDescription = (e: JSX.TargetedFocusEvent<HTMLTextAreaElement>) => {
    setIsEditingDescription(false)
    handleBlurCardDescription(e)
  }

  const handleClickDescription = () => {
    setIsEditingDescription(true)
    setTimeout(() => {
      refDescriptionTextarea.current?.focus()
    }, 100)
  }

  const handleClickCardName = () => {
    setIsEditingName(true)
    setTimeout(() => {
      refNameInput.current?.focus()
    }, 100)
  }

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    setIsEditingName(false)
    handleSubmitCardName(e)
  }

  if (card) {
    return (
      <>
        {isOpen &&
          <div
            class="pattern-mask"
            onClick={handleClickMask}
          />
        }
        <dialog
          class="layout-center layout-stack-2 w-full p-8 border-solid border-1 border-color-primary"
          open={isOpen}
        >
          <div class="h-6 flex-row">
            <div class="text-medium f-1">
              {isEditingName
                ?
                <form onSubmit={handleSubmit}>
                  <input
                    class="h-6 w-full border-solid border-1 border-color-primary text-large"
                    type="text"
                    ref={refNameInput}
                    onBlur={handleBlurName}
                    value={card.name}
                    name="cardName"
                  />
                </form>
                : <div onClick={handleClickCardName}>{card.name}</div>
              }
            </div>
            <div>
              <details class="pattern-dropdown">
                <summary class="w-6 h-6 flex-column cursor-pointer hover">
                  <div class="m-auto text-secondary">
                    <IconMoreHoriz />
                  </div>
                </summary>
                <div class="border-solid border-1 border-color-primary py-2 bg-primary drop-shadow">
                  <ul class="list-style-none p-0 m-0 text-secondary">
                    <li class="h-8">
                      <button
                        class="w-full text-left px-4 py-2 cursor-pointer border-none bg-primary hover nowrap text-secondary"
                        type="button"
                        onClick={handleClickDeleteCard}
                        data-card-id={card.id}
                        data-list-id={cardListId}
                      >Delete</button>
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
          <div class="f-1">
            {isEditingDescription
              ?
              <textarea
                class="border-solid border-1 border-color-primary w-full text-medium font-sans-serif"
                rows={4}
                ref={refDescriptionTextarea}
                onBlur={handleBlurDescription}
              >
                {card.description}
              </textarea>
              :
              <div
                class="font-sans-serif overflow-x-hidden overflow-wrap-break-word pre-wrap text-secondary"
                onClick={handleClickDescription}
              >
                {card.description === ""
                  ? "No description"
                  : card.description
                }
              </div>
            }
          </div>
          <div class="text-right layout-stack-2">
            <div class="text-tertiary text-small">
              <span>Created: {relativeTime(card.createdAt)}</span>
            </div>
            <div class="text-tertiary text-small">
              <span>Updated: {relativeTime(card.updatedAt)}</span>
            </div>
          </div>
        </dialog>
      </>
    )
  } else {
    return (
      <div />
    )
  }
}
