import * as card from '../../src/model/Card'

export type CardPredicate = (_: card.Card | undefined) => boolean

export type CardSpec = {
  type?: card.Type | card.Type[]
  color?: card.Colors | card.Colors[]
  number?: card.CardNumber | card.CardNumber[]
}

export function is(spec: CardSpec): CardPredicate {
  function conforms<T>(spec: undefined | T | T[], p: T) {
    if (Array.isArray(spec)) return spec.includes(p)
    if (spec === undefined) return true  
    return spec === p
  }  

  return (c: card.Card | undefined) => {
    if (c === undefined) return false
    switch(c.Type) {
      case card.Type.Numbered:
        return conforms(spec.type, card.Type.Numbered) && conforms(spec.color, c.Color) && conforms(spec.number, c.CardNumber)
      case card.Type.Skip: 
      case card.Type.Reverse: 
      case card.Type.DrawTwo:
        return conforms(spec.type, c.Type) && conforms(spec.color, c.Color) && spec.number === undefined
      default:
        return conforms(spec.type, c.Type) && spec.color === undefined && spec.number === undefined
    }    
  }  
}  

export function not(pred: CardPredicate): CardPredicate {
  return c => !pred(c)
}
