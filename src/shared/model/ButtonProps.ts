import { AllHTMLAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'

type ButtonBg = 'primary' | 'secondary'
type ButtonVariant = 'outlined' | 'contained'
/**
 * full-rounded = height
 * small = 16px
 * */
type ButtonRadius = 'fullRounded' | 'small'
/**
 * large = 60px
 * medium = 56px
 * small = 48px
 * */
type ButtonSize = 'large' | 'medium' | 'small'

export interface ButtonStyles {
  bg?: ButtonBg
  variant?: ButtonVariant
  buttonSize?: ButtonSize
  radius?: ButtonRadius
  fullWidth?: boolean
}

export interface ButtonProps
  extends ButtonStyles,
    AllHTMLAttributes<HTMLButtonElement | LinkProps | HTMLAnchorElement> {
  component?: typeof Link | 'button' | 'a'
  md?: ButtonStyles
  sm?: ButtonStyles
}
