type TaskProgressProps = {
  completed: number
  total: number
  current: number
}

export function TaskProgress({ completed, total, current }: TaskProgressProps) {
  const display = Math.min(Math.max(current, 1), total)

  return (
    <div className="flex items-center justify-between gap-4" aria-live="polite">
      <p className="font-mono text-[11px] tracking-[0.16em] text-[#FC6224]">
        {display} / {total}
      </p>
      <div className="flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`progress-dot ${index < completed ? 'is-on' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
