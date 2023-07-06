import { useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type BoardFormProps = {
  addBoard: (name: string) => void
}

export function BoardForm(props: BoardFormProps) {
  const { addBoard } = props
  const inputElement = useRef(null)

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current) {
      console.log('submit', inputElement.current.value)
      addBoard(inputElement.current.value)
      inputElement.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        class="h-6 px-2 rounded-2 border-1"
        type="text"
        ref={inputElement}
        maxLength={24}
      />
    </form>
  )
}
