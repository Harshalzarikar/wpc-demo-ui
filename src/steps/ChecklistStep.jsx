import { TextArea } from '../components/Field.jsx'
import { CHECKLIST_ITEMS, CHECKLIST_STATUS } from '../data/checklist.js'
import { cx } from '../utils.js'

const STATUS_ORDER = [
  CHECKLIST_STATUS.available,
  CHECKLIST_STATUS.missing,
  CHECKLIST_STATUS.na,
]

export default function ChecklistStep({
  checklist,
  onStatusChange,
  observation,
  recommendation,
  onObservation,
  onRecommendation,
  onBack,
  onNext,
}) {
  return (
    <div>
      <h2 className="page__title">Compliance Checklist</h2>
      <p className="page__subtitle">
        Review the right-to-work parameters extracted by the AI engine.
      </p>

      <section className="card">
        <div className="legend">
          <span className="legend__item">
            <span className="legend__swatch swatch--available" /> Available
          </span>
          <span className="legend__item">
            <span className="legend__swatch swatch--missing" /> Missing
          </span>
          <span className="legend__item">
            <span className="legend__swatch swatch--na" /> N/A
          </span>
        </div>

        <div className="checklist">
          {CHECKLIST_ITEMS.map((item) => {
            const status = checklist[item.key] || 'missing'
            return (
              <div key={item.key} className={cx('checkitem', `is-${status}`)}>
                <span className="checkitem__label">{item.label}</span>
                <div className="seg" role="group" aria-label={item.label}>
                  {STATUS_ORDER.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      data-status={s.id}
                      className={cx('seg__btn', status === s.id && 'is-on')}
                      onClick={() => onStatusChange(item.key, s.id)}
                    >
                      {s.short}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card">
        <div className="grid grid--2">
          <TextArea
            label="Overall Observation"
            placeholder="Enter findings and patterns observed."
            value={observation}
            onChange={(ev) => onObservation(ev.target.value)}
          />
          <TextArea
            label="Recommendation Remarks"
            placeholder="Enter required actions and improvements."
            value={recommendation}
            onChange={(ev) => onRecommendation(ev.target.value)}
          />
        </div>
      </section>

      <div className="actions">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Back to Details
        </button>
        <div className="actions__group">
          <button type="button" className="btn btn--primary" onClick={onNext}>
            Proceed to Review →
          </button>
        </div>
      </div>
    </div>
  )
}
