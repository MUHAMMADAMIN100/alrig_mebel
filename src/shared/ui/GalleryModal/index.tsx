'use client'
import classes from './gallery-modal.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { IProjectImage } from '../../../widgets/projects/model/project'
import ShowIcon from '@icons/show.svg?react'

interface Props {
	open: boolean
	picture: IProjectImage
	close(): void
}

function GalleryModal({ open, close, picture }: Props) {
	return (
		<AnimatePresence>
			{open && <div className={classes.modal}>
				<div onClick={close} className={classes.backdrop} />
				<button
					className={classes.close}
					onClick={close}
					aria-label="Закрыть"
				>
					<ShowIcon
						width={24}
						height={24}
					/>
				</button>
				<motion.div
					initial={{
						opacity: 0,
						scale: .9,
					}}
					animate={{
						opacity: 1,
						scale: 1,
					}}
					exit={{
						opacity: 0,
						scale: .9,
					}}
					className={classes.content}
				>
					<img
						className={classes.img}
						src={picture.image}
						alt=""
						width={1000}
						height={800}
					/>
				</motion.div>
			</div>}
		</AnimatePresence>
	)
}

export default GalleryModal