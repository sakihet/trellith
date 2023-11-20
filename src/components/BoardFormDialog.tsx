import { useEffect, useRef } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

export function BoardFormDialog(
  {
    open,
    handleClickMask,
    addBoard
  }: {
    open: boolean,
    handleClickMask: () => void,
    addBoard: (name: string) => void
  }
) {
  const ref = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (ref.current) {
      if (ref.current.value !== '') {
        addBoard(ref.current.value)
        ref.current.value = ''
        handleClickMask()
      }
    }
  }

  useEffect(() => {
    if (open) {
      ref.current?.focus()
    }
  }, [open])

  if (open) {
    return (
      <>
        <div
          class="pattern-mask"
          onClick={handleClickMask}
        />
        <dialog
          open={open}
          class="layout-center p-6 border-solid border-1 border-color-primary bg-primary w-full"
        >
          <form
            onSubmit={handleSubmit}
            class="layout-stack-4"
          >
            <label class="flex-column layout-stack-1">
              <span class="text-secondary text-small">
                Board title
              </span>
              <input
                class="h-8 w-64 px-2 border-solid border-1 border-color-primary"
                type="text"
                maxLength={24}
                ref={ref}
              />
            </label>
            <div class="">
              <button
                class="h-6 px-4 border-solid border-1 border-color-primary cursor-pointer bg-transparent"
              >Create</button>
            </div>
          </form>
        </dialog>
      </>
    )
  } else {
    return (
      <></>
    )
  }
}
