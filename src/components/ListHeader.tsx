import { JSX } from "preact/jsx-runtime"

type ListHeaderProps = {
  id: string
  name: string
  handleClickDeleteList: (e: JSX.TargetedEvent<HTMLButtonElement>) => void
}

export function ListHeader(props: ListHeaderProps) {
  const {id, name, handleClickDeleteList} = props

  return (
    <div class="flex-row h-6 cursor-grab">
      <div class="f-1">{name}</div>
      <button
        class="border-none text-secondary"
        type="button"
        onClick={handleClickDeleteList}
        data-list-id={id}
      >x</button>
    </div>
  )
}
