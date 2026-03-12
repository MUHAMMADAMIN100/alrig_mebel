import classes from './DropdownItem.module.scss'
import clsx from 'clsx'
import { IDropdownItem } from '../../model/IDropdown'
// import { HandySvg } from 'handy-svg'
// import { useId } from 'react'
import IconChecked from "@icons/checked.svg?react"

interface DropdownItemProps {
	item: IDropdownItem
	className?: string
	selectHandler: (id: number) => void
	multiple?: boolean
	selectedItems: number[]
	onChange?: (event: string) => void
}

function DropdownItem({
	item,
	multiple,
	className,
	selectedItems,
	selectHandler,
	onChange
}: DropdownItemProps) {

	return (
		<li
			tabIndex={0}
			className={clsx(classes.Item, className)}
			onClick={(e) => {
				e.preventDefault()
				selectHandler(item.id)
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				onChange && item.value !== undefined && onChange(item.value)
			}}
			onKeyUp={(event) => {
				if (event.code === 'Space') selectHandler(item.id) 
			}}
		>
			{multiple && (
				<DropdownMultiple
					id={item.id}
					selectedItems={selectedItems}
				/>
			)}
			<span className={classes.label}>{item.label}</span>
			{item.image && <img 
				src={item.image}
				width={50}
				height={50}
			/>}
		</li>
	)
}

function DropdownMultiple({
	id,
	selectedItems,
}: { id: number, selectedItems: number[] }) {
	return (
		<span
			className={clsx(classes.Checkbox, selectedItems.includes(id) && classes.Active)}
		>
			<IconChecked />
			{/* <img
				src="/assets/icons/checked.svg"
				width={24}
				height={24}
			/> */}
		</span>
	)
}

export default DropdownItem