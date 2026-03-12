import { IDropdownItem } from "../model/IDropdown" 

type PropsItems = {
  items: IDropdownItem[]
  selectedIds: number[]
}

type PropsItem = {
  items: IDropdownItem[]
  selectedIds: number[]
}

export function getDropdownItemsById({items, selectedIds}: PropsItems): IDropdownItem[] {
  return items.filter(item => selectedIds.includes(item.id))
}

export function getDropdownItemById({items, selectedIds}: PropsItem): IDropdownItem | null {
  const selected = items.filter(item => selectedIds.includes(item.id))
  return selected[0] || null
}

