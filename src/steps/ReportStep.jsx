import { apiBaseUrl, apiConfigured } from '../api/client.js'
import { CHECKLIST_ITEMS } from '../data/checklist.js'

const COLUMNS = ['available', 'missing', 'na']
const COLUMN_LABEL = { available: 'Available', missing: 'Missing', na: 'N/A' }

export default function ReportStep({ result, checklist, onBack, onNew }) {
  if (!result) {
    return (
      <div>
        <h2 className="page__title">Audit Report</h2>
        <p className="page__subtitle">Run the verification to generate the report.</p>
        <div className="card">
          <p className="empty">No verification has been run yet.</p>
        </div>
        <div className="actions">
          <div className="actions__group">
            <button type="button" className="btn btn--primary" onClick={onBack}>
              ← Back to Review
            </button>
          </div>
        </div>
      </div>
    )
  }

  const counts = { available: 0, missing: 0, na: 0 }
  CHECKLIST_ITEMS.forEach((item) => {
    counts[checklist[item.key] || 'missing'] += 1
  })

  return (
    <div>
      <h2 className="page__title">Audit Report</h2>
      <p className="page__subtitle">Verification submitted successfully.</p>

      <section className="card">
        <div className="summary">
          {COLUMNS.map((key) => (
            <div key={key} className={`summary__card is-${key}`}>
              <div className="summary__value">{counts[key]}</div>
              <span className="summary__label">{COLUMN_LABEL[key]}</span>
            </div>
          ))}
        </div>

        <div className="kv">
          <div className="kv__item">
            <span className="kv__key">Audit Reference</span>
            <span className="kv__val">{result.id || '—'}</span>
          </div>
          <div className="kv__item">
            <span className="kv__key">Company</span>
            <span className="kv__val">{result.company?.name || '—'}</span>
          </div>
          <div className="kv__item">
            <span className="kv__key">Status</span>
            <span className="kv__val">{result.status}</span>
          </div>
          <div className="kv__item">
            <span className="kv__key">Submitted At</span>
            <span className="kv__val">{new Date(result.verifiedAt).toLocaleString()}</span>
          </div>
        </div>

        <p className="field__note" style={{ marginTop: 14 }}>
          {apiConfigured
            ? `Report synced with ${apiBaseUrl()}.`
            : 'Local preview mode — no backend configured.'}
        </p>
      </section>

      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Back to Review
        </button>
        <div className="actions__group">
          <button type="button" className="btn btn--primary" onClick={onNew}>
            Start New Audit
          </button>
        </div>
      </div>
    </div>
  )
}
