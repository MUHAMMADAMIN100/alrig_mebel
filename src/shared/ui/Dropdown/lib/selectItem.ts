

type SelectItemProps = {
  id: number
  selectedItems: number[]
  setSelectedItems: (items: number[]) => any
  close: () => void
  multiple?: boolean
}

export function selectDropdownItem({
														selectedItems,
														setSelectedItems,
														id,
														multiple,
														close
                          }: SelectItemProps) {
  if (selectedItems.includes(id)) {
    if (multiple) {
      setSelectedItems(selectedItems.filter(selected => selected !== id))
    } else {
      setSelectedItems([id])
      close()
    }
  } else {
    if (multiple) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems([id])
      close()
    }
  }
}