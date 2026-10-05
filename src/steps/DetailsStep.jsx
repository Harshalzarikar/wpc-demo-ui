import FileDropZone from '../components/FileDropZone.jsx'
import { TextField } from '../components/Field.jsx'
import { EMPLOYMENT_TYPES, employmentTypeById } from '../data/employees.js'
import { cx } from '../utils.js'

const SINGLE_HINT = 'PDF, PNG, JPG, WEBP - single file'
const MULTI_HINT = 'PDF, PNG, JPG, WEBP - multiple files allowed'

export default function DetailsStep({
  company,
  onCompanyChange,
  employees,
  onEmployeeChange,
  onAddEmployee,
  onRemoveEmployee,
  onSubmit,
  submitting,
  errors,
}) {
  const e = errors || {}

  return (
    <div>
      <h2 className="page__title">Document Verification</h2>
      <p className="page__subtitle">
        Complete company documents first, then attach employee details.
      </p>

      <section className="card">
        <div className="card__head">
          <div>
            <h3 className="card__title">
              <span className="card__step">1</span> Company Documents
            </h3>
            <p className="card__hint">
              RTI upload and bank statements — submitted once per company.
            </p>
          </div>
        </div>

        <div className="grid grid--2">
          <TextField
            label="Company Name"
            required
            placeholder="e.g. Acme Care Ltd"
            value={company.name}
            error={e['company.name']}
            onChange={(ev) => onCompanyChange({ name: ev.target.value })}
          />
        </div>

        <div className="divider" />

        <div className="grid grid--2">
          <FileDropZone
            label="RTI Document"
            required
            hint={SINGLE_HINT}
            files={company.rtiFile ? [company.rtiFile] : []}
            onFiles={(files) => onCompanyChange({ rtiFile: files[0] || null })}
            onRemove={() => onCompanyChange({ rtiFile: null })}
          />
          <FileDropZone
            label="Bank Statements (last 3+ months)"
            required
            multiple
            hint={MULTI_HINT}
            files={company.bankStatements}
            onFiles={(files) => onCompanyChange({ bankStatements: files })}
            onRemove={(index) =>
              onCompanyChange({
                bankStatements: company.bankStatements.filter((_, i) => i !== index),
              })
            }
          />
        </div>
      </section>

      <section className="card">
        <div className="card__head">
          <div>
            <h3 className="card__title">
              <span className="card__step">2</span> Employee Details
            </h3>
            <p className="card__hint">
              Add one entry per employee — COS, payslips, and employment type.
            </p>
          </div>
        </div>

        {employees.map((emp, index) => {
          const type = employmentTypeById(emp.employmentType)
          return (
            <div className="employee" key={emp.id}>
              <div className="employee__head">
                <h4 className="employee__title">Employee {index + 1}</h4>
                {employees.length > 1 && (
                  <button
                    type="button"
                    className="employee__remove"
                    onClick={() => onRemoveEmployee(emp.id)}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              <div className="grid grid--2">
                <TextField
                  label="Full Name"
                  required
                  placeholder="e.g. Jane Doe"
                  value={emp.fullName}
                  error={e[`employee.${emp.id}.fullName`]}
                  onChange={(ev) => onEmployeeChange(emp.id, { fullName: ev.target.value })}
                />
                <TextField
                  label="Designation"
                  required
                  placeholder="e.g. Senior Care Assistant"
                  value={emp.designation}
                  error={e[`employee.${emp.id}.designation`]}
                  onChange={(ev) => onEmployeeChange(emp.id, { designation: ev.target.value })}
                />
              </div>

              <div className="field" style={{ marginTop: 16 }}>
                <label className="field__label">
                  Employment Type<span className="field__req">*</span>
                </label>
                <div className="cases">
                  {EMPLOYMENT_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      className={cx('case', emp.employmentType === t.id && 'is-selected')}
                      onClick={() => onEmployeeChange(emp.id, { employmentType: t.id, files: {} })}
                    >
                      <span className="case__head">
                        <span className="case__radio" />
                        <span className="case__label">{t.label}</span>
                        <span className="case__tag">{t.tag}</span>
                      </span>
                      <span className="case__desc">{t.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider" />

              <div className="grid grid--2">
                {type.documents.map((doc) => (
                  <FileDropZone
                    key={doc.key}
                    label={doc.label}
                    required={doc.required}
                    multiple={doc.multiple}
                    hint={doc.multiple ? MULTI_HINT : SINGLE_HINT}
                    files={emp.files[doc.key] || []}
                    onFiles={(files) =>
                      onEmployeeChange(emp.id, { files: { ...emp.files, [doc.key]: files } })
                    }
                    onRemove={(i) =>
                      onEmployeeChange(emp.id, {
                        files: {
                          ...emp.files,
                          [doc.key]: (emp.files[doc.key] || []).filter((_, idx) => idx !== i),
                        },
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}

        <button type="button" className="btn btn--ghost" onClick={onAddEmployee}>
          <span aria-hidden="true">＋</span> Add Another Employee
        </button>
      </section>

      <div className="actions">
        <span className="actions__note">
          <span aria-hidden="true">🔒</span>
          All files are sent securely for AI analysis. Results are saved to the local database.
        </span>
        <div className="actions__group">
          <button
            type="button"
            className="btn btn--primary"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" /> Submitting…
              </>
            ) : (
              <>Proceed to Checklist →</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
