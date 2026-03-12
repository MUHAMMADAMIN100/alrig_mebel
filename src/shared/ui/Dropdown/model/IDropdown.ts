import { Dispatch, SetStateAction } from 'react'

export interface DropdownProps {
  className?: string
  classNames?: {
    input?: string
    label?: string
    value?: string
    icon?: string
    list?: string
    item?: string
  }
  label: string
  items: IDropdownItem[]
  defaultSelected?: number
  multiple?: boolean
  onChange?: (event: string) => void
  open?: boolean
  state: number[],
  setState: Dispatch<SetStateAction<number[]>>
  direction?: 'to-top' | 'to-bottom'
}

export interface IDropdownItem {
  id: number
  label: string
  value?: string
  price?: number
  image?: string
}

