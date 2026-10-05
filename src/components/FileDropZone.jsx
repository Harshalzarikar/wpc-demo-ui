import { useRef, useState } from 'react'
import { cx, formatBytes } from '../utils.js'

export default function FileDropZone({
  label,
  hint,
  accept = 'application/pdf,image/png,image/jpeg,image/webp',
  multiple = false,
  required = false,
  files,
  onFiles,
  onRemove,
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const list = files || []

  function addFiles(fileList) {
    const incoming = Array.from(fileList || [])
    if (!incoming.length) return
    onFiles(multiple ? [...list, ...incoming] : [incoming[0]])
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div className="field">
      <label className="field__label">
        {label}
        {required && <span className="field__req">*</span>}
      </label>

      <button
        type="button"
        className={cx('dropzone', dragging && 'is-dragging')}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <span className="dropzone__icon" aria-hidden="true">⤒</span>
        <span className="dropzone__title">Drop or click to upload</span>
        {hint && <span className="dropzone__hint">{hint}</span>}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {list.length > 0 && (
        <ul className="filelist">
          {list.map((file, index) => (
            <li key={`${file.name}-${index}`} className="filelist__item">
              <span className="filelist__name" title={file.name}>
                {file.name}
              </span>
              <span className="filelist__size">{formatBytes(file.size)}</span>
              <button
                type="button"
                className="filelist__remove"
                aria-label={`Remove ${file.name}`}
                onClick={() => onRemove(index)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
