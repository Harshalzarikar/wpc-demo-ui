import { cx } from '../utils.js'

export function TextField({ label, required, error, hint, ...props }) {
  return (
    <div className="field">
      <label className="field__label">
        {label}
        {required && <span className="field__req">*</span>}
      </label>
      <input className={cx('input', error && 'is-invalid')} {...props} />
      {error ? (
        <span className="field__note is-error">{error}</span>
      ) : hint ? (
        <span className="field__note">{hint}</span>
      ) : null}
    </div>
  )
}

export function TextArea({ label, hint, ...props }) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      <textarea className="textarea" {...props} />
      {hint && <span className="field__note">{hint}</span>}
    </div>
  )
}
