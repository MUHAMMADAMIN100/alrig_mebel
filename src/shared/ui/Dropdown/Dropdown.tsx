'use client'
import classes from './Dropdown.module.scss'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import { DropdownProps } from './model/IDropdown' 
import { formatSelectedItems } from './lib/formatSelectedItems' 
import { AnimatePresence } from 'framer-motion'
import { useOnClickOutside } from 'usehooks-ts'
import { selectDropdownItem } from './lib/selectItem' 
import DropdownList from './DropdownList/DropdownList' 
import DownIcon from '@icons/chevron-down.svg?react'
// import { HandySvg } from 'handy-svg'

function Dropdown({
	className,
	label,
	multiple,
	classNames,
	items,
	open = false,
	state: selectedItems,
	setState: setSelectedItems,
	direction,
	onChange
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(open)
	const ref = useRef(null)
	const selectedFormat = formatSelectedItems({ selectedItems, items })
	const close = () => setIsOpen(false)
	const toggle = () => setIsOpen(!isOpen)
	useOnClickOutside(ref, close)
	const selectHandler = (id: number) => {
		selectDropdownItem({
			id,
			setSelectedItems,
			selectedItems,
			close,
			multiple
		})
	}
	return (
		<div
			ref={ref}
			className={clsx(classes.Wrapper, className)}
		>
			<div
				tabIndex={0}
				className={clsx(classes.Input, classNames?.input, isOpen && classes.Open)}
				onClick={toggle}
				onKeyUp={(event) => {
					if (event.code === 'Space') toggle()
				}}
			>
				<label
					className={clsx(classes.Label, classNames?.label, (selectedFormat || isOpen) && classes.LabelTop)}
				>{label}</label>
				{selectedFormat &&
					<p className={clsx(classes.Value, classNames?.value)} title={selectedFormat}>{selectedFormat}</p>}
				<DownIcon
					// src="/assets/icons/chevron-down.svg"
					className={clsx(classes.Down, classNames?.icon)}
					width={20}
					height={20}
				/>
			</div>
			<AnimatePresence>
				{isOpen && <DropdownList
					className={classNames?.list}
					itemClassName={classNames?.item}
					items={items}
					selectHandler={selectHandler}
					multiple={multiple}
					selectedItems={selectedItems}
					direction={direction}
					onChange={onChange}
				/>}
			</AnimatePresence>
		</div>
	)
}

export default Dropdown