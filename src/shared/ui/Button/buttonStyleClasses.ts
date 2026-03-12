import clsx from 'clsx'
import { ClassesType } from '../../model/ClassesType'
import { ButtonStyles } from '../../model/ButtonProps'

export function buttonStyleClasses(
  classes: ClassesType,
  styles: ButtonStyles,
): string {
  const { buttonSize, bg, radius, variant, fullWidth } = styles

  return clsx(
    /** desktop classes */
    classes[`size-${buttonSize}`],
    classes[`variant-${variant}`],
    classes[`radius-${radius}`],
    classes[`bg-${bg}`],
    classes[`fullWidth-${fullWidth}`],
  )
}
