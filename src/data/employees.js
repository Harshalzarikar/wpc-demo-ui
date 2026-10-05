// Employment types from the reference design. Each case defines the documents
// that must be attached for the employee.
export const EMPLOYMENT_TYPES = [
  {
    id: 'A',
    label: 'Sponsored — New Hire',
    tag: 'Case A',
    description: 'Recruited specifically for the sponsored role',
    documents: [
      { key: 'cos', label: 'Certificate of Sponsorship (COS)', required: true, multiple: false },
      { key: 'cv', label: 'CV', required: false, multiple: false },
    ],
  },
  {
    id: 'B',
    label: 'Sponsored — Existing Staff',
    tag: 'Case B',
    description: 'Already employed, then assigned a Certificate of Sponsorship',
    documents: [
      { key: 'payslips', label: 'Payslips', required: true, multiple: true },
      { key: 'reference', label: 'Reference / Exp. Letter', required: false, multiple: false },
    ],
  },
  {
    id: 'C',
    label: 'Not Sponsored',
    tag: 'Case C',
    description: 'A non-sponsored worker (recruitment documents optional)',
    documents: [
      { key: 'governmentDoc', label: 'Government Document', required: true, multiple: false },
      { key: 'passport', label: 'Passport', required: false, multiple: false },
    ],
  },
]

export function employmentTypeById(id) {
  return EMPLOYMENT_TYPES.find((t) => t.id === id) || EMPLOYMENT_TYPES[0]
}
