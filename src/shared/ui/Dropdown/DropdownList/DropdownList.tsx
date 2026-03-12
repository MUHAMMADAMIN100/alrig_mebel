import classes from './DropdownList.module.scss'
import { motion } from 'framer-motion'
import { IDropdownItem } from '../model/IDropdown' 
import clsx from 'clsx'
import DropdownItem from './DropdownItem/DropdownItem'

interface Props {
  items: IDropdownItem[]
  selectHandler: (id: number) => void
  className?: string
  itemClassName?: string
  multiple?: boolean
  selectedItems: number[]
  direction?: 'to-bottom' | 'to-top'
  onChange?: (event: string) => void
}

function DropdownList({
                        selectHandler,
                        items,
                        selectedItems,
                        itemClassName,
                        className,
                        multiple,
                        direction = 'to-bottom',
                        onChange
                      }: Props) {

  return (
    <motion.ul
      initial={{
        opacity: 0,
        y: direction === 'to-bottom' ? 10 : -10
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          type: 'tween',
          duration: .10
        }
      }}
      exit={{
        opacity: 0,
        y: direction === 'to-bottom' ? 10 : -10
      }}
      className={clsx(classes.List, direction === 'to-top' && classes.ToTop, className)}
    >
      {items.map((item) => (
        <DropdownItem
          key={item.id}
          className={itemClassName}
          item={item}
          selectHandler={selectHandler}
          multiple={multiple}
          selectedItems={selectedItems}
          onChange={onChange}
        />
      ))}
    </motion.ul>
  )
}

export default DropdownList