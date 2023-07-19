import { Link } from "preact-router/match"

type BoardItemProps = {
  id: string
  name: string
  deleteBoard: (id: string) => void
}

export function BoardItem(props: BoardItemProps) {
  const { id, name, deleteBoard } = props

  const handleClick = () => {
    deleteBoard(id)
  }

  return (
    <li class="">
      <div class="flex-row">
        <div class="f-1 p-2 bg-primary h-8">
          <Link
            class="text-decoration-none flex-row"
            href={`/board/${id}`}
          >
            { name }
          </Link>
        </div>
        <div class="bg-primary w-8 h-8 flex-column">
          <button
            class="m-auto border-none text-secondary"
            type="button"
            onClick={handleClick}
          >x</button>
        </div>
      </div>
    </li>
  )
}
