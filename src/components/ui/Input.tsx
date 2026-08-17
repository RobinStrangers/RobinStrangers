import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  success?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, success = false, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? props.name ?? 'field'
  const errorId = `${inputId}-error`
  const describedBy = error ? errorId : undefined

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FC6224]"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`input-field w-full rounded-2xl border bg-[#1C1C1C]/80 px-4 py-3 font-mono text-sm text-[#FC6224] caret-[#FC6224] outline-none transition-all duration-200 placeholder:text-[#FC6224]/35 focus:border-[#FC6224] focus:shadow-[0_0_0_1px_#FC6224] ${
          error
            ? 'border-[#FC6224] input-invalid'
            : success
              ? 'border-[#FC6224] input-valid'
              : 'border-[#FC6224]/40'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-[11px] tracking-wide text-[#FC6224]">
          {error}
        </p>
      ) : null}
    </div>
  )
})
