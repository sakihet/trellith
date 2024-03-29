import { JSX } from "preact/jsx-runtime"
import { useEffect, useRef, useState } from "preact/hooks"
import useLocation from "wouter-preact/use-location"
import { Signal } from "@preact/signals"
import { v4 as uuidv4 } from 'uuid'

import { showBoardDialog, showCommandPalette } from "../main"
import { State } from "../types/state"
import { Board } from "../types/board"

type Command = {
  id: string
  label: string
  action: () => void
}

export default function TheCommandPalette({ appState }: { appState: Signal<State> }) {
  const [index, setIndex] = useState<number>(0)
  const ref = useRef<HTMLInputElement>(null)
  const [, setLocation] = useLocation()

  const commandsDefault: Command[] = [
    {
      id: uuidv4(),
      label: "Go to Index",
      action: () => {
        setLocation("/")
        showCommandPalette.value = false
      }
    },
    {
      id: uuidv4(),
      label: "Go to About",
      action: () => {
        setLocation("/about")
        showCommandPalette.value = false
      }
    }
  ]

  const buildCommandsForBoards = (boards: Board[]): Command[] => {
    return boards.map(b => {
      return {
        id: uuidv4(),
        label: `Go to board: ${b.name}`,
        action: () => {
          setLocation(`/board/${b.id}`)
          showCommandPalette.value = false
        }
      }
    })
  }

  const commandBoardCreate: Command = {
    id: uuidv4(),
    label: `Create a board`,
    action: () => {
      showCommandPalette.value = false
      setLocation(`/`)
      showBoardDialog.value = true
    }
  }

  const buildCommandsForCards = (board: Board): Command[] => {
    return board.lists.flatMap(l => {
      return l.cards.map(c => {
        return {
          id: uuidv4(),
          label: `Go to card: [${board.name}] ${c.name}`,
          action: () => {
            setLocation(`/board/${board.id}/card/${c.id}`)
            showCommandPalette.value = false
          }
        }
      })
    })
  }

  const buildCommands = (boards: Board[]): Command[] => {
    return [
      ...commandsDefault,
      ...buildCommandsForBoards(boards),
      ...boards.flatMap(b => buildCommandsForCards(b)),
      commandBoardCreate
    ]
  }

  const [commandsFiltered, setCommandsFiltered] = useState<Command[]>(
    buildCommands(appState.value.boards)
  )

  useEffect(() => {
    if (ref.current && showCommandPalette.value) {
      ref.current?.focus()
      setCommandsFiltered(buildCommands(appState.value.boards))
    }
  }, [showCommandPalette.value, setCommandsFiltered])

  const handleClickMask = () => {
    showCommandPalette.value = false
  }

  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    setIndex(0)
    const query = e.currentTarget.value
    if (query === '') {
      setCommandsFiltered(buildCommands(appState.value.boards))
    } else {
      setCommandsFiltered(
        buildCommands(appState.value.boards).filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
      )
    }
  }

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        if (commandsFiltered.length - 1 > index) {
          setIndex(index + 1)
        } else {
          setIndex(0)
        }
        break
      case "ArrowUp":
        if (index <= 0) {
          setIndex(commandsFiltered.length - 1)
        } else {
          setIndex(index - 1)
        }
        break
      case "Enter":
        if (commandsFiltered.length > 0) {
          const c = commandsFiltered[index]
          c.action()
        }
        break
      default:
        break
    }
  }

  return (
    <div>
      {showCommandPalette.value &&
        <div
          class="pattern-mask"
          onClick={handleClickMask}
        />
      }
      <dialog
        open={showCommandPalette}
        class="rounded-2 p-8 layout-center border-solid border-1 border-color-primary pattern-dialog bg-primary"
      >
        <div class="layout-stack-4">
          <div>
            <input
              type="text"
              class="h-8 w-full px-2 border-solid border-1 border-color-primary"
              placeholder="Type a command"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              ref={ref}
            />
          </div>
          <div class="pattern-scrollbar-thin overflow-y-auto">
            <ul class="pattern-height-command-menu-list list-style-none layout-stack-1 ">
              {commandsFiltered.length > 0
                ?
                commandsFiltered.map((command, idx) => (
                  <li key={command.id}>
                    <button
                      onClick={command.action}
                      type="button"
                      class={
                        idx === index
                          ? "bg-secondary px-2 py-1 w-full border-none text-left hover text-secondary text-medium"
                          : "px-2 py-1 w-full bg-transparent border-none text-left hover text-secondary text-medium"
                      }
                    >
                      {command.label}
                    </button>
                  </li>
                ))
                :
                <div class="px-2 py-1 text-secondary">Not found</div>
              }
            </ul>
          </div>
          <pre class="text-secondary">
            enter: select, ↓↑: navigate, ⌘+k: close
          </pre>
        </div>
      </dialog>
    </div>
  )
}
