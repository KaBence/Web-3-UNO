import {Card ,Type,CardNumber,Colors} from '../../src/model/Card'

export type CardPredicate = (_: Card | undefined) => boolean

export type CardSpec = {
  type?: Type | Type[]
  color?: Colors | Colors[]
  number?: CardNumber | CardNumber[]
}

export function is(spec: CardSpec): CardPredicate {
  function conforms<T>(spec: undefined | T | T[], p: T) {
    if (Array.isArray(spec)) return spec.includes(p)
    if (spec === undefined) return true  
    return spec === p
  }  

  return (c: Card | undefined) => {
    if (c === undefined) return false
    switch(c.getType()) {
      case Type.Numbered:
        return conforms(spec.type, Type.Numbered) && conforms(spec.color, c.getColor()) && conforms(spec.number, c.getNumber())
      case Type.Skip: 
      case Type.Reverse: 
      case Type.Draw:
        return conforms(spec.type, c.getType()) && conforms(spec.color, c.getColor()) && spec.number === undefined
      default:
        return conforms(spec.type, c.getType()) && spec.color === undefined && spec.number === undefined
    }    
  }  
}  

export function not(pred: CardPredicate): CardPredicate {
  return c => !pred(c)
}
