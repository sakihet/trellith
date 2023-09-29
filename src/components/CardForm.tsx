import { useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { AddCardParams } from "./PageBoard"

type CardFormProps = {
  listId: string
  addCard: (params: AddCardParams) => void
}

export function CardForm(props: CardFormProps) {
  const { listId, addCard } = props
  const inputElementCard = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElementCard.current?.value) {
      addCard({ listId: listId, cardName: inputElementCard.current?.value })
      inputElementCard.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        class="h-6 px-2 rounded-1 border-0"
        type="text"
        placeholder="Add a card"
        ref={inputElementCard}
      />
    </form>
  )
}
