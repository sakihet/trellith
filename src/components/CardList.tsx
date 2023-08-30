import { JSX } from "preact/jsx-runtime"
import { Card } from "../types/card"
import { CardItem } from "./CardItem"

type CardListProps = {
  cards: Card[]
  listId: string
  isDragEnterCardFromTheOther: boolean
  updateCardName: (id: string, name: string, listId: string) => void
  handleClickDeleteCard: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
  handleDragEndCard: () => void
  handleDragEnterCard: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDragStartCard: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDropOnCard: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  handleDropOnSpacer: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
}

export function CardList(props: CardListProps) {
  const {
    cards,
    listId,
    isDragEnterCardFromTheOther,
    updateCardName,
    handleClickDeleteCard,
    handleDragEndCard,
    handleDragEnterCard,
    handleDragStartCard,
    handleDropOnCard,
    handleDropOnSpacer
  } = props

  return (
    <div
      class="layout-stack-2 height-card-list"
      onDragEnter={handleDragEnterCard}
      data-list-id={listId}
    >
      {cards.length === 0
        ? <div class="h-4"></div>
        : cards.map((card, idx) =>
          <CardItem
            key={card.id}
            id={card.id}
            listId={listId}
            name={card.name}
            pos={idx === 0 ? "first" : (idx === (cards.length - 1) ? "last" : "middle")}
            updateCardName={updateCardName}
            handleClickDelete={handleClickDeleteCard}
            handleDragEnd={handleDragEndCard}
            handleDragStart={handleDragStartCard}
            handleDrop={handleDropOnCard}
          />
      )}
      {isDragEnterCardFromTheOther
        &&
          <div
            class="h-8"
            data-list-id={listId}
            data-spacer
            onDrop={handleDropOnSpacer}
          />
      }
    </div>
  )
}
