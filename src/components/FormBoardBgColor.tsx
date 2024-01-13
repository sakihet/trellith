import { JSX } from "preact/jsx-runtime"
import { BgColor } from "../types/bgColor"

export default function FormBoardBgColor(
  {
    selectedBgColor,
    selectBgColor
  }: {
    selectedBgColor: BgColor | null,
    selectBgColor: (e: JSX.TargetedMouseEvent<HTMLInputElement>) => void
  }) {
  return (
    <div class="nowrap layout-stack-horizontal-1">
      <label>
        <input class="unset" type="radio" name="bgColor" value="none" checked={!selectedBgColor} onClick={selectBgColor} />
        <div class="w-6 h-6 bg-primary inline-block border-solid border-1 border-color-primary pattern-color-palette" />
      </label>
      <label>
        <input class="unset" type="radio" name="bgColor" value="red" checked={selectedBgColor === 'red'} onClick={selectBgColor} />
        <div class="w-6 h-6 bg-red inline-block border-solid border-1 border-color-primary pattern-color-palette" />
      </label>
      <label>
        <input class="unset" type="radio" name="bgColor" value="yellow" checked={selectedBgColor === 'yellow'} onClick={selectBgColor} />
        <div class="w-6 h-6 bg-yellow inline-block border-solid border-1 border-color-primary pattern-color-palette" />
      </label>
      <label>
        <input class="unset" type="radio" name="bgColor" value="green" checked={selectedBgColor === 'green'} onClick={selectBgColor} />
        <div class="w-6 h-6 bg-green inline-block border-solid border-1 border-color-primary pattern-color-palette" />
      </label>
      <label>
        <input class="unset" type="radio" name="bgColor" value="blue" checked={selectedBgColor === 'blue'} onClick={selectBgColor} />
        <div class="w-6 h-6 bg-blue inline-block border-solid border-1 border-color-primary pattern-color-palette" />
      </label>
      <label>
        <input class="unset" type="radio" name="bgColor" value="cyan" checked={selectedBgColor === 'cyan'} onClick={selectBgColor} />
        <div class="w-6 h-6 bg-cyan inline-block border-solid border-1 border-color-primary pattern-color-palette" />
      </label>
      <label>
        <input class="unset" type="radio" name="bgColor" value="magenta" checked={selectedBgColor === 'magenta'} onClick={selectBgColor} />
        <div class="w-6 h-6 bg-magenta inline-block border-solid border-1 border-color-primary pattern-color-palette" />
      </label>
    </div>
  )
}
