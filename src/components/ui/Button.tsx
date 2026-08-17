import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'task'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
  complete?: boolean
}

export function Button({
  variant = 'primary',
  children,
  complete = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const base =
    'btn relative inline-flex items-center justify-center overflow-hidden rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6224] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1C] disabled:cursor-not-allowed disabled:opacity-35'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'border-[#FC6224] bg-[#FC6224] text-[#1C1C1C] hover:enabled:translate-y-[-1px] hover:enabled:brightness-110 active:enabled:translate-y-[1px] active:enabled:scale-[0.98]',
    ghost:
      'border-[#FC6224] bg-transparent text-[#FC6224] hover:enabled:bg-[#FC6224]/10 active:enabled:scale-[0.98]',
    task:
      'min-w-[8.5rem] border-[#FC6224] bg-transparent text-[#FC6224] hover:enabled:bg-[#FC6224] hover:enabled:text-[#1C1C1C] active:enabled:scale-[0.98]',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${complete ? 'btn-complete' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-[1]">{children}</span>
    </button>
  )
}
