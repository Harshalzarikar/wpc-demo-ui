import { useEffect } from 'react'
import { cx } from '../utils.js'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onClose, toast.duration ?? 4500)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className={cx('toast', `toast--${toast.type}`)} role="status">
      <span className="toast__icon" aria-hidden="true">
        {toast.type === 'success' ? '✓' : toast.type === 'info' ? 'i' : '!'}
      </span>
      <div className="toast__body">
        <p className="toast__title">{toast.title}</p>
        {toast.message && <p className="toast__message">{toast.message}</p>}
      </div>
      <button type="button" className="toast__close" onClick={onClose} aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
