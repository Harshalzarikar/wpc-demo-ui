import { CHECKLIST_ITEMS } from '../data/checklist.js'
import { employmentTypeById } from '../data/employees.js'
import { cx } from '../utils.js'

const COLUMNS = ['available', 'missing', 'na']

const COLUMN_LABEL = {
  available: 'Available',
  missing: 'Missing',
  na: 'N/A',
}

export default function ReviewStep({
  company,
  employees,
  checklist,
  observation,
  recommendation,
  onBack,
  onSubmit,
  submitting,
}) {
  const grouped = { available: [], missing: [], na: [] }
  CHECKLIST_ITEMS.forEach((item) => {
    const status = checklist[item.key] || 'missing'
    grouped[status].push(item.label)
  })

  return (
    <div>
      <h2 className="page__title">Review Audit Submission</h2>
      <p className="page__subtitle">
        Verify all details before initiating the final verification process.
      </p>

      <section className="card">
        <h3 className="card__title" style={{ marginBottom: 14 }}>
          Company Details
        </h3>
        <div className="kv">
          <div className="kv__item">
            <span className="kv__key">Company Name</span>
            <span className="kv__val">{company.name || '—'}</span>
          </div>
          <div className="kv__item">
            <span className="kv__key">RTI Document</span>
            <span className="kv__val">{company.rtiFile?.name || '—'}</span>
          </div>
          <div className="kv__item">
            <span className="kv__key">Bank Statements</span>
            <span className="kv__val">
              {company.bankStatements.length
                ? `${company.bankStatements.length} file(s)`
                : '—'}
            </span>
          </div>
          <div className="kv__item">
            <span className="kv__key">Employees</span>
            <span className="kv__val">{employees.length}</span>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="card__title" style={{ marginBottom: 14 }}>
          Employee Summaries
        </h3>
        {employees.map((emp, index) => {
          const type = employmentTypeById(emp.employmentType)
          const docs = Object.values(emp.files).flat().length
          return (
            <div className="empSummary" key={emp.id}>
              <div className="empSummary__row">
                <span className="empSummary__name">
                  {emp.fullName || `Employee ${index + 1}`}
                </span>
                <span className="empSummary__meta">{emp.designation || '—'}</span>
                <span className="pill">
                  {type.tag} · {type.label}
                </span>
                <span className="empSummary__meta">{docs} document(s)</span>
              </div>
            </div>
          )
        })}
      </section>

      <section className="card">
        <div className="summary">
          {COLUMNS.map((key) => (
            <div key={key} className={cx('summary__card', `is-${key}`)}>
              <div className="summary__value">{grouped[key].length}</div>
              <span className="summary__label">{COLUMN_LABEL[key]}</span>
            </div>
          ))}
        </div>

        <div className="reviewGrid">
          {COLUMNS.map((key) => (
            <div className="reviewCol" key={key}>
              <div className={cx('reviewCol__head', `is-${key}`)}>
                {COLUMN_LABEL[key]}
                <span className="reviewCol__count">{grouped[key].length}</span>
              </div>
              {grouped[key].length === 0 ? (
                <p className="reviewCol__empty">None</p>
              ) : (
                <ul>
                  {grouped[key].map((label) => (
                    <li key={label}>
                      <span aria-hidden="true">•</span>
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {(observation || recommendation) && (
        <section className="card">
          <div className="grid grid--2">
            <div>
              <span className="kv__key">Overall Observation</span>
              <p>{observation || '—'}</p>
            </div>
            <div>
              <span className="kv__key">Recommendation Remarks</span>
              <p>{recommendation || '—'}</p>
            </div>
          </div>
        </section>
      )}

      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Back to Checklist
        </button>
        <div className="actions__group">
          <button
            type="button"
            className="btn btn--success"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" /> Running…
              </>
            ) : (
              <>Run Verification ✓</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
