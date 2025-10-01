import type { Colors, CardNumber, Type } from "../../../../Domain/src/model/Card"

// Public view of a Card (no private fields)
export type GameCardLike = {
  getType(): Type
  getPointValue(): number
  getColor(): Colors | undefined
  getNumber(): CardNumber | undefined
  hasColor(color: Colors): boolean
  hasNumber(n: CardNumber): boolean
}
