import { cx } from '../utils.js'

export default function Stepper({ steps, current, onSelect, maxReached }) {
  const currentIndex = steps.findIndex((s) => s.id === current)

  return (
    <div className="stepper" role="tablist" aria-label="Audit steps">
      {steps.map((step, index) => {
        const isActive = step.id === current
        const isDone = index < currentIndex
        const isReachable = index <= maxReached
        return (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={!isReachable}
            className={cx('stepper__tab', isActive && 'is-active', isDone && 'is-done')}
            onClick={() => isReachable && onSelect(step.id)}
          >
            <span className="stepper__dot">{isDone ? '✓' : index + 1}</span>
            {step.label}
          </button>
        )
      })}
    </div>
  )
}
