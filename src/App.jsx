import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Stepper from './components/Stepper.jsx'
import Toast from './components/Toast.jsx'
import DetailsStep from './steps/DetailsStep.jsx'
import ChecklistStep from './steps/ChecklistStep.jsx'
import ReviewStep from './steps/ReviewStep.jsx'
import ReportStep from './steps/ReportStep.jsx'
import { defaultChecklist } from './data/checklist.js'
import { employmentTypeById } from './data/employees.js'
import { apiConfigured, submitDetails, submitVerification } from './api/client.js'
import { uid } from './utils.js'

const STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'review', label: 'Review' },
  { id: 'report', label: 'Report' },
]

function newEmployee() {
  return { id: uid(), fullName: '', designation: '', employmentType: 'A', files: {} }
}

function blankCompany() {
  return { name: '', rtiFile: null, bankStatements: [] }
}

export default function App() {
  const [step, setStep] = useState('details')
  const [maxReached, setMaxReached] = useState(0)
  const [company, setCompany] = useState(blankCompany)
  const [employees, setEmployees] = useState(() => [newEmployee()])
  const [checklist, setChecklist] = useState(defaultChecklist)
  const [observation, setObservation] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [auditId, setAuditId] = useState(null)
  const [result, setResult] = useState(null)

  function notify(type, title, message) {
    setToast({ id: uid(), type, title, message })
  }

  function goTo(id) {
    const index = STEPS.findIndex((s) => s.id === id)
    if (index < 0) return
    setStep(id)
    setMaxReached((current) => Math.max(current, index))
  }

  function updateCompany(patch) {
    setCompany((current) => ({ ...current, ...patch }))
  }

  function updateEmployee(id, patch) {
    setEmployees((list) => list.map((emp) => (emp.id === id ? { ...emp, ...patch } : emp)))
  }

  function addEmployee() {
    setEmployees((list) => [...list, newEmployee()])
  }

  function removeEmployee(id) {
    setEmployees((list) => list.filter((emp) => emp.id !== id))
  }

  function setStatus(key, value) {
    setChecklist((current) => ({ ...current, [key]: value }))
  }

  function validateDetails() {
    const nextErrors = {}
    const missingDocs = []

    if (!company.name.trim()) nextErrors['company.name'] = 'Company name is required'
    if (!company.rtiFile) missingDocs.push('RTI Document')
    if (company.bankStatements.length === 0) missingDocs.push('Bank Statements')

    employees.forEach((emp, index) => {
      if (!emp.fullName.trim()) {
        nextErrors[`employee.${emp.id}.fullName`] = 'Full name is required'
      }
      if (!emp.designation.trim()) {
        nextErrors[`employee.${emp.id}.designation`] = 'Designation is required'
      }
      employmentTypeById(emp.employmentType)
        .documents.filter((doc) => doc.required)
        .forEach((doc) => {
          if (!(emp.files[doc.key] || []).length) {
            missingDocs.push(`${doc.label} (Employee ${index + 1})`)
          }
        })
    })

    return { nextErrors, missingDocs }
  }

  function buildDetailsFormData() {
    const formData = new FormData()
    formData.append('companyName', company.name)
    if (company.rtiFile) formData.append('rtiDocument', company.rtiFile, company.rtiFile.name)
    company.bankStatements.forEach((file) =>
      formData.append('bankStatements', file, file.name),
    )
    formData.append(
      'employees',
      JSON.stringify(
        employees.map((emp) => ({
          id: emp.id,
          fullName: emp.fullName,
          designation: emp.designation,
          employmentType: emp.employmentType,
        })),
      ),
    )
    employees.forEach((emp, index) => {
      Object.entries(emp.files).forEach(([key, files]) => {
        (files || []).forEach((file) =>
          formData.append(`employeeFiles[${index}][${key}]`, file, file.name),
        )
      })
    })
    return formData
  }

  async function handleDetailsSubmit() {
    const { nextErrors, missingDocs } = validateDetails()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length || missingDocs.length) {
      notify(
        'error',
        'Please complete the required fields',
        missingDocs.length
          ? `Missing documents: ${missingDocs.join(', ')}`
          : 'Some required fields are empty.',
      )
      return
    }

    setSubmitting(true)
    try {
      if (apiConfigured) {
        const response = await submitDetails(buildDetailsFormData())
        setAuditId(response?.id ?? response?.auditId ?? null)
        notify('success', 'Documents submitted', 'AI extraction complete — review the checklist.')
      } else {
        setAuditId(`local-${uid()}`)
        notify('success', 'Saved locally', 'No API base configured — running in preview mode.')
      }
      setErrors({})
      goTo('checklist')
    } catch (error) {
      if (error.isNetworkError) {
        setAuditId(`local-${uid()}`)
        setErrors({})
        notify(
          'warning',
          'Backend unreachable — continuing in preview mode',
          `${error.message}. The form was not saved.`,
        )
        goTo('checklist')
      } else {
        notify('error', 'Submission failed', error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerification() {
    const payload = {
      auditId,
      company: {
        name: company.name,
        rtiDocument: company.rtiFile?.name ?? null,
        bankStatements: company.bankStatements.map((file) => file.name),
      },
      employees: employees.map((emp) => ({
        id: emp.id,
        fullName: emp.fullName,
        designation: emp.designation,
        employmentType: emp.employmentType,
        documents: Object.entries(emp.files).map(([key, files]) => ({
          key,
          files: (files || []).map((file) => file.name),
        })),
      })),
      checklist,
      overallObservation: observation,
      recommendationRemarks: recommendation,
    }

    setSubmitting(true)
    try {
      let response = null
      if (apiConfigured) {
        response = await submitVerification(payload)
      }

      setResult({
        ...payload,
        id: response?.id ?? auditId,
        status: response?.status ?? (apiConfigured ? 'submitted' : 'preview'),
        verifiedAt: new Date().toISOString(),
      })
      notify('success', 'Verification initiated', 'Your audit has been submitted for verification.')
      goTo('report')
    } catch (error) {
      if (error.isNetworkError) {
        setResult({
          ...payload,
          id: auditId ?? `local-${uid()}`,
          status: 'preview',
          verifiedAt: new Date().toISOString(),
        })
        notify(
          'warning',
          'Backend unreachable — report generated locally',
          `${error.message}. Nothing was submitted.`,
        )
        goTo('report')
      } else {
        notify('error', 'Verification failed', error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  function resetAudit() {
    setCompany(blankCompany())
    setEmployees([newEmployee()])
    setChecklist(defaultChecklist())
    setObservation('')
    setRecommendation('')
    setErrors({})
    setAuditId(null)
    setResult(null)
    setMaxReached(0)
    setStep('details')
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TopBar />
        <div className="content">
          <Stepper steps={STEPS} current={step} maxReached={maxReached} onSelect={goTo} />

          {step === 'details' && (
            <DetailsStep
              company={company}
              onCompanyChange={updateCompany}
              employees={employees}
              onEmployeeChange={updateEmployee}
              onAddEmployee={addEmployee}
              onRemoveEmployee={removeEmployee}
              onSubmit={handleDetailsSubmit}
              submitting={submitting}
              errors={errors}
            />
          )}

          {step === 'checklist' && (
            <ChecklistStep
              checklist={checklist}
              onStatusChange={setStatus}
              observation={observation}
              recommendation={recommendation}
              onObservation={setObservation}
              onRecommendation={setRecommendation}
              onBack={() => goTo('details')}
              onNext={() => goTo('review')}
            />
          )}

          {step === 'review' && (
            <ReviewStep
              company={company}
              employees={employees}
              checklist={checklist}
              observation={observation}
              recommendation={recommendation}
              onBack={() => goTo('checklist')}
              onSubmit={handleVerification}
              submitting={submitting}
            />
          )}

          {step === 'report' && (
            <ReportStep
              result={result}
              checklist={checklist}
              onBack={() => goTo('review')}
              onNew={resetAudit}
            />
          )}
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
