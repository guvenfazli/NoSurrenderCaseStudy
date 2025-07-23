export type ItemType = {
  _id: string,
  itemType: string,
  itemLevel: number,
  itemSpecs: Record<number, Record<string, string>>,
  levelStatus: number
}

export type ItemList = {
  itemList: ItemType[]
}

export type Energy = number

