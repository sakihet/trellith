import { BgColor } from "./bgColor"
import { List } from "./list"

export type Board = {
  id: string
  name: string
  lists: List[]
  bgColor: BgColor | null
}
