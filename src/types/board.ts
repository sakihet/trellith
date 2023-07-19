import { BoardList } from "./boardList"

export type Board = {
  id: string
  name: string
  lists: BoardList[]
}
