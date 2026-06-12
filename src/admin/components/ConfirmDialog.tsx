import { Loader2, Trash2 } from 'lucide-react'
import { Modal } from '../../shared/ui/Modal'
import { ICON_SIZE, ICON_STROKE } from '../lib/icons'
import classes from '../admin.module.scss'

interface Props {
  isOpen: boolean
  title: string
  text: string
  confirmLabel?: string
  isLoading?: boolean
  onConfirm(): void
  onCancel(): void
}

export const ConfirmDialog = ({
  isOpen,
  title,
  text,
  confirmLabel = 'Удалить',
  isLoading,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal isOpen={isOpen} close={onCancel} isShowCloseButton={false}>
      <div style={{ width: 380, maxWidth: '100%' }}>
        <h3 className={classes.dialogTitle}>{title}</h3>
        <p className={classes.dialogText}>{text}</p>
        <div className={classes.dialogActions}>
          <button type="button" className={classes.btnGhost} onClick={onCancel} disabled={isLoading}>
            Отмена
          </button>
          <button type="button" className={classes.btnPrimary} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className={classes.btnSpinner} size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
                Удаляем…
              </>
            ) : (
              <>
                <Trash2 size={ICON_SIZE.btn} strokeWidth={ICON_STROKE} />
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
