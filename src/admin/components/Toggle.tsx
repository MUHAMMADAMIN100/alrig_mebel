import classes from '../admin.module.scss'

interface Props {
  label: string
  checked: boolean
  onChange(value: boolean): void
}

export const Toggle = ({ label, checked, onChange }: Props) => {
  return (
    <div className={classes.toggleRow}>
      <span className={classes.toggleLabel}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={checked ? classes.toggleOn : classes.toggle}
        onClick={() => onChange(!checked)}
      />
    </div>
  )
}
