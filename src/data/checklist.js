// Right-to-work / post-compliance checklist.
// `status` defaults mirror the values extracted by the AI engine in the
// reference design: 3 available, 2 missing, 1 N/A.
export const CHECKLIST_STATUS = {
  available: { id: 'available', label: 'Available', short: 'A' },
  missing: { id: 'missing', label: 'Missing', short: 'M' },
  na: { id: 'na', label: 'N/A', short: 'N/A' },
}

export const CHECKLIST_ITEMS = [
  { key: 'passport', label: 'Passport', status: 'na' },
  { key: 'brp', label: 'BRP / eVisa', status: 'available' },
  { key: 'visaVignette', label: 'Visa Vignette', status: 'available' },
  { key: 'cos', label: 'COS', status: 'missing' },
  { key: 'rightToWork', label: 'Right to work check', status: 'missing' },
  { key: 'proofOfAddress', label: 'Proof of address', status: 'available' },
  { key: 'contactHistory', label: 'History of contact details (evidence)', status: 'missing' },
  { key: 'circumstanceTracking', label: 'Change of circumstance tracking', status: 'missing' },
  { key: 'personalInfo', label: 'Personal information', status: 'missing' },
  { key: 'employmentContract', label: 'Employment contract', status: 'missing' },
  { key: 'cvCandidate', label: 'CV (candidate)', status: 'missing' },
  { key: 'experienceLetter', label: 'Experience Letter', status: 'missing' },
  { key: 'experienceLetterValidation', label: 'Experience letter validation', status: 'missing' },
  { key: 'cvUnsuccessful', label: 'CV (unsuccessful candidates)', status: 'missing' },
  { key: 'jobAdvert', label: 'Job advert', status: 'missing' },
  { key: 'interviewNote', label: 'Interview note (candidate)', status: 'missing' },
  { key: 'interviewNotesUnsuccessful', label: 'Interview notes (unsuccessful candidates)', status: 'missing' },
  { key: 'englishProficiency', label: 'English Language Proficiency test', status: 'missing' },
  { key: 'tbTest', label: 'TB Test', status: 'missing' },
  { key: 'p45', label: 'P45 (previous employer)', status: 'missing' },
  { key: 'attendance', label: 'Attendance records', status: 'missing' },
  { key: 'evidenceOfWork', label: 'Evidence of Work', status: 'missing' },
  { key: 'holidayLeave', label: 'Holiday / Leave records', status: 'missing' },
  { key: 'unauthorizedAbsence', label: 'Unauthorized Absence', status: 'missing' },
  { key: 'workLocationChanged', label: 'Work Location changed', status: 'missing' },
  { key: 'statutoryLeaves', label: 'Statutory Leaves', status: 'missing' },
  { key: 'visaMonitoring', label: 'Visa Monitoring', status: 'missing' },
  { key: 'referenceLetter', label: 'Reference letter', status: 'missing' },
  { key: 'applicationForm', label: 'Application form', status: 'missing' },
  { key: 'pensionDocuments', label: 'Pension documents', status: 'missing' },
  { key: 'noc', label: 'NOC', status: 'missing' },
]

export function defaultChecklist() {
  return CHECKLIST_ITEMS.reduce((acc, item) => {
    acc[item.key] = item.status || 'missing'
    return acc
  }, {})
}

export function checklistLabel(key) {
  const item = CHECKLIST_ITEMS.find((i) => i.key === key)
  return item ? item.label : key
}
