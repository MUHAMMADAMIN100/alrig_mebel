'use client'
import classes from './input.module.scss'
import {
  AllHTMLAttributes,
  ForwardedRef,
  forwardRef,
  HTMLAttributes, ReactNode, useEffect,
  useId,
  useState
} from 'react'
import clsx from 'clsx'

export interface InputProps extends AllHTMLAttributes<HTMLInputElement> {
  ref?: ForwardedRef<HTMLInputElement>
  label: string
  groupProps?: HTMLAttributes<HTMLDivElement>
  labelProps?: HTMLAttributes<HTMLLabelElement>
  errorMessageProps?: HTMLAttributes<HTMLElement>
  errorMessage?: string
  rightSlot?: ReactNode
}

const Input = forwardRef(({
                                            className,
                                            label,
                                            type,
                                            errorMessage,
                                            groupProps,
                                            labelProps,
                                            errorMessageProps,
                                            onFocus,
                                            onBlur,
                                            onChange,
                                            rightSlot = null,
                                            ...props
                                          }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
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
        <input
          ref={ref}
          type={type === 'number' ? 'text' : type}
          className={clsx(
            classes.input,
            focus && classes.inputFocus,
            className
          )}
          {...props}
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
            if (type === 'number') {
              event.target.value = event.target.value.replace(/\D/, '')
            }
            if (onChange) {
              onChange(event)
            }
          }}
        />
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

Input.displayName = 'Input'

export { Input }