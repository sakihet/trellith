import { useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

export default function BoardForm({ addBoard }: { addBoard: (name: string) => void }) {
  const inputElement = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputElement.current) {
      addBoard(inputElement.current.value)
      inputElement.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div class="border-1 border-solid border-color-primary inline-block">
        <label class="flex-row divide-solid divide-x-1 divide-color-primary">
          <div class="w-8 text-center text-secondary flex-column">
            <span class="m-auto">+</span>
          </div>
          <input
            class="h-8 w-64 px-2 border-none"
            type="text"
            placeholder={"Enter board title..."}
            maxLength={24}
            ref={inputElement}
          />
        </label>
      </div>
    </form>
  )
}
