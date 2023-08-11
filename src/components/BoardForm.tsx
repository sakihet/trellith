import { useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type BoardFormProps = {
  addBoard: (name: string) => void
}

export function BoardForm(props: BoardFormProps) {
  const { addBoard } = props
  const inputElement = useRef<HTMLInputElement>(null)

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
        class="h-8 w-64 px-2 rounded-2 border-1 border-solid border-color-primary"
        type="text"
        placeholder={"Enter board title..."}
        maxLength={24}
        ref={inputElement}
      />
    </form>
  )
}
