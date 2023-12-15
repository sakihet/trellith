import { useEffect, useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type ListsType = 'None' | 'Preset'

export function BoardFormDialog(
  {
    open,
    handleClickMask,
    addBoard
  }: {
    open: boolean,
    handleClickMask: () => void,
    addBoard: (name: string, listNames: string[]) => void
  }
) {
  const refName = useRef<HTMLInputElement>(null)
  const [listsType, setListsType] = useState<ListsType>("None")

  const handleChageLists = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    setListsType(e.currentTarget.value as ListsType)
  }

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (refName.current) {
      if (refName.current.value !== '') {
        const listNames = (listsType === "None") ? [] : ["Todo", "Doing", "Done"]
        addBoard(refName.current.value, listNames)
        refName.current.value = ''
        handleClickMask()
      }
    }
  }

  useEffect(() => {
    if (open) {
      refName.current?.focus()
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
          class="layout-center p-8 border-solid border-1 border-color-primary bg-primary w-full"
        >
          <form
            onSubmit={handleSubmit}
            class="layout-stack-4"
          >
            <label class="flex-column layout-stack-2">
              <span class="text-secondary text-small">
                Board title
              </span>
              <input
                class="h-8 w-64 px-2 border-solid border-1 border-color-primary"
                type="text"
                maxLength={24}
                ref={refName}
              />
            </label>
            <div class="layout-stack-2">
              <div class="text-secondary text-small">Default lists</div>
              <div class="flex-column border-none text-secondary text-small layout-stack-1">
                <label>
                  <input
                    type="radio"
                    value="None"
                    name="lists"
                    class="w-6"
                    checked={listsType === 'None'}
                    onClick={handleChageLists}
                  />None
                </label>
                <label>
                  <input
                    type="radio"
                    value="Preset"
                    name="lists"
                    class="w-6"
                    checked={listsType === 'Preset'}
                    onClick={handleChageLists}
                  />Todo, Doing, Done
                </label>
              </div>
            </div>
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
