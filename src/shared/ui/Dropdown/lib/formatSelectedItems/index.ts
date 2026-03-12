import { IDropdownItem } from '../../model/IDropdown' 
import { getDropdownItemsById } from '../getDropdownItemsById' 

type FormatSelectedItemsProps = {
  items: IDropdownItem[]
  selectedItems: number[]
}

export function formatSelectedItems({selectedItems, items}: FormatSelectedItemsProps) {
  return getDropdownItemsById({items, selectedIds: selectedItems})
    .map(item => item.label)
    .join(', ')
}