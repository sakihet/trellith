import { useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type BoardHeaderProps = {
  name: string
}

export function BoardHeader(props: BoardHeaderProps) {
  const { name } = props

  const [isEditing, setIsEditing] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  const handleBlur = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    console.log('blur', e)
    setIsEditing(false)
  }
  
  const handleClick = (e: JSX.TargetedEvent<HTMLHeadElement>) => {
    console.log('click', e)
    setIsEditing(true)
  }

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submit', e)
    // TODO: update board name
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
        : name
      }
    </h2>
  )
}
