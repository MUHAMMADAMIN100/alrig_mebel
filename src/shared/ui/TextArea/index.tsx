import {
  AllHTMLAttributes,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useState
} from 'react'
import clsx from 'clsx'
import classes from './text-area.module.scss'

export interface TextAreaProps extends AllHTMLAttributes<HTMLTextAreaElement> {
  ref?: ForwardedRef<HTMLTextAreaElement>
  label: string
  groupProps?: HTMLAttributes<HTMLDivElement>
  labelProps?: HTMLAttributes<HTMLLabelElement>
  errorMessageProps?: HTMLAttributes<HTMLElement>
  errorMessage?: string
  rightSlot?: ReactNode
}

const TextArea = forwardRef(({
                                                  className,
                                                  label,
                                                  errorMessage,
                                                  groupProps,
                                                  labelProps,
                                                  errorMessageProps,
                                                  onFocus,
                                                  onBlur,
                                                  onChange,
                                                  rightSlot = null,
                                                  ...props
                                                }:TextAreaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const id = useId()
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    const input = document.getElementById(id) as HTMLInputElement
    setFocus(input && input.value !== '')
  }, [])

  return (
    <div
      className={clsx(classes.group, groupProps?.className)}
      {...groupProps}
    >
      <div className={classes.main}>
        <label
          htmlFor={id}
          {...labelProps}
          className={clsx(
            classes.label,
            focus && classes.labelFocus,
            labelProps?.className
          )}
        >{label}</label>
        <textarea
          ref={ref}
          {...props}
          className={clsx(
            classes.textArea,
            focus && classes.inputFocus,
            className
          )}
          id={id}
          placeholder=""
          onFocus={(event) => {
            setFocus(true)
            if (onFocus) {
              onFocus(event)
            }
          }}
          onBlur={(event) => {
            setFocus(event.target.value !== '')
            if (onBlur) {
              onBlur(event)
            }
          }}
          onChange={(event) => {
            if (event.target.value !== '') {
              setFocus(true)
            }
            if (onChange) {
              onChange(event)
            }
          }}
        >
          {props.value}
        </textarea>
        {rightSlot}
      </div>
      {!!errorMessage && <small
        title={errorMessage}
        {...errorMessageProps}
        className={clsx(classes.errorMessage, errorMessageProps?.className)}
      >{errorMessage}</small>}
    </div>
  )
})

TextArea.displayName = 'TextArea'

export { TextArea }