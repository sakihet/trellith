import { useEffect, useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import { BgColor } from "../types/bgColor"

type ListsType = 'None' | 'Preset'

export function BoardFormDialog(
  {
    open,
    handleClickMask,
    addBoard
  }: {
    open: boolean,
    handleClickMask: () => void,
    addBoard: (name: string, listNames: string[], bgColor: BgColor | null) => void
  }
) {
  const refName = useRef<HTMLInputElement>(null)
  const [bgColor, setBgColor] = useState<BgColor | null>(null)
  const [listsType, setListsType] = useState<ListsType>("None")

  const handleChangeBgColor = (e: JSX.TargetedMouseEvent<HTMLInputElement>) => {
    if (e.currentTarget.value !== 'none') {
      setBgColor(e.currentTarget.value as BgColor)
    } else {
      setBgColor(null)
    }
  }

  const handleChageLists = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    setListsType(e.currentTarget.value as ListsType)
  }

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (refName.current) {
      if (refName.current.value !== '') {
        const listNames = (listsType === "None") ? [] : ["Todo", "Doing", "Done"]
        addBoard(refName.current.value, listNames, bgColor)
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
              <div class="flex-column border-none text-secondary text-small layout-stack-1 pl-2">
                <label>
                  <input
                    type="radio"
                    value="None"
                    name="lists"
                    class=""
                    checked={listsType === 'None'}
                    onClick={handleChageLists}
                  />
                  <span class="px-1">None</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="Preset"
                    name="lists"
                    class=""
                    checked={listsType === 'Preset'}
                    onClick={handleChageLists}
                  />
                  <span class="px-1">Todo, Doing, Done</span>
                </label>
              </div>
            </div>
            <div class="layout-stack-2">
              <div class="text-secondary text-small">Color</div>
              <div class="text-secondary text-small">
                <label class="px-2 py-1">
                  <input type="radio" name="bgColor" value="none" checked={!bgColor} onClick={handleChangeBgColor} />
                  <span class="">None</span>
                </label>
                <label class="px-2 py-1 bg-red">
                  <input type="radio" name="bgColor" value="red" checked={bgColor === 'red'} onClick={handleChangeBgColor} />
                  <span class="">Red</span>
                </label>
                <label class="px-2 py-1 bg-yellow">
                  <input type="radio" name="bgColor" value="yellow" checked={bgColor === 'yellow'} onClick={handleChangeBgColor} />
                  <span class="">Yellow</span>
                </label>
                <label class="px-2 py-1 bg-green">
                  <input type="radio" name="bgColor" value="green" checked={bgColor === 'green'} onClick={handleChangeBgColor} />
                  <span class="">Green</span>
                </label>
                <label class="px-2 py-1 bg-blue">
                  <input type="radio" name="bgColor" value="blue" checked={bgColor === 'blue'} onClick={handleChangeBgColor} />
                  <span class="">Blue</span>
                </label>
                <label class="px-2 py-1 bg-cyan">
                  <input type="radio" name="bgColor" value="cyan" checked={bgColor === 'cyan'} onClick={handleChangeBgColor} />
                  <span class="">Cyan</span>
                </label>
                <label class="px-2 py-1 bg-magenta">
                  <input type="radio" name="bgColor" value="magenta" checked={bgColor === 'magenta'} onClick={handleChangeBgColor} />
                  <span class="">Magenta</span>
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
