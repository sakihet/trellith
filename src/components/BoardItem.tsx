import { JSX } from "preact/jsx-runtime"

type BoardItemProps = {
  id: string
  name: string
  deleteBoard: (id: string) => void
}

export function BoardItem(props: BoardItemProps) {
  const { id, name, deleteBoard } = props

  const handleClick = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    deleteBoard(id)
  }

  return (
    <li class="h-8">
      <div class="flex-row">
        <div class="f-1">
          <a
            class="text-decoration-none"
            href=""
          >{ name }</a>
        </div>
        <button
          class=""
          type="button"
          onClick={handleClick}
        >x</button>
      </div>
    </li>
  )
}
