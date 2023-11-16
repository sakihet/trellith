import { JSX } from "preact/jsx-runtime"
import { Card } from "../types/card"
import CardItem from "./CardItem"

export default function CardList(
  {
    cards,
    listId,
    isDragEnterCardFromTheOther,
    updateCardName,
    deleteCard,
    handleDragEndCard,
    handleDragEnterCard,
    handleDragStartCard,
    handleDropOnCard,
    handleDropOnSpacer
  }: {
    cards: Card[]
    listId: string
    isDragEnterCardFromTheOther: boolean
    deleteCard: (cardId: string, listId: string) => void
    updateCardName: (id: string, name: string, listId: string) => void
    handleDragEndCard: () => void
    handleDragEnterCard: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDragStartCard: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDropOnCard: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
    handleDropOnSpacer: (e: JSX.TargetedDragEvent<HTMLDivElement>) => void
  }
) {
  return (
    <div
      class="layout-stack-2 pattern-height-card-list overflow-y-auto pattern-scrollbar-thin"
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
            hasDescription={card.description !== ''}
            deleteCard={deleteCard}
            updateCardName={updateCardName}
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
