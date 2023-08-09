import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type BoardHeaderProps = {
  id: string
  name: string
  updateBoardName: (id: string, name: string) => void
}

export function BoardHeader(props: BoardHeaderProps) {
  const { id, name, updateBoardName } = props
  const [isEditing, setIsEditing] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  const handleBlur = () => {
    setIsEditing(false)
  }
  
  const handleClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputElement.current?.focus()
    }, 100)
  }

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current?.value) {
      updateBoardName(id, inputElement.current.value)
    }
    setIsEditing(false)
  }

  return (
    <h2
      class="text-large"
      onClick={handleClick}
    >
      {isEditing
        ? <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={name}
              onBlur={handleBlur}
              ref={inputElement}
            />
          </form>
        : <div>{name}</div>
      }
    </h2>
  )
}
